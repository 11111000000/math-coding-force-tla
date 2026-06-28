# Refinement

_Auto-generated skeleton from `Model.tla`. Complete the target-language mappings._

## Module

- Module name: `Model`
- EXTENDS: `Naturals, TLC`

## State Mapping

| TLA+ variable | Target language field |
|---|---|
| `bit` | TODO |

## Operation Mapping

| TLA+ action | Target language operation |
|---|---|
| `Toggle` | TODO |

- Init: `bit = 0`
- Next: `Toggle`
- Spec: `Init /\ [][Next]_bit`

## Invariant Preservation Strategy

| TLA+ invariant | Enforcement strategy |
|---|---|
| `bit \in {0, 1}` | TODO |

- Precondition: `bit \in {0, 1}`
- Postcondition: `new \in {0, 1} /\ new # old`

## Theorem Obligations

| TLA+ theorem | Test or proof artifact |
|---|---|
| `Init => Invariant` | TODO |
| `Invariant /\ [Toggle]_bit => Invariant'` | TODO |

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
