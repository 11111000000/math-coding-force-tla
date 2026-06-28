# Problem: UI Modal Dialog — React Implementation

## Provenance

This packet refines the verified spec from `examples/ui-modal-dialog/`.
The TLA+ model there has been TLC-checked over 8 reachable states and
declared `VERIFIED`. We do not rewrite that model; we extend it through
`EXTENDS` so that this packet's evidence remains traceable to the original
verified spec.

## Task

Implement the modal dialog state machine in React + TypeScript such that:

1. Every action declared in `examples/ui-modal-dialog/Model.tla`
   has exactly one corresponding reducer case in `implementation/dialogReducer.ts`.
2. Every invariant declared in the original spec is preserved by either
   a TypeScript type narrowing or a runtime check.
3. The implementation compiles, the unit tests pass, and
   `./bin/verify artifacts/ui-modal-react` reports `VERIFIED`.

## Desired Outcome

A user can open a real browser, open the dialog, click confirm, see the
async call fire, resolve successfully, see the dialog close, and the
underlying code cannot enter an invalid state because the type system
rejects invalid transitions.

## Non-Goals

- Animation timing. We assume animations exist but their internal frames
  are not modeled. The dialog has atomic `opening` and `closing` states,
  not a per-frame model.
- Styling. The visible UI is functional, not beautiful.
- Network. The async confirmation is simulated by a `Promise` with a
  configurable delay; we do not mock a real API.

## Reference

- `examples/ui-modal-dialog/problem.md` — original problem statement
- `examples/ui-modal-dialog/Model.tla` — verified TLA+ model
- `MathCodingBase/03-Architecture/UI Application Guide.md` — UI-specific guide