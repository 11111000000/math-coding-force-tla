# Artifact-Centered Architecture

The architecture is layered:

1. Artifact schemas
2. Protocol documents
3. Formal tools
4. Knowledge base
5. Agent integration

This order matters.

The methodology should remain usable even if the agent runtime changes.

## Consequence

The repository is designed so that the agent is not the source of rigor. The artifact model is.

## What an artifact can claim

A packet's `verification.json` declares one of five verdicts. The architecture respects each:

- `VERIFIED` — a tool ran and proved something. The artifact stands on the tool's exit code. Trust is mechanical.
- `NEEDS_REVISION` — a tool ran and found a counterexample. The artifact must be revised. Trust is mechanical.
- `UNVERIFIABLE:TOOL_MISSING` — the tool that should have run did not. The artifact awaits infrastructure repair. Trust is suspended.
- `UNVERIFIABLE:OUT_OF_SCOPE` — no tool applies. The artifact is reviewed by a named human. Trust is social, anchored on the reviewer's competence.
- `UNVERIFIABLE:DEFERRED` — the tool exists but the data does not. The artifact will return to mechanical verification when data arrives. Trust is delayed.

Any other claim, including "trust me, it's fine", has no place in `verification.json`. An agent that cannot produce one of these five verdicts reformulates the task rather than asserts confidence.

## Why the verdict enum is closed

The closed enum is the architectural lever that keeps the methodology honest. A mistyped verdict fails schema validation; a hidden verdict makes the artifact visibly incomplete. The check is structural and runs without the agent's cooperation.