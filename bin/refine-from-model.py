#!/usr/bin/env python3
"""Generate refinement.md and traceability.json templates from a verified Model.tla.

Usage:
  bin/refine-from-model.py <packet-dir>

This extracts VARIABLES, Init, Next, named actions, and invariants from
Model.tla and produces a refinement.md skeleton and a traceability.json stub.
The output is intentionally a starting point — a human or agent must complete
the target-language mappings.
"""
import json
import re
import sys
from pathlib import Path


def parse_module(text: str) -> dict:
    info: dict = {
        "module": "",
        "extends": "",
        "constants": [],
        "variables": [],
        "precondition": "",
        "postcondition": "",
        "invariants": [],
        "init": "",
        "next": "",
        "actions": [],
        "spec": "",
        "theorems": [],
    }

    in_varlist = False
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("---- MODULE"):
            parts = line.split()
            if len(parts) >= 3:
                info["module"] = parts[2]
        elif line.startswith("EXTENDS"):
            info["extends"] = line[len("EXTENDS"):].strip()
        elif line.startswith("CONSTANT") or line.startswith("CONSTANTS"):
            continue
        elif line.startswith("VARIABLE") or line.startswith("VARIABLES"):
            in_varlist = True
            parts = line.split(None, 1)
            if len(parts) < 2:
                continue
            payload = parts[1]
            for var in re.split(r",\s*", payload):
                info["variables"].append(var.strip())
            if not payload.rstrip().endswith(","):
                in_varlist = False
            continue
        elif in_varlist:
            payload = line.rstrip(",")
            for var in re.split(r",\s*", payload):
                if var:
                    info["variables"].append(var.strip())
            if not line.rstrip().endswith(","):
                in_varlist = False
            continue
        elif line.startswith("Precondition") and "==" in line:
            info["precondition"] = line.split("==", 1)[1].strip()
        elif line.startswith("Postcondition") and "==" in line:
            info["postcondition"] = line.split("==", 1)[1].strip()
        elif line.startswith("Invariant") and "==" in line:
            info["invariants"].append(line.split("==", 1)[1].strip())
        elif line.startswith("Init") and "==" in line:
            info["init"] = line.split("==", 1)[1].strip()
        elif line.startswith("Next") and "==" in line:
            info["next"] = line.split("==", 1)[1].strip()
        elif line.startswith("Spec") and "==" in line:
            info["spec"] = line.split("==", 1)[1].strip()
        elif line.startswith("THEOREM") and "==" in line:
            info["theorems"].append(line.split("==", 1)[1].strip())
        elif re.match(r"^[A-Z][A-Za-z0-9_]*\s*==", line):
            name = line.split("==", 1)[0].strip()
            if name.endswith("Invariant") or name.endswith("Invariant'"):
                if line not in info["invariants"]:
                    info["invariants"].append(line.split("==", 1)[1].strip())
            elif name not in {"Init", "Next", "Spec", "Precondition", "Postcondition", "Invariant", "TypeInvariant", "Safety", "Liveness"}:
                if name not in info["actions"]:
                    info["actions"].append(name)
    return info


