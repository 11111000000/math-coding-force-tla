# Roadmap

This document is the agent-maintained work plan for MathCodingFractal.
It contains the prioritized list of task packets that extend the
methodology, plus their current status. Statuses are updated by the
agent as work progresses.

## Status legend

- `pending` — work has not started
- `in-progress` — packet is being authored
- `verified` — packet has been verified end-to-end (`bin/verify` + `bin/validate-packet`)
- `blocked` — work paused pending decision or external input
- `cancelled` — work will not be done; reason recorded

## Phases

### Phase 1 — Closing execution and architectural debt

The highest-priority gap was that `artifacts/ui-modal-react/` contained
verified model, refinement, implementation files, and tests, but a fresh
checkout could not run those tests. That gap is now closed: the packet
has its own `package.json`, `tsconfig.json`, `vitest.config.ts`, and
all 16 tests pass. This phase now hardens the methodology itself.

- [x] **1.1 ui-modal-react-runtime** (`artifacts/ui-modal-react/`) — `verified`
  Runtime harness added: packet-local `package.json`, `tsconfig.json`,
  `vitest.config.ts`, `implementation/setup.ts`. 16 tests pass
  (13 reducer + 3 component). Bug found and fixed: Dialog.tsx promise
  always resolved "ok" from confirming state, making REJECT unreachable
  through UI. Fixed to resolve "failed" from canceling state.

- [ ] **1.2 protocol-strengthening** (`artifacts/protocol-strengthening/`) — `pending`
  Make Assumption, Refinement, Traceability, and Verification protocols
  mechanically validated. Extend `bin/validate-packet` to check:
  - `assumptions.yaml` hash recorded in `verification.json`; changes
    invalidate verdict
  - every TLA+ action in `Model.tla` has a corresponding entry in
    `refinement.md` operation mapping
  - every `target` in `traceability.json` resolves to an existing path
    or documented symbol
  Impact: closes the gap where `refinement.md` can be a TODO-filled
  skeleton and still pass validation.
  Risk: high. Changes in `bin/validate-packet.py` may break existing
  packets. Mitigation: backward-compatible feature flag.

- [ ] **1.3 limits-documentation** — `pending`
  Create `MathCodingBase/00-Meta/Known Limitations.md` covering four
  identified blind spots:
  - L1: agent between tool exit and `verification.json` write
  - L2: human-in-the-loop is not formalized
  - L3: assumption changes do not invalidate verdict automatically
  - L4: refinement is minimal-by-design but not validated
  Each limit has: id, statement, mitigation, residual risk.
  Cross-link from `Self Justification.md` and `Mechanical Verification Model.md`.

### Phase 2 — Expanding verified examples

The repository now has one implementation packet (`artifacts/ui-modal-react/`)
but still lacks breadth. This phase expands the example set so the UI guide
is backed by multiple verified-and-implemented packets rather than one.

- [x] **2.1 ui-modal-react** (`artifacts/ui-modal-react/`) — `verified`
  First packet that goes from problem to TypeScript/React implementation artifacts.
  State machine refined from `examples/ui-modal-dialog/`. Reducer with
  10 actions, React view, Vitest test suite, full traceability.
  Model: VERIFIED (8 distinct states, identical to source packet).
  Status: packet created, model verified, implementation written, tests
  written, runtime harness added (1.1). All 16 tests pass.

- [ ] **2.2 form-username-validation** (`artifacts/form-username-validation/`) — `pending`
  Implements the form-validation example from
  `MathCodingBase/03-Architecture/UI Application Guide.md` (L63–95).
  Model covers: `idle`, `validating`, `valid`, `invalid`, `taken`.
  Invariants: StalenessInvariant, SingleFlightInvariant.
  Minimal React implementation + Vitest.

- [ ] **2.3 onboarding-wizard** (`artifacts/onboarding-wizard/`) — `pending`
  Implements the wizard example from UI Application Guide (L97–127).
  4-step state machine with back transitions. Invariants:
  BackEnabledInvariant, DataPreservationInvariant.
  Minimal React implementation + Vitest.

### Phase 3 — Literature grounding

- [ ] **3.1 literature-grounding** — `pending`
  Create `MathCodingBase/05-References/bibliography.md` with sources
  backing the methodology's claims. Sections:
  - Foundational papers: Lamport (TLA+), Hoare (axiomatic basis),
    Newcombe et al. (AWS 2015), Woodcock & Davies
  - Empirical evidence: where math-coding gave measurable wins
  - Critique: Jackson (2000) and other counter-arguments
  Cross-link from Manifesto, Dialectical Analysis, TLA+ Role.

### Phase 4 — Test infrastructure

- [ ] **4.1 packet-validation-test-suite** — `pending`
  `bin/validate-packet.py` has no tests. Add pytest-style suite covering:
  - missing file, invalid verdict, TODO in traceability
  - assumptions.yaml change without re-verification
  - TLA+ action missing from refinement
  Target: 10+ cases, CI integration.

- [ ] **4.2 example-regression-suite** — `pending`
  CI pipeline: on every PR, run `./bin/verify` on all `examples/*/`
  and `artifacts/*/`. Performance budget: each verify < 30 seconds.
  Snapshot test for `verification.json` to detect non-determinism.

### Phase 5 — Adapters (ongoing)

- [ ] **5.1 generic-adapter-stub** (`examples/generic-adapter-stub/`) — `pending`
  `adapters/generic/README.md` describes a contract but no reference
  implementation exists. Build a minimal runtime that satisfies the
  contract and validates against the four verified packets.

- [ ] **5.2 cursor-adapter-validation** — `pending`
  Verify that `adapters/cursor/.cursorrules` actually instructs Cursor
  to follow methodology when given a real prompt. If not, update.

## Out of scope

The following are explicitly NOT in this roadmap:

- Web interface for the methodology
- Deep integration with specific IDE plugins beyond adapter layer
- New formalisms (Coq, Lean, etc.) — documented as future work in
  `TLA+ Role.md`, requires expert-level knowledge per formalism
- ML-based protocol selection — speculative, not prioritised
- Catching up with non-OpenCode agent APIs (Aider, Cody, Continue, etc.)
  — only when a real user requests porting

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

Do not delete cancelled items; mark them with `cancelled` and a reason.

The check-box syntax is human-readable; the markdown is the source of
truth. If a future tool wants machine-readable status, it can parse
the `— \`status\`` tokens after each heading.
