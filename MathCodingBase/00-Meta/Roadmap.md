# Roadmap

This document is the work plan for MathCoding, maintained by the agent that drives the methodology. It lists the task packets that extend the methodology, in priority order, with their current status. Statuses change as packets move through `bin/verify` and `bin/validate-packet`.

## Status legend

- `pending` — work has not started
- `in-progress` — packet is being authored
- `verified` — packet has been verified end-to-end (`bin/verify` + `bin/validate-packet`)
- `blocked` — work paused pending a decision or external input
- `cancelled` — work will not be done; the reason lives here too

## Phase 1 — Closing execution and architectural debt

The gap that started this phase was real: `artifacts/ui-modal-react/` held a verified model and a working implementation, but a fresh checkout could not actually run the tests. That gap closed when the packet got its own `package.json`, `tsconfig.json`, `vitest.config.ts`, and `implementation/setup.ts`. All 16 tests pass. Phase 1 now hardens the methodology itself rather than chasing another UI packet.

- [x] **1.1 ui-modal-react-runtime** (`artifacts/ui-modal-react/`) — `verified`
  Runtime harness added: packet-local `package.json`, `tsconfig.json`, `vitest.config.ts`, `implementation/setup.ts`. 16 tests pass (13 reducer + 3 component). Bug found and fixed along the way: `Dialog.tsx` always resolved its promise with "ok" from the `confirming` state, which made `REJECT` unreachable through the UI. Fixed by resolving "failed" from the `canceling` state.

- [x] **1.2 protocol-strengthening** (`artifacts/protocol-strengthening/`) — `verified`
  Make the Assumption, Refinement, Traceability, and Verification protocols mechanically validated instead of style-guide validated. Extend `bin/validate-packet` to enforce:
  - `assumptions.yaml` hash recorded in `verification.json`; changes invalidate the verdict
  - every TLA+ action in `Model.tla` has a corresponding entry in the `refinement.md` operation mapping
  - every `target` in `traceability.json` resolves to an existing path or a documented symbol
  Why this matters: today a `refinement.md` full of TODOs can still pass validation. Closing that gap is the difference between a discipline and a polite suggestion.
  Risk: high. Changes in `bin/validate-packet.py` may break existing packets. The mitigation is a backward-compatible feature flag, rolled out packet by packet.

  Result: validator extended with four new branches — broader verdict enum (`UNVERIFIABLE:TOOL_MISSING`/`OUT_OF_SCOPE`/`DEFERRED`), human_review obligation for unverifiable verdicts (exit 7), L4 action-coverage check (skip-list + optional `actions: []` in packet.json), and traceability target resolution (file / `symbol:` / free-form). All four gates are off by default and opt-in via `MATHCODING_STRICT_VALIDATION=1` or per-packet `strict: true`. Synthetic-packet test suite at `implementation/test/validate-packet.test.mjs` covers every branch (9/9 PASS). Default validation unchanged: all seven existing packets still validate. Rollout of strict mode per packet is the next ratchet (1.2-ratchet) — each failing packet repaired and flipped to `strict: true`. L3 hash check is implemented in the validator but needs `bin/verify` to record `assumptions_sha256`; ships with the same ratchet.

- [x] **1.3 limits-documentation** — `done`
  Create `MathCodingBase/00-Meta/Known Limitations.md` with four identified blind spots:
  - L1 — the agent sits between the tool exit and the `verification.json` write
  - L2 — human-in-the-loop is not formalized
  - L3 — assumption changes do not invalidate the verdict automatically
  - L4 — refinement is minimal-by-design and currently not validated
  Each limit gets an id, a plain statement, the mitigation in place, and the residual risk. Cross-link from `Self Justification.md` and `Mechanical Verification Model.md`.

  Result: `MathCodingBase/00-Meta/Known Limitations.md` shipped. Cross-link from `Self Justification.md` (added) and `Mechanical Verification Model.md` (added at the boundary-of-trust paragraph). The mitigations for L3 and L4 still depend on roadmap item 1.2 (`protocol-strengthening`); the limits-documentation file flags that explicitly so a reader does not mistake the current validation surface for a permanent guarantee.

- [x] **1.4 docs-humanization** (`artifacts/docs-humanization-2026-06/`) — `prose-reviewed`
  Humanization pass on the 22 English key documents under `MathCodingBase/` plus `README.md`, `QUICKSTART.md`, `AGENTS.md`, and `Index.md`. Stripped negative parallelisms, normalised em-dash density, varied sentence rhythm, added concrete anchors where they were missing. Russian translations: 8 entry-level English files mirrored under `MathCodingBase/ru/` with the `.ru.md` suffix. Russian texts use Russian equivalents for translatable terms (пакет, допущение, уточнение, инвариант, вердикт, справедливость, свойство живости, состояние гонки, каркас). Latin script stays only for tool names, file paths, code keywords, and TLA+ syntax. The methodology itself does not model prose quality; the verdict reflects structural completeness of the pass, not linguistic metrics. Tool-level verification is not applicable here — prose is the artifact.

