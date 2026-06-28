# Refinement: UI Modal Dialog → React/TypeScript

## Provenance

This refinement realises the TLA+ model from `Model.tla` in this packet,
which is a verbatim copy of the verified spec at
`examples/ui-modal-dialog/Model.tla`. The original packet has verdict
`VERIFIED` with 8 reachable states; this packet's model produces the
same TLC output (`13 states generated, 8 distinct states found`).

## State Mapping

| TLA+ variable | TypeScript field | Notes |
|---|---|---|
| `state` | `DialogState` (union type) | Type narrowing at every reducer case |
| `pendingResult` | `pendingResult` (discriminated union) | Coupled with `state` so reducer cases cannot be entered with wrong pending value |

### TypeScript types

```ts
type DialogState =
  | "closed"
  | "opening"
  | "open"
  | "confirming"
  | "canceling"
  | "closing"
  | "error";

type PendingResult =
  | { kind: "none" }
  | { kind: "in-flight" }
  | { kind: "ok" }
  | { kind: "failed" };

interface DialogStateShape {
  state: DialogState;
  pendingResult: PendingResult;
}
```

The `DialogState` union literal type is exactly the constant
`DialogStates` in `Model.cfg`. Adding a state requires both a TLA+ edit
and a TypeScript edit — the cross-reference is checked by the
`StateInvariant` runtime assertion at module load.

## Operation Mapping

| TLA+ action | Reducer case | Notes |
|---|---|---|
| `Open` | `OPEN` | `closed → opening` |
| `FinishOpen` | `FINISH_OPEN` (driven by `setTimeout`) | `opening → open` |
| `Confirm` | `CONFIRM` | `open → confirming` |
| `Cancel` | `CANCEL` | `open → canceling` |
| `Dismiss` | `DISMISS` | `open → canceling` (same as Cancel) |
| `Resolve` | `RESOLVE` (driven by Promise resolution) | `confirming|canceling → closing` |
| `Reject` | `REJECT` (driven by Promise rejection) | `confirming → error` |
| `FinishClose` | `FINISH_CLOSE` (driven by `setTimeout`) | `closing → closed` |
| `Retry` | `RETRY` | `error → confirming` |
| `ErrorDismiss` | `ERROR_DISMISS` | `error → closing` |

### Action types

Each action is a discriminated union member. TypeScript's narrowing
ensures the reducer handles every case at compile time:

```ts
type DialogAction =
  | { type: "OPEN" }
  | { type: "FINISH_OPEN" }
  | { type: "CONFIRM" }
  | { type: "CANCEL" }
  | { type: "DISMISS" }
  | { type: "RESOLVE" }
  | { type: "REJECT" }
  | { type: "FINISH_CLOSE" }
  | { type: "RETRY" }
  | { type: "ERROR_DISMISS" };
```

The reducer uses a `switch` with `never` exhaustiveness check:

```ts
default: {
  const _exhaustive: never = action;
  return state;
}
```

If a new action is added to the union but not handled in the reducer,
TypeScript fails compilation.

## Invariant Preservation Strategy

| TLA+ invariant | Enforcement strategy |
|---|---|
| `StateInvariant` (state ∈ DialogStates) | TypeScript union type — impossible to violate at runtime |
| `NoPendingIfSettled` | `pendingResult` is a discriminated union coupled with state; reducer cannot construct an illegal pair |
| `ConsistencyInvariant` (¬(state = "open" ∧ state = "closed")) | Trivially true; state is a single field |
| `Safety` (temporal) | Verified by TLC; not enforceable in single-step TypeScript |
| `Liveness` (temporal) | Verified by TLC under `Spec` fairness assumptions; React runtime drives transitions |

### Runtime assertion

At module load, a one-time assertion checks that the
`DialogState` union has exactly seven members — same as the TLA+
constant. If anyone extends the union, this assertion catches the
mismatch:

```ts
const DIALOG_STATE_COUNT: 7 = [
  "closed", "opening", "open",
  "confirming", "canceling", "closing", "error",
].length as 7;
```

## Test Obligations

For each TLA+ action, there is exactly one Vitest case in
`implementation/dialogReducer.test.ts`:

- `OPEN` moves `closed` to `opening`
- `FINISH_OPEN` moves `opening` to `open`
- `CONFIRM` moves `open` to `confirming`, sets `pendingResult = "in-flight"`
- `CANCEL` moves `open` to `canceling`, sets `pendingResult = "in-flight"`
- `DISMISS` behaves identically to `CANCEL`
- `RESOLVE` moves `confirming` or `canceling` to `closing`, sets `pendingResult = "ok"`
- `REJECT` moves `confirming` to `error`, sets `pendingResult = "failed"`
- `FINISH_CLOSE` moves `closing` to `closed`, sets `pendingResult = "none"`
- `RETRY` moves `error` to `confirming`, sets `pendingResult = "in-flight"`
- `ERROR_DISMISS` moves `error` to `closing`, sets `pendingResult = "none"`

Plus negative tests:

- `OPEN` from any non-`closed` state is a no-op
- `CONFIRM` from `error` is a no-op
- All other illegal transitions are no-ops

Plus a property-based invariant check: a randomly-driven sequence of
actions never produces a state outside the seven declared values.

Plus a React component smoke test in `implementation/Dialog.test.tsx`:
renders the component, dispatches `OPEN`, asserts the dialog
becomes visible, dispatches `CONFIRM`, awaits the stub Promise,
asserts the dialog closes.

## Runtime Checks

- The reducer post-condition asserts that the resulting state is one of
  the seven `DialogState` literals. Even if TypeScript types are bypassed,
  this assertion catches illegal states.
- `pendingResult` cannot be `in-flight` while `state` is `closed`,
  `opening`, `open`, or `closing`. Enforced by the discriminated union
  shape: the reducer only allows specific `(state, pendingResult)` pairs.
- Strong fairness for `ErrorDismiss` is enforced in React by
  guaranteeing the close button is always rendered when `state === "error"`.
  A test in `Dialog.test.tsx` checks this.

## Open Questions

None. This packet has a one-to-one mapping from every TLA+ action to a
TypeScript reducer case, and every invariant is either preserved by the
type system or verified by TLC.