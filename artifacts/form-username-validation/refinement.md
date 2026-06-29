# Refinement: Form Username Validation

This packet refines `UsernameForm.tla` into a React + TypeScript
implementation. The model is verified end-to-end (TLC, 4 distinct
states, all invariants hold).

## State Mapping

The model's three variables map to the discriminated union
`FormState`:

| TLA+ variable        | TypeScript counterpart                       |
| -------------------- | -------------------------------------------- |
| `state`              | `FormState.kind` discriminator               |
| `pendingResult`      | `FormState.kind` value (when not `idle`/`validating`) |
| `pendingRequestId`   | `FormState.requestId` field (omitted on `idle`) |

The model uses `0` as the "no request" sentinel for `pendingRequestId`;
the reducer uses the same convention via `nextId` (starts at 1). The
`idle` state corresponds to `requestId === 0` (or equivalently the
absence of `requestId` from the type).

## Operation Mapping

| TLA+ action | TypeScript action                                |
| ----------- | ------------------------------------------------ |
| `OnChange`  | `{ type: "ON_CHANGE"; input }` → `validating`    |
| `Resolve`   | `{ type: "RESOLVE_AVAILABLE"; requestId }` → `valid` |
| `Reject`    | `{ type: "RESOLVE_TAKEN"; requestId }` → `taken` |
| (none)      | `{ type: "RESOLVE_INVALID"; requestId; reason }` → `invalid` |
| `Reset`     | `{ type: "RESET" }` → `idle`                    |

The TLA+ model has four actions; the TypeScript reducer has five (the
extra `RESOLVE_INVALID` covers the failure path the model folds into
`Reject`). This is an allowed widening — the model expresses the
salient invariants; the implementation adds a state that the model
didn't need to enumerate because `Reject` already covers the
"non-success" terminal.

## Invariant Preservation

`StalenessInvariant` is preserved by the `requestId` guard inside
`RESOLVE_AVAILABLE` / `RESOLVE_TAKEN` / `RESOLVE_INVALID`. A response
with a request id other than the in-flight one is dropped, so the
visible state never reflects a request the user has already moved past.

`SingleFlightInvariant` is preserved by `ON_CHANGE` always incrementing
the request id. The reducer never holds two pending requests at once.

The TypeScript type system enforces both invariants at compile time:

- The reducer is exhaustively switched; missing a case is a compile
  error.
- `requestId` is on every non-idle state, so the reducer cannot read
  it without checking the kind.

## Test Obligation Mapping

| Model property                  | Test (file:line)                                  |
| ------------------------------- | -------------------------------------------------- |
| `Init`                          | `formReducer.test.ts: starts in idle`              |
| `OnChange` action shape         | `formReducer.test.ts: ON_CHANGE moves to validating` |
| `Resolve` action shape          | `formReducer.test.ts: resolving the second (latest) request moves to valid` |
| `Reject` action shape           | `formReducer.test.ts: RESOLVE_INVALID with reason stores the reason` |
| `Reset` action shape            | `formReducer.test.ts: RESET clears back to idle`   |
| `StalenessInvariant`            | `formReducer.test.ts: drops RESOLVE_AVAILABLE for a stale request id` (+ `UsernameForm.test.tsx: editing the input after 'taken' moves back to Checking…`) |
| `SingleFlightInvariant`         | `formReducer.test.ts: two simultaneous ON_CHANGEs keep only the latest in flight` |
| Out-of-order response safety    | `formReducer.test.ts: out-of-order responses do not leak stale 'taken'` |
| Form clears on submit           | `formReducer.test.ts: RESET clears the form completely` |

## Runtime-Check Mapping

The reducer is pure. The runtime check that catches the stale-response
case is the equality check `state.requestId !== action.requestId`
inside the resolve/reject/taken cases. If the check fails, the reducer
returns `state` unchanged, which is the closest runtime analogue to
"the response is silently dropped".

The component (`UsernameForm.tsx`) uses an `AbortController` so that an
in-flight `check` promise is cancelled when the input changes. The
abort signal is a runtime safety net for the case where the API has
already started and cannot be cancelled by the request-id check alone.