# MathCodingFractal Rules

This repository is not centered on prompts. It is centered on artifacts.

## Core Rule

Do not treat the chat message as the spec.

Always convert work into a task packet under `artifacts/<task-id>/`.

## Mandatory Development Flow

1. Capture the problem in `problem.md`.
2. Capture explicit assumptions in `assumptions.yaml`.
3. Produce L1 contracts for every task.
4. Produce `Model.tla` and `Model.cfg` when formalization is required.
5. Run mechanical verification before implementation.
6. Save evidence to `verification.json`.
7. Write `refinement.md` before generating code.
8. Generate `traceability.json` together with code.

## Verification Discipline

- `VERIFIED` requires actual SANY/TLC execution.
- If tools are unavailable, the verdict is `UNVERIFIABLE`, never `VERIFIED`.
- The verifier formats tool output; it does not replace the tools.

## Assumption Discipline

- Any ambiguity in the problem statement must become an explicit assumption.
- Assumptions must be tagged as one of:
  - `user-confirmed`
  - `agent-inferred`
  - `open`
- Code generation may not silently rely on `open` assumptions.

## Refinement Discipline

Do not jump directly from TLA+ to code.

Every non-trivial synthesis must first state:

- state mapping
- operation mapping
- invariant preservation strategy
- evidence obligations

in `refinement.md`.

## Fractal Rule

When modifying this methodology itself, apply the same methodology to the change.

That means methodological changes should update:

- the self-spec in `methodology/self-spec/`
- the protocol docs in `MathCodingBase/02-Protocols/`
- the architectural explanation in `MathCodingBase/03-Architecture/`

The methodology must remain an example of itself.