def render_refinement(info: dict) -> str:
    lines = ["# Refinement", ""]
    lines.append(f"_Auto-generated skeleton from `Model.tla`. Complete the target-language mappings._")
    lines.append("")

    lines.append("## Module")
    lines.append("")
    if info["module"]:
        lines.append(f"- Module name: `{info['module']}`")
    if info["extends"]:
        lines.append(f"- EXTENDS: `{info['extends']}`")
    lines.append("")

    lines.append("## State Mapping")
    lines.append("")
    if info["variables"]:
        lines.append("| TLA+ variable | Target language field |")
        lines.append("|---|---|")
        for var in info["variables"]:
            lines.append(f"| `{var}` | TODO |")
    else:
        lines.append("_No VARIABLE declarations found._")
    lines.append("")

    lines.append("## Operation Mapping")
    lines.append("")
    if info["actions"]:
        lines.append("| TLA+ action | Target language operation |")
        lines.append("|---|---|")
        for action in info["actions"]:
            lines.append(f"| `{action}` | TODO |")
    else:
        lines.append("_No named actions found beyond Init/Next._")
    lines.append("")
    if info["init"]:
        lines.append(f"- Init: `{info['init']}`")
    if info["next"]:
        lines.append(f"- Next: `{info['next']}`")
    if info["spec"]:
        lines.append(f"- Spec: `{info['spec']}`")
    lines.append("")

    lines.append("## Invariant Preservation Strategy")
    lines.append("")
    if info["invariants"]:
        lines.append("| TLA+ invariant | Enforcement strategy |")
        lines.append("|---|---|")
        for inv in info["invariants"]:
            lines.append(f"| `{inv}` | TODO |")
    else:
        lines.append("_No invariants declared._")
    if info["precondition"]:
        lines.append("")
        lines.append(f"- Precondition: `{info['precondition']}`")
    if info["postcondition"]:
        lines.append(f"- Postcondition: `{info['postcondition']}`")
    lines.append("")

    lines.append("## Theorem Obligations")
    lines.append("")
    if info["theorems"]:
        lines.append("| TLA+ theorem | Test or proof artifact |")
        lines.append("|---|---|")
        for th in info["theorems"]:
            lines.append(f"| `{th}` | TODO |")
    else:
        lines.append("_No THEOREM blocks in this spec. Model-checked via TLC only._")
    lines.append("")

    lines.append("## Test Obligations")
    lines.append("")
    lines.append("- Unit test for each operation mapped above.")
    lines.append("- Integration test driving the full lifecycle once.")
    lines.append("- Property-based test (or TLC re-run) for invariant preservation.")
    lines.append("")

    lines.append("## Runtime Checks")
    lines.append("")
    lines.append("- Reducer post-conditions assert the same invariants as the spec.")
    lines.append("- Compile-time type narrowing matches the TLA+ variable types.")
    lines.append("- CI runs `./bin/verify` on the packet before merging.")
    lines.append("")

    lines.append("## Open Questions")
    lines.append("")
    lines.append("- Which language will implement this refinement?")
    lines.append("- What state representation matches each TLA+ variable?")
    lines.append("- Which invariants are enforced by types, which by runtime asserts?")
    lines.append("")
    return "\n".join(lines)


def render_traceability(info: dict, task_id: str) -> str:
    mappings = []
    for var in info["variables"]:
        mappings.append({
            "source": f"VARIABLE {var}",
            "target": "TODO",
            "kind": "state",
        })
    for action in info["actions"]:
        mappings.append({
            "source": action,
            "target": "TODO",
            "kind": "operation",
        })
    for inv in info["invariants"]:
        mappings.append({
            "source": inv,
            "target": "TODO",
            "kind": "invariant",
        })
    if info["precondition"]:
        mappings.append({
            "source": f"Precondition == {info['precondition']}",
            "target": "TODO",
            "kind": "test",
        })
    if info["postcondition"]:
        mappings.append({
            "source": f"Postcondition == {info['postcondition']}",
            "target": "TODO",
            "kind": "test",
        })
    for th in info["theorems"]:
        mappings.append({
            "source": f"THEOREM == {th}",
            "target": "TODO",
            "kind": "test",
        })

    report = {
        "task_id": task_id,
        "mappings": mappings,
    }
    return json.dumps(report, indent=2) + "\n"


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: refine-from-model.py <packet-dir>", file=sys.stderr)
        return 1

    packet_dir = Path(sys.argv[1]).resolve()
    tla = packet_dir / "Model.tla"
    if not tla.exists():
        print(f"Missing {tla}", file=sys.stderr)
        return 2

    info = parse_module(tla.read_text())

    manifest = packet_dir / "packet.json"
    task_id = packet_dir.name
    if manifest.exists():
        try:
            manifest_data = json.loads(manifest.read_text())
            task_id = manifest_data.get("task_id", task_id)
        except json.JSONDecodeError:
            pass

    refinement = packet_dir / "refinement.md"
    traceability = packet_dir / "traceability.json"

    refinement.write_text(render_refinement(info))
    traceability.write_text(render_traceability(info, task_id))

    print(f"refinement.md and traceability.json regenerated from {tla}")
    print(f"  variables: {len(info['variables'])}")
    print(f"  actions:   {len(info['actions'])}")
    print(f"  invariants: {len(info['invariants'])}")
    print(f"  theorems:  {len(info['theorems'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())