# Problem: Form Username Validation — React Implementation

## Provenance

The UI Application Guide (`MathCodingBase/03-Architecture/UI Application Guide.md`)
presents three example state machines. Only the first (modal dialog) has
been worked through to a verified, implemented packet so far:
`artifacts/ui-modal-react/`. This packet closes the second example —
the registration form with async username availability check.

The guide lists three failure modes that the form has to defend against:

- The "username is taken" badge stays on screen after the user edits
  the input.
- Three parallel validation requests return out of order.
- The form does not clear after a successful submission.

Two invariants express the fix in TLA+:

```tla
StalenessInvariant ==
  pendingResult = "none" \/ state \in {"validating", "valid", "invalid", "taken"}

SingleFlightInvariant ==
  pendingRequestId = "none" \/ state = "validating"
```

## Task

Build a packet that:

1. Captures the form's state machine in `Model.tla`, with states
   `idle / validating / valid / invalid / taken`, plus a
   `pendingRequestId` that increases on every keystroke.
2. Verifies both invariants with TLC over the bounded state space.
3. Refines the model into a React + TypeScript reducer under
   `implementation/`, plus a small View component.
4. Demonstrates the failure modes from the guide: a stale "taken" badge
   would violate `StalenessInvariant`, and a stale resolution of an
   older request would violate `SingleFlightInvariant`.

## Desired Outcome

- `./bin/verify artifacts/form-username-validation` reports `VERIFIED`
  with a recorded TLC exit code and a non-zero count of reachable
  states.
- The reducer's type system makes the three failure modes from the
  guide unrepresentable at the type level: a reducer cannot render
  `taken` for input that has changed, cannot store more than one
  pending request, and `Reset` clears the result.
- A small Vitest suite exercises the reducer, including a regression
  test for each of the three failure modes.

## Non-Goals

- Real network calls. The async check is a configurable `Promise`
  with a delay; we do not mock a real API.
- Styling. The visible UI is functional, not beautiful.
- Animations. State transitions are atomic, not frame-by-frame.
- Form fields other than username. The model covers the username field
  only; adding email / password is a separate packet.

## Reference

- `MathCodingBase/03-Architecture/UI Application Guide.md` — original spec
- `artifacts/ui-modal-react/` — precedent for reducer + React + Vitest
- `examples/ui-modal-dialog/` — original verified spec for the modal