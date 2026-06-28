# Refinement

_Auto-generated skeleton from `Model.tla`. Complete the target-language mappings._

## Module

- Module name: `Model`
- EXTENDS: `Naturals, TLC`

## State Mapping

| TLA+ variable | Target language field |
|---|---|
| `state` | TODO |
| `pendingResult` | TODO |

## Operation Mapping

| TLA+ action | Target language operation |
|---|---|
| `NoPendingIfSettled` | TODO |
| `Open` | TODO |
| `FinishOpen` | TODO |
| `Confirm` | TODO |
| `Cancel` | TODO |
| `Dismiss` | TODO |
| `Resolve` | TODO |
| `Reject` | TODO |
| `FinishClose` | TODO |
| `Retry` | TODO |
| `ErrorDismiss` | TODO |


## Invariant Preservation Strategy

| TLA+ invariant | Enforcement strategy |
|---|---|
| `state \in DialogStates` | TODO |
| `` | TODO |

## Theorem Obligations

_No THEOREM blocks in this spec. Model-checked via TLC only._

## Test Obligations

- Unit test for each operation mapped above.
- Integration test driving the full lifecycle once.
- Property-based test (or TLC re-run) for invariant preservation.

## Runtime Checks

- Reducer post-conditions assert the same invariants as the spec.
- Compile-time type narrowing matches the TLA+ variable types.
- CI runs `./bin/verify` on the packet before merging.

## Open Questions

- Which language will implement this refinement?
- What state representation matches each TLA+ variable?
- Which invariants are enforced by types, which by runtime asserts?
