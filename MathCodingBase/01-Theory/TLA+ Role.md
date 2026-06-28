# TLA+ Role

TLA+ is the default formal specification language in MathCodingFractal for
dynamic and stateful systems. Four properties make it the default:

- explicit state modeling through `VARIABLES`
- temporal properties through `Spec`, `[]`, `~>`, `WF_`, `SF_`
- executable bounded model checking through TLC
- a direct path from contracts to transition systems via `Init`, `Next`, invariants

TLA+ is not the whole methodology. It is the formal modeling core for one
class of tasks. MathCodingFractal separates three layers:

- methodology-level contracts and protocols (the `.md` documents)
- TLA+-level system models (`Model.tla` + `Model.cfg`)
- refinement into code (`refinement.md` + `implementation/`)

This separation keeps the methodology portable when a future task uses a
different formal substrate — Alloy for relational constraints, Coq/Lean
for deep proofs, property-based testing as a lightweight tier.

Note: TLC `.cfg` files are not TLA+ modules. They do not use
`---- MODULE ----` or `====` delimiters.

## Verification Tiers

The methodology uses verification tools in three tiers. A packet moves
through them in order.

### Tier 1: SANY

Syntactic and semantic analysis. SANY parses `Model.tla` and rejects
specs with parse errors, unknown operators, or type errors. Without
SANY OK, no further verification is attempted.

### Tier 2: TLC

Bounded model checking. TLC enumerates reachable states up to the
bounds declared in `Model.cfg` and checks every invariant and temporal
property. Required for any L2 state-machine spec.

### Tier 3: TLAPS

The TLA+ Proof System. TLAPS proves `THEOREM` obligations using backend
provers (Zenon, Isabelle, Z3, SMT solvers).

TLAPS is a separate toolchain from `tla2tools.jar`. It is optional in
MathCodingFractal. Model checking with TLC covers the majority of
packets; TLAPS is reserved for obligations that model checking cannot
discharge. When used, the proof obligation appears as a
`THEOREM ... PROOF` block in the spec, and a corresponding `proof/`
directory can be added to the packet to hold proof scripts.

### When to Add TLAPS

Add a TLAPS-backed `THEOREM` to a packet when at least one of these
holds:

- the property cannot be expressed as a temporal formula checked by TLC
- a refinement relation must be proved, not just checked over a finite state space
- the task contains a non-trivial invariant that depends on arithmetic

For `examples/minimal-spec`, TLAPS is used: two `THEOREM` blocks are
proved (`Init => Invariant` and `Invariant /\ [Toggle]_bit => Invariant'`),
and the count is recorded in `verification.json` under
`tlaps.theorems_proved`.