- [x] **1.5 unverifiable-as-design** (`artifacts/unverifiable-as-design/`) — `verified`
  Promote `UNVERIFIABLE` from a single verdict to a discriminated union of subtypes and add a compensation obligation. `Mechanical Verification Model.md`, `Verification Evidence Protocol.md`, `Artifact-Centered Architecture.md`, `Agent Portability Model.md`, `README.md`, `Self Problem.md`, `Self Assumptions.md`, and `Self Justification.md` updated to reflect the new contract. Model: `VERIFIED` (40 distinct states, SANY + TLC, no THEOREM blocks). `bin/verify` passes. `bin/validate-packet` will require `human_review` populated for every `UNVERIFIABLE:*` packet going forward.

- [x] **1.6 rebrand-mathcoding** (`artifacts/rebrand-mathcoding/`) — `verified`
  Mechanical rename across 51 files: every occurrence of `MathCodingFractal`, `mathcoding-fractal`, `mathcodingfractal`, `MathCodingFractal-Self` replaced with the plain `MathCoding` form. 106 substitutions total. Russian translations updated in lockstep. Root folder name (`MathCodingFractal/`) preserved at user's request — to be renamed in a separate step. Packet IDs under `artifacts/` left untouched — they are identifiers, not brand. `bin/verify` passes for unverifiable-as-design, examples/ui-modal-dialog, examples/minimal-spec, methodology/self-spec, and this packet. `bin/validate-packet` passes for unverifiable-as-design and docs-humanization-2026-06.

## Phase 2 — Expanding verified examples

The repo now has one implementation packet (`artifacts/ui-modal-react/`), but it lacks breadth. The UI guide leans on a single worked example; Phase 2 raises that to a small set so the guide cites multiple verified-and-implemented packets rather than one.

- [x] **2.1 ui-modal-react** (`artifacts/ui-modal-react/`) — `verified`
  First packet that goes from problem to TypeScript/React implementation artifacts. State machine refined from `examples/ui-modal-dialog/`. Reducer with 10 actions, React view, Vitest test suite, full traceability. Model: `VERIFIED` (8 distinct states, identical to the source packet). All 16 tests pass.

- [ ] **2.2 form-username-validation** (`artifacts/form-username-validation/`) — `pending`
  Implements the form-validation example from `MathCodingBase/03-Architecture/UI Application Guide.md` (the "form with async username validation" section). States: `idle`, `validating`, `valid`, `invalid`, `taken`. Invariants: `StalenessInvariant`, `SingleFlightInvariant`. Minimal React implementation + Vitest.

- [ ] **2.3 onboarding-wizard** (`artifacts/onboarding-wizard/`) — `pending`
  Implements the wizard example from the UI guide (the "multi-step master" section). Four-step state machine with back transitions. Invariants: `BackEnabledInvariant`, `DataPreservationInvariant`. Minimal React implementation + Vitest.

## Phase 3 — Literature grounding

- [ ] **3.1 literature-grounding** — `pending`
  Create `MathCodingBase/05-References/bibliography.md` with sources backing the methodology's claims. Sections:
  - **Foundational papers** — Lamport on TLA+, Hoare on the axiomatic basis, Newcombe et al. (AWS 2015), Woodcock & Davies
  - **Empirical evidence** — where math-coding produced measurable wins
  - **Critique** — Jackson (2000) and other counter-arguments
  Cross-link from the Manifesto, Dialectical Analysis, and TLA+ Role notes.

## Phase 4 — Test infrastructure

- [ ] **4.1 packet-validation-test-suite** — `pending`
  `bin/validate-packet.py` has no tests. Add a pytest-style suite covering the obvious cases and the not-so-obvious ones:
  - missing file, invalid verdict, TODO in traceability
  - `assumptions.yaml` change without re-verification
  - TLA+ action missing from the refinement operation mapping
  Target: 10+ cases. The suite belongs in CI.

- [ ] **4.2 example-regression-suite** — `pending`
  CI pipeline: on every PR, run `./bin/verify` on every `examples/*/` and `artifacts/*/`. Performance budget: each verify completes in under 30 seconds. Snapshot-test `verification.json` to catch non-determinism in the tool output.

## Phase 5 — Adapters (ongoing)

- [ ] **5.1 generic-adapter-stub** (`examples/generic-adapter-stub/`) — `pending`
  `adapters/generic/README.md` describes a contract but no reference implementation exists. Build a minimal runtime that satisfies the contract and validates against the four verified packets.

- [ ] **5.2 cursor-adapter-validation** — `pending`
  Verify that `adapters/cursor/.cursorrules` actually instructs Cursor to follow the methodology when given a real prompt. If it doesn't, update the file. The check is empirical, not structural.

## Out of scope

The roadmap does not cover:

- A web interface for the methodology
- Deep integration with IDE plugins beyond the adapter layer
- New formalisms (Coq, Lean, etc.) — noted as future work in `TLA+ Role.md`, gated on expert-level knowledge per formalism
- ML-based protocol selection — speculative, not prioritised
- Catching up with non-opencode agent APIs (Aider, Cody, Continue, etc.) — only when a real user asks for the port

## How to update this document

When a packet transitions state, the agent updates the relevant row:

```markdown
- [ ] **1.1 ui-modal-react-runtime** — `pending`
```

becomes

```markdown
- [x] **1.1 ui-modal-react-runtime** — `verified`
  Brief one-line note about what was actually delivered.
```

Don't delete cancelled items. Mark them `cancelled` and leave the reason here. The check-box syntax is human-readable; the markdown is the source of truth. If a future tool wants machine-readable status, it can parse the `` — `status` `` token after each heading.