# Three Layers of Rigor

## Layer 1 — Contract Rigor

Every task states:

- preconditions
- postconditions
- invariants
- explicit assumptions

L1 alone fits short scripts, library functions, and pieces of code where the state is trivially obvious from the input. You can express L1 in any language and check it with the type system or with a small property test.

## Layer 2 — Dynamic and System Rigor

Stateful, concurrent, or temporally constrained tasks need more. L2 adds:

- state variables
- a transition relation
- safety properties (nothing bad happens)
- liveness properties (the right thing eventually happens)
- executable model checking

L2 is where TLA+ lives. The model is small, the states are finite or bounded, and TLC checks every reachable state in seconds. Most packets that motivate this methodology need L2.

## Layer 3 — Structural and Compositional Rigor

When the core challenge is composition, abstraction, or universal structure, L3 adds:

- categorical interpretations
- refinement mappings between layers of abstraction
- compositional laws that survive translation

L3 is optional. It earns its cost only when L2 alone leaves too much implicit: when you have several interacting state machines, or when a refinement step itself needs to be proved rather than checked.

Layer 3 must strengthen the pipeline, not decorate it. If you cannot point at a specific failure mode that L2 misses and L3 catches, you do not need L3 yet.