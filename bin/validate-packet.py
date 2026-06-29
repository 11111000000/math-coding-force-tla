#!/usr/bin/env python3
"""
MathCoding packet validator.

Checks the structural soundness of a task packet and (optionally) the
newer semantic checks added in `protocol-strengthening`.

Exit codes:
  0 — packet valid (strict checks pass or are disabled)
  1 — usage error
  2 — required file missing
  3 — strict check failed (refinement, traceability, assumptions hash)
  4 — traceability.task_id mismatch
  5 — invalid verdict
  6 — traceability gap (TODO target) — informational, also returned for gaps
  7 — UNVERIFIABLE:* packet missing human_review block

Strict (semantic) checks are gated by:
  - env var MATHCODING_STRICT_VALIDATION=1 (and == "1")
  - per-packet opt-in via packet.json.strict: true

The default behaviour (strict checks OFF) preserves validation of all
existing packets. Turning strict on per packet lets us roll out
semantic checks one at a time without breaking the rest.
"""

import hashlib
import json
import os
import re
import sys
from pathlib import Path


VALID_VERDICTS = {
    "VERIFIED",
    "NEEDS_REVISION",
    "UNVERIFIABLE",
    "UNVERIFIABLE:TOOL_MISSING",
    "UNVERIFIABLE:OUT_OF_SCOPE",
    "UNVERIFIABLE:DEFERRED",
}


def _strict_enabled(packet_dir: Path, manifest: dict) -> bool:
    if os.environ.get("MATHCODING_STRICT_VALIDATION") == "1":
        return True
    return bool(manifest.get("strict"))


def _hash_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def _extract_tla_actions(model_path: Path, manifest: dict) -> set[str] | None:
    """Best-effort extraction of action symbol names from a TLA+ file.

    Two input modes:
      1. packet.json declares `actions`: a list of symbols. Used verbatim.
      2. otherwise: regex `Name ==` heuristic with a known skip-list of
         framework / operator symbols (Init, Spec, Next, TypeOK, Safety,
         Fairness, Invariant, StateInvariant, Precondition, Postcondition,
         Variables, Constant, Constants).

    Returns None when model.tla is missing or unreadable (caller treats
    as "no actions to check").
    """
    if manifest.get("actions"):
        return set(manifest["actions"])
    if not model_path.exists():
        return None
    text = model_path.read_text(encoding="utf-8")
    candidates = set()
    for m in re.finditer(r"^([A-Z][A-Za-z0-9_]*)\s*==", text, re.MULTILINE):
        candidates.add(m.group(1))
    skip = {
        "Init", "Spec", "Next", "TypeOK", "Safety", "Fairness",
        "Invariant", "StateInvariant", "Precondition", "Postcondition",
        "Variables", "Constant", "Constants",
        # UI-specific operators
        "ConsistencyInvariant", "Liveness",
    }
    return {a for a in candidates if a not in skip}


def _check_refinement_covers_actions(
    packet_dir: Path, manifest: dict
) -> list[str]:
    """L4 mitigation: every declared TLA+ action must appear at least once
    in refinement.md. The check is name-based — case-sensitive, plain
    substring. False negatives (commented-out or aliased actions) are
    tolerable; the "actions" list in packet.json is the authoritative
    source when present.
    """
    errors = []
    model_path = packet_dir / manifest["artifacts"]["spec"]
    refinement_path = packet_dir / manifest["artifacts"]["refinement"]
    if not (model_path.exists() and refinement_path.exists()):
        return errors
    actions = _extract_tla_actions(model_path, manifest)
    if actions is None:
        return errors
    refinement_text = refinement_path.read_text(encoding="utf-8")
    missing = sorted(a for a in actions if a not in refinement_text)
    if missing:
        errors.append(
            f"refinement.md does not mention TLA+ actions: {', '.join(missing)}"
        )
    return errors


