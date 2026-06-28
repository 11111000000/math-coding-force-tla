# Refinement as Bridge

The most dangerous leap in formal-method-adjacent development is the jump from verified model to implementation.

MathCodingFractal treats refinement as a first-class artifact.

## Refinement Must State

- which model variables correspond to program state
- which actions correspond to program operations
- which invariants are preserved by types
- which invariants require runtime checks
- which postconditions require tests

Refinement is the bridge between `verified model` and `implementation evidence`.
