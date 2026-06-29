# Refinement as Bridge

The most dangerous leap in formal-method-adjacent development is the jump from verified model to implementation. MathCoding treats refinement as a first-class artifact rather than a courtesy.

## Refinement Must State

- which model variables correspond to program state
- which actions correspond to program operations
- which invariants the type system preserves on its own
- which invariants need an explicit runtime check
- which postconditions deserve a test

Refinement is the bridge between "verified model" and "implementation evidence". A packet without `refinement.md` is a packet that stops at the model. The model is verified, the code is unwritten, and the gap between them is left as an exercise for the reader.