def _check_assumptions_hash(packet_dir: Path, manifest: dict) -> list[str]:
    """L3 mitigation: assumptions.yaml hash must be recorded in
    verification.json; if assumptions.yaml now hashes to a different
    value, the verdict is stale.
    """
    errors = []
    verification_path = packet_dir / manifest["artifacts"]["verification"]
    verification = json.load(open(verification_path))
    recorded = verification.get("assumptions_sha256")
    if not recorded:
        return errors  # not yet recorded — tolerated
    actual = _hash_file(packet_dir / manifest["artifacts"]["assumptions"])
    if recorded != actual:
        errors.append(
            f"assumptions.yaml hash drifted (recorded {recorded!r}, current {actual!r}). "
            "Re-run bin/verify to refresh the verdict."
        )
    return errors


def _check_refinement_covers_actions(
    packet_dir: Path, manifest: dict
) -> list[str]:
    """L4 mitigation: every declared TLA+ action must appear at least once
    in refinement.md. The check is name-based — case-sensitive, plain
    substring. False negatives (commented-out or aliased actions) are
    tolerable; the "actions" list in packet.json is the authoritative
    source when present.
    """
    errors = []
    model_path = packet_dir / manifest["artifacts"]["spec"]
    refinement_path = packet_dir / manifest["artifacts"]["refinement"]
    if not (model_path.exists() and refinement_path.exists()):
        return errors
    actions = _extract_tla_actions(model_path, manifest)
    if actions is None:
        return errors
    refinement_text = refinement_path.read_text(encoding="utf-8")
    missing = sorted(a for a in actions if a not in refinement_text)
    if missing:
        errors.append(
            f"refinement.md does not mention TLA+ actions: {', '.join(missing)}"
        )
    return errors


def _check_traceability_targets(packet_dir: Path, manifest: dict) -> list[str]:
    """Verify that every target in traceability.json resolves to an
    existing path (relative to packet_dir), is a documented symbol, or
    is a free-form description that does not look like a path.

    Accepted target forms:
      - relative path to a file: `implementation/foo.ts`
      - same-file anchor:        `#section-heading`
      - path + anchor:           `Landing/index.html#css .hero-badge`
      - path:line:comment:       `implementation/foo.ts:PendingResult union`
        (the path part must resolve to a real file)
      - documented symbol:       `symbol:TypeScript union type 'Bit = 0 | 1'`
      - free-form description:   any string that does not look like a
        file path. "Looks like a path" is defined heuristically as
        containing both a `/` (or starting with `.`) and a `.` ext-
        ension. Free-form descriptions are accepted because the
        Traceability Protocol allows both forms; tightening this further
        is a separate roadmap item.
    """
    errors = []
    tra_path = packet_dir / manifest["artifacts"]["traceability"]
    if not tra_path.exists():
        return errors
    tra = json.load(open(tra_path))
    for mapping in tra.get("mappings", []):
        target = mapping.get("target", "")
        if not target or target in {"TODO", "TBD"}:
            continue
        if target.startswith("symbol:"):
            continue
        if "#" in target:
            path_part, _, anchor = target.partition("#")
            md_path = packet_dir / path_part
            if not md_path.exists():
                errors.append(
                    f"traceability.target={target!r} path part {path_part!r} does not exist"
                )
                continue
            if md_path.suffix in {".md", ".markdown"} and anchor:
                text = md_path.read_text(encoding="utf-8")
                if anchor.strip().lower() not in text.lower():
                    errors.append(
                        f"traceability.target={target!r} anchor not found in {md_path.name}"
                    )
            continue
        if _looks_like_path(target):
            resolved = packet_dir / target
            if resolved.exists():
                continue
            if ":" in target:
                path_part = target.split(":", 1)[0]
                if (packet_dir / path_part).exists():
                    continue
            errors.append(
                f"traceability.target={target!r} does not resolve to a file"
            )
            continue
        # Free-form description — accepted.
    return errors


