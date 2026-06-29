# MathCoding rules for Claude Code

This project follows the MathCoding methodology: artifact-centered, evidence-bearing, formally verified software development.

## Core Rules

1. **Do not generate code from prose alone.** Every task must first become a packet under `artifacts/<task-id>/`.

2. **Always produce L1 contracts**: Precondition, Postcondition, Invariant. For stateful work, also Init, Next, Spec.

3. **Never mark a packet as VERIFIED without running `./bin/verify`.** The verdict must come from real tool output.

4. **No code without a verified model.** Even small refactors should not bypass this.

5. **Assumptions are explicit.** Use `assumptions.yaml` with status `user-confirmed`, `agent-inferred`, or `open`. Code cannot silently rely on `open` assumptions.

## Mandatory Workflow

1. Run `./bin/mathpacket <task-id>` to create the packet.
2. Fill `problem.md` and `assumptions.yaml`.
3. Write `Model.tla` (and `Model.cfg` if there are CONSTANTs).
4. Run `./bin/verify <packet>`.
5. Run `./bin/refine-from-model <packet>` and complete `refinement.md`.
6. Generate code matching the refinement, update `traceability.json`.
7. Re-run `./bin/verify` and `./bin/validate-packet`.

## Tool Reference

- `bin/mathpacket` — create packet
- `bin/refine-from-model` — generate refinement skeleton from TLA+
- `bin/verify` — run SANY + TLC + TLAPS, write verification.json
- `bin/validate-packet` — structural validation, includes traceability gap detection
- `bin/tla-sany` / `bin/tla-tlc` / `bin/tla-tlaps` — direct tool wrappers

## Reference

- `README.md` — project overview
- `MathCodingBase/Index.md` — knowledge base
- `MathCodingBase/02-Protocols/` — artifact protocols

## Forbidden

- Marking packets VERIFIED without tool output
- Skipping `assumptions.yaml`
- Implementing without a verified model
- Treating `open` assumptions as resolved
