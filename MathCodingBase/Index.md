# MathCodingFractal Index

## Meta
- [[Methodology in Russian]] — подробное введение на русском
- [[Manifesto]]
- [[Dialectical Analysis]]
- [[Fractal Principle]]
- [[Roadmap]] — agent-maintained work plan with packet statuses

## Theory
- [[Mathematical Development Cycle]]
- [[Three Layers of Rigor]]
- [[TLA+ Role]]
- [[Refinement as Bridge]]

## Protocols
- [[Task Packet Protocol]]
- [[Assumption Protocol]]
- [[Verification Evidence Protocol]]
- [[Refinement Protocol]]
- [[Traceability Protocol]]

## Architecture
- [[Artifact-Centered Architecture]]
- [[Agent Portability Model]]
- [[Mechanical Verification Model]]

## Fractal Self
- [[Self Problem]]
- [[Self Assumptions]]
- [[Self Refinement]]
- [[Self Justification]]

## Examples
- [[UI Application Guide]] — подробно о применении в UI
- `examples/minimal-spec/` — verified, 2 states, 2 proved THEOREMs
- `examples/ui-modal-dialog/` — verified, 8 states
- `methodology/self-spec/` — verified, 7 states, методология описывает сама себя
- `artifacts/ui-modal-react/` — verified, 8 states, React/TypeScript refinement

## Adapter Docs
- `adapters/cursor/README.md` — Cursor IDE
- `adapters/claude-code/README.md` — Claude Code
- `adapters/generic/README.md` — generic contract

## Verification Tiers
- Tier 1: SANY (parsing) — always required
- Tier 2: TLC (bounded model checking) — required for stateful specs
- Tier 3: TLAPS (proof-producing) — required only for THEOREM blocks
