# MathCoding Rules

This repository treats artifacts as the source of rigor, not chat messages. Prompts pass through. Files remain.

## The rule that overrides everything else

Do not treat the chat message as the spec. Every task becomes a packet under `artifacts/<task-id>/`. The packet is the contract; the chat is the scratchpad.

## Mandatory flow

Eight steps. None are optional for a non-trivial task.

1. Capture the problem in `problem.md`.
2. Capture explicit assumptions in `assumptions.yaml`.
3. Write L1 contracts (`Precondition`, `Postcondition`, `Invariant`).
4. Write `Model.tla` and `Model.cfg` when formalization is required.
5. Run mechanical verification before any code exists.
6. Record the tool output in `verification.json`.
7. Write `refinement.md` before generating code, never after.
8. Generate `traceability.json` together with the code.

## Verification discipline

- `VERIFIED` requires a real SANY/TLC exit, with a real exit code, recorded in `verification.json`.
- When the tools are missing, the verdict is `UNVERIFIABLE`, never `VERIFIED`. A wrapper that can't run is not a green light.
- The verifier formats tool output. It does not invent it.

## Assumption discipline

Every ambiguity in the problem statement becomes an explicit assumption, tagged as one of:

- `user-confirmed` — the user actually said it
- `agent-inferred` — the agent decided, on the record
- `open` — needs an answer before code lands on it

Code generation must not silently depend on an `open` assumption. Either ask the user, or branch the model and record both branches.

## Refinement discipline

Do not jump from TLA+ to code. Every non-trivial synthesis starts with a `refinement.md` that states:

- which model variables map to program state
- which actions map to program operations
- which invariants the type system preserves, and which need runtime checks
- which postconditions need tests

## The fractal rule

When you change the methodology itself — schemas, protocols, packet layout, verification rules, anything in `bin/` — apply the methodology to the change. Update:

- `methodology/self-spec/`
- the protocol docs in `MathCodingBase/02-Protocols/`
- the architectural explanation in `MathCodingBase/03-Architecture/`

The methodology has to stay an example of itself. Cosmetic prose fixes don't need a packet; structural changes do.