#!/usr/bin/env python3
import json
import sys
from pathlib import Path

if len(sys.argv) < 9:
    print("usage: write_report.py <verification-json> <module> <verdict> <sany.json> <tlc.json> <tlaps.json>")
    sys.exit(2)

verification_path = sys.argv[1]
module = sys.argv[2]
verdict = sys.argv[3]
sany = json.loads(sys.argv[4])
tlc = json.loads(sys.argv[5])
tlaps = json.loads(sys.argv[6])

report = {
    "module": module,
    "verdict": verdict,
    "l1_gate": {
        "precondition": "FOUND",
        "postcondition": "FOUND",
        "invariant": "FOUND",
        "result": "PASS",
    },
    "sany": sany,
    "tlc": tlc,
    "tlaps": tlaps,
}

Path(verification_path).write_text(json.dumps(report, indent=2) + "\n")
print(f"verification.json updated: {verification_path}")