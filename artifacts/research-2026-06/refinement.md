# Refinement: research-2026-06

## State Mapping

The model in `Model.tla` is observational, not operational. It encodes the empirical findings about the methodology as state variables. There is no runtime that updates these variables; the state is initialized with observed values and the only `Next` action refines observations (for example, recognizing that connective share may decrease in future iterations).

| Model variable | Real artifact |
|---|---|
| `verified_packets` | The set of packet IDs that have `VERIFIED` in their `verification.json` |
| `connective_share` | Ratio (in tenths) of packet bytes that are connective tissue vs. specification |
| `refinement_dominates_model` | Whether refinement.md is larger than Model.tla (observed true in all packets) |
| `lifecycle_gate_present` | Whether the packet creation script asks `decision: needed` first (false in current repo) |
| `epistemic_markers_present` | Whether assumptions carry `epistemology` markers (false in current repo, but recorded as required for this packet) |
| `multi_substrate_support` | Whether the methodology supports non-TLA+ substrates (false in current repo) |

## Operation Mapping

| Concept | Code operation |
|---|---|
| `Init` | Reading `verification.json` for each packet and tallying byte counts |
| `Next` | Refinement of observations; e.g., `connective_share` may decrease as the methodology evolves |
| `Invariant` | The set of findings that the model claims are valid for the current state of the repo |

The implementation step in this packet is the act of running `bin/verify` against `Model.tla`, not the act of writing code.

## Invariant Preservation Strategy

The model carries three invariants:

1. `CorpusCountInvariant` — the eleven packets split into 5 + 4 + 2. This is mechanical and verifiable by `ls artifacts/ examples/ methodology/self-spec`.
2. `RefinementDominatesInvariant` — refinement.md > Model.tla in bytes. Verifiable by `wc -c` on the relevant files.
3. `EpistemicMarkersRequired` — this packet carries the markers that the methodology should carry. This is a constraint on the packet itself, encoded in `assumptions.yaml`.

The invariants the model does NOT carry:

- A guarantee that the successor methodology will be built. Progress is a human commitment, not a model guarantee.
- A claim that the methodology is "good" or "bad" — only that its structure is self-consistent.

## Test Obligation Mapping

The model's invariants map to the following obligations:

- `CorpusCountInvariant` is checked against the repository state at session time. To re-verify, run `ls -d artifacts/* examples/* methodology/self-spec` and compare to `5 + 4 + 2 = 11`.
- `RefinementDominatesInvariant` is checked by `wc -c` on each packet's Model.tla and refinement.md.
- `EpistemicMarkersRequired` is checked by inspecting this packet's `assumptions.yaml` for the presence of the `epistemology` field.

No executable test suite is added. The verification IS the test.

## Runtime-Check Mapping

None. The model is observational, not prescriptive. There is no runtime that asserts the invariants on every operation.

If the methodology's successor is built with a runtime validator, the successor should add:

- A check at packet creation time that asks `decision: needed | not-needed | deferred` (this is the lifecycle gate, currently absent).
- A check at every assumption that `epistemology` is one of `fact | hypothesis | judgment | unknown`.

These are not in this packet. They are recommendations for the successor.

## Why this refinement matters

This packet is the closing of an investigation. The methodology was applied to itself, the investigation produced measurements and judgments, and the result is a record that survives the session that produced it. Future agents reading `artifacts/research-2026-06/` will see:

- What was measured (the eleven packets and their byte counts).
- What was concluded (the seven findings in `problem.md`).
- What is recommended (the five principles for the successor).
- What is not claimed (controlled experiments on external tasks; time-to-comparison with and without the methodology).

This is what it means to be epistemically honest in an artifact.