def _looks_like_path(s: str) -> bool:
    """Heuristic: does this string look like a filesystem path?"""
    if s.startswith(("./", "../", "/", "~/")):
        return True
    # "foo/bar.ts" or "foo/bar.md" — has both a separator and an extension.
    if "/" in s and "." in s.rsplit("/", 1)[-1]:
        return True
    return False


def _check_unverifiable_human_review(
    packet_dir: Path, manifest: dict
) -> list[str]:
    """UNVERIFIABLE:* verdicts must carry a populated human_review block."""
    errors = []
    verification = json.load(
        open(packet_dir / manifest["artifacts"]["verification"])
    )
    verdict = verification.get("verdict", "")
    if not verdict.startswith("UNVERIFIABLE"):
        return errors
    hr = verification.get("human_review") or {}
    required_fields = ("by", "process", "trigger")
    missing = [f for f in required_fields if not hr.get(f)]
    if missing:
        errors.append(
            f"UNVERIFIABLE verdict missing human_review fields: {', '.join(missing)}"
        )
    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate-packet.py <packet-dir>", file=sys.stderr)
        return 1

    packet_dir = Path(sys.argv[1]).resolve()
    manifest_path = packet_dir / "packet.json"
    if not manifest_path.exists():
        print(f"Missing manifest: {manifest_path}")
        return 2

    manifest = json.load(open(manifest_path))
    required = {
        "problem": manifest["artifacts"]["problem"],
        "assumptions": manifest["artifacts"]["assumptions"],
        "spec": manifest["artifacts"]["spec"],
        "verification": manifest["artifacts"]["verification"],
        "refinement": manifest["artifacts"]["refinement"],
        "traceability": manifest["artifacts"]["traceability"],
    }
    implementation = manifest["artifacts"].get("implementation", "implementation")
    required["implementation"] = implementation

    missing = [name for name, target in required.items()
               if not (packet_dir / target).exists()]
    if missing:
        print("Missing required entries:")
        for item in missing:
            print(f"- {item}")
        return 2

    verification = json.load(open(packet_dir / manifest["artifacts"]["verification"]))
    traceability = json.load(open(packet_dir / manifest["artifacts"]["traceability"]))

    if traceability.get("task_id") != manifest.get("task_id"):
        print("traceability.json task_id does not match packet.json task_id")
        return 4

    verdict = verification.get("verdict")
    if verdict not in VALID_VERDICTS:
        print(f"verification.json has invalid verdict: {verdict!r}")
        print(f"valid: {sorted(VALID_VERDICTS)}")
        return 5

    # ── UNVERIFIABLE:* compensation obligation ───────────────────────
    unverifiable_errors = _check_unverifiable_human_review(packet_dir, manifest)
    if unverifiable_errors:
        for e in unverifiable_errors:
            print(e)
        return 7

    # ── Strict semantic checks (gated) ──────────────────────────────
    if _strict_enabled(packet_dir, manifest):
        strict_errors = []
        strict_errors += _check_assumptions_hash(packet_dir, manifest)
        strict_errors += _check_refinement_covers_actions(packet_dir, manifest)
        strict_errors += _check_traceability_targets(packet_dir, manifest)
        if strict_errors:
            print("Strict validation failed:")
            for e in strict_errors:
                print(f"- {e}")
            return 3

    # ── Traceability gaps (TODO) — informational ────────────────────
    gaps = []
    for mapping in traceability.get("mappings", []):
        target = mapping.get("target", "")
        if target in {"TODO", "TBD", "", None}:
            gaps.append(mapping)
    if gaps:
        print("Traceability gaps (target == TODO):")
        for gap in gaps:
            print(f"- source={gap.get('source')!r} kind={gap.get('kind')!r}")

    print(f"Packet valid: {packet_dir}")
    if gaps:
        return 6
    return 0


if __name__ == "__main__":
    sys.exit(main())