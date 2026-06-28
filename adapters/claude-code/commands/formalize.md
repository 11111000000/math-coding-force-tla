---
description: Create or update a MathCoding task packet
---

Create or update a MathCoding task packet for the user's request.

If a task id is given, create a packet under `artifacts/<task-id>/` using `./bin/mathpacket`. Then fill `problem.md`, `assumptions.yaml`, `Model.tla`, and `Model.cfg`.

Follow these rules:

1. Capture the problem first.
2. Capture explicit assumptions.
3. Decide formalization depth (L1 always, L2 if stateful, L3 if compositional).
4. Produce model artifacts.
5. Do not generate code unless the user explicitly asks for it.

After completing the packet, run `./bin/verify` and confirm the verdict is VERIFIED before any further action.

Arguments: $ARGUMENTS