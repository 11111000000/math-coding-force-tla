# Refinement: unverifiable-as-design

## State Mapping

The model in `Model.tla` declares five variables:

| Model variable | Program counterpart |
|---|---|
| `verdict` | the string in `verification.json.verdict` |
| `subtype` | one of `ToolMissing`, `OutOfScope`, `Deferred` recorded alongside the verdict |
| `reviewer` | the named person or role inside `verification.json.human_review.by` |
| `process` | the review procedure inside `verification.json.human_review.process` |
| `trigger` | when the review runs, inside `verification.json.human_review.trigger` |

In code, those five fields collapse into two structs: the verdict/subtype pair and the `human_review` record. The model enumerates them separately so TLC can verify the discriminated-union semantics.

## Operation Mapping

| TLA+ transition | Program change |
|---|---|
| `Init` | Initial state of a packet: `UNVERIFIABLE` + a populated `human_review` record (enforced minimum: by, process, trigger) |
| `Next` | Editing `verification.json`: changing the verdict or filling in compensation fields |
| `Consistency` clause | The agent cannot set `verdict = UNVERIFIABLE` while leaving `subtype = none`, and cannot set `verdict = VERIFIED` while leaving `subtype = ToolMissing` |

`bin/validate-packet.py` is the operational enforcement of the consistency clause. It rejects `verification.json` files where the verdict and subtype disagree, or where `UNVERIFIABLE:*` lacks a non-empty `human_review`.

## Invariant Preservation Strategy

Three invariants are preserved by the model:

1. **`Precondition`** — verdict ∈ {VERIFIED, NEEDS_REVISION, UNVERIFIABLE}; subtype is one of the three allowed values when verdict is UNVERIFIABLE, else "none".
2. **`NoRejectedInvariant`** — subtype ≠ "REJECTED". The forbidden subtype never enters any reachable state.
3. **`CompensationFieldsInvariant`** — when verdict is UNVERIFIABLE, all three required compensation fields are non-empty strings drawn from the bounded reviewer/process/trigger universe.

The first two are structural: their enforcement can live in the JSON Schema for `verification.json`. The third is content-bound: it needs an explicit check in `bin/validate-packet` because the schema alone does not know the difference between `""` and `"alice"`.

## Test Obligation Mapping

The model carries no `THEOREM` blocks. TLAPS is not invoked. The structural obligations that do apply:

- `Invariant` (composed) — checked by TLC over 40 distinct reachable states.
- `EventuallyCompensated` — temporal property asserting that every UNVERIFIABLE packet eventually fills all three compensation fields. TLC verified this property holds on the complete state graph.

These map to:

- A pytest test that opens every `examples/*/verification.json` and `artifacts/*/verification.json` and asserts `verdict ∈ Verdicts` and the consistency rule.
- A pytest test that opens every UNVERIFIABLE packet and asserts `human_review.{by,process,trigger}` are non-empty.
- A snapshot test that fails if the verdict enum changes in `verification-report.schema.json`.

## Runtime-Check Mapping

No runtime checks in the implementation sense. The closest equivalent:

- **`bin/validate-packet.py`** enforces the same invariants the model does. A packet that fails the runtime check is the runtime equivalent of TLC reporting `Invariant Invariant is violated`.
- The schema in `schemas/verification-report.schema.json` defines the closed enum for `verdict` and the required `human_review` sub-object for any UNVERIFIABLE subtype.

A failure of `bin/validate-packet` does not block writes; it surfaces as a non-zero exit code that the agent must resolve before considering the packet structurally complete.

## Why this refinement is honest

The original `verification.json` schema in the repo carried `verdict` as `string` with three allowed values. This packet promotes that enum to five values and adds a sibling `human_review` object with four required string fields. Both are reflected in `schemas/verification-report.schema.json` (or will be, in the next structural pass that consumes this packet's contract).

The model is small — one `VARIABLES` block with five components, one `Init`, one `Next`, one `Spec`, three invariants, one temporal property. It exists to prove the contract mechanically. Without it, the contract would live only in prose, and prose is exactly the artifact kind that this packet argues cannot be mechanically verified.