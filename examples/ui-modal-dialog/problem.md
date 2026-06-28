# Problem: UI Modal Dialog State Machine

## Task

A desktop application needs a modal confirmation dialog with the following visible states:

- `closed`
- `opening` (during animation in)
- `open` (visible and interactive)
- `confirming` (user pressed confirm, async work in flight)
- `canceling` (user pressed cancel, rollback in flight)
- `closing` (animation out)
- `error` (the confirmation call failed and the dialog must show an error)

The dialog has the following transitions:

- from `closed` the user can `Open`
- from `open` the user can `Confirm`, `Cancel`, or the system can `Dismiss` (click outside)
- from `opening` and `closing` no user input is allowed
- from `confirming` the system can finish with `Resolve` or `Reject`
- from `canceling` the system can finish with `Resolve`
- from `error` the user can `Retry` or `Dismiss`

## Desired Outcome

We need a mathematical specification of the dialog state machine so that we can mechanically verify the following properties:

- the dialog never gets stuck in an interactive state while a background operation is running
- the dialog is never simultaneously `open` and `closed`
- the dialog is never `confirming` and `canceling` at the same time
- every `error` state can reach `closed` through user input

This packet demonstrates a non-trivial state machine suitable for real UI code.