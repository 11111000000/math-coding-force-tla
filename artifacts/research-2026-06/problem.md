# Problem: Research findings on methodology applied to itself

## Context

This packet records the empirical findings of a research session conducted against the MathCoding repository itself. The methodology has been applied to its own documentation and structure over multiple iterations. The research question was: where does the methodology help, where does it create friction, and what should a successor methodology look like?

The session ran from packet creation through several rounds of dialectical analysis with the user, who is the methodology's author and primary practitioner.

## Research questions

1. Does the methodology, applied to itself, reveal structural properties that can be measured and reasoned about?
2. Where in the artifact lifecycle does the methodology create unnecessary friction?
3. What alternative formal substrates (Alloy, Spin, Coq, property-based testing) might serve different task classes better than TLA+?
4. What is the right form for a successor methodology?

## Method

The researcher (the user) and an AI assistant conducted iterative dialectical analysis. The user challenged claims, the assistant surfaced empirical observations from the repository, and both revised their positions based on the evidence. Eleven packets already in the repository served as the empirical corpus.

## Empirical observations (collected, not interpreted)

The session collected the following facts by direct measurement of the repository at the time of the session:

- Eleven packets existed in `artifacts/`, `examples/`, and `methodology/self-spec`.
- Five of these packets addressed the methodology itself (unverifiable-as-design, docs-humanization-2026-06, protocol-strengthening, rebrand-mathcoding, self-spec).
- Four addressed external tasks (comic-v2, landing-refactor-2026-06, ui-modal-react, form-username-validation).
- Two were educational (minimal-spec, ui-modal-dialog).
- Average packet contained approximately 16 KB of artifact text.
- Of this, approximately 10% was the formal specification (Model.tla + Model.cfg), and approximately 90% was connective tissue (refinement, traceability, verification, problem statement, assumptions).
- In every packet, the refinement file was larger than the model file.
- Four packets contained implementation; in three of four, the refinement was less than 50% of the implementation size; in one it was 43%.
- The session produced three new packets (docs-humanization, unverifiable-as-design, rebrand-mathcoding) in approximately 90 messages.
- No data was collected comparing time-to-completion with and without the methodology. The session did not run controlled experiments on external tasks.

## Epistemic status of the conclusions

The findings below are organized by epistemic status:

**[fact]** — directly measured from the repository.
**[hypothesis]** — plausible interpretation of facts, not falsified within this session.
**[judgment]** — opinion of the researcher, not derivable from facts alone.
**[unknown]** — open questions that the session did not resolve.

## Findings

### F1. The methodology is structurally consistent with itself.

**[fact]** Every packet in the repository conforms to the same eight-artifact layout. **[judgment]** This consistency is the methodology's primary asset: a reader can open any packet and find the same structure.

### F2. The methodology is internally heavy.

**[fact]** Of every byte of artifact text in a packet, 90% is connective tissue rather than specification. **[judgment]** This is friction. The reader must parse the same intent four times: once in problem.md, once in assumptions, once in model, once in refinement.

### F3. The methodology has no decision point for "do I need a packet at all".

**[fact]** The validator requires all eight artifacts. **[judgment]** This creates pressure to write a packet even for trivial tasks. The researcher reported in dialog that this pressure feels like friction.

### F4. The methodology makes unverifiability a first-class verdict.

**[fact]** A dedicated packet (unverifiable-as-design) established UNVERIFIABLE as a discriminated union with three subtypes (TOOL_MISSING, OUT_OF_SCOPE, DEFERRED), with a compensation obligation via human_review. **[judgment]** This is the right direction. Honesty about what cannot be checked is more valuable than false confidence.

### F5. The methodology has no epistemic markers.

**[fact]** Both `user-confirmed` and `agent-inferred` assumptions are written as assertions, with no distinction between fact, hypothesis, judgment, or unknown. **[judgment]** A future reader cannot tell which assumptions were checked and which were guessed.

### F6. The methodology treats TLA+ as the only formal substrate.

**[fact]** Every verified packet uses TLA+ via TLC. **[judgment]** This is sufficient for state-machine tasks and insufficient for relational data, pure functions, and existing code. A successor methodology should offer substrate selection.

### F7. The methodology's repository contains 45% self-application packets.

**[fact]** Five of eleven packets are about the methodology itself. **[judgment]** This is acceptable for a research context but unsustainable as a long-term ratio. It means the methodology is being studied rather than used.

## Conclusions transferred to successor methodology

The researcher concluded that a successor methodology (currently being designed as a new repository at `~/Desktop/math-coding/`) should:

1. Add a decision gate at packet creation (default `not-needed`, escalate to `needed`).
2. Add epistemic markers to assumptions (`fact` / `hypothesis` / `judgment` / `unknown`).
3. Reduce mandatory artifacts from eight to four, with automatic generation of refinement and traceability from the model.
4. Support multiple formal substrates (TLA+ for state, property-based testing for pure functions, later Alloy and Spin).
5. Mark the boundary between mechanical and human verification explicitly in the artifact schema.

The successor methodology is not yet built. This packet is the link between the old and new.

## Out of scope

This packet does not propose a successor methodology. It only records findings. The design and construction of the successor happens in the new repository.