#!/usr/bin/env python3
import json
import sys
from pathlib import Path


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

    missing = [name for name, target in required.items() if not (packet_dir / target).exists()]
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

    if verification.get("verdict") not in {"VERIFIED", "NEEDS_REVISION", "UNVERIFIABLE"}:
        print("verification.json has invalid verdict")
        return 5

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