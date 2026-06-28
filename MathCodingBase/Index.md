# MathCodingFractal Index

## Meta
- [Methodology in Russian](00-Meta/Methodology in Russian.md) — подробное введение на русском
- [Manifesto](00-Meta/Manifesto.md)
- [Dialectical Analysis](00-Meta/Dialectical Analysis.md)
- [Fractal Principle](00-Meta/Fractal Principle.md)
- [Roadmap](00-Meta/Roadmap.md) — agent-maintained work plan with packet statuses

## Theory
- [Mathematical Development Cycle](01-Theory/Mathematical Development Cycle.md)
- [Three Layers of Rigor](01-Theory/Three Layers of Rigor.md)
- [TLA+ Role](01-Theory/TLA+ Role.md)
- [Refinement as Bridge](01-Theory/Refinement as Bridge.md)

## Protocols
- [Task Packet Protocol](02-Protocols/Task Packet Protocol.md)
- [Assumption Protocol](02-Protocols/Assumption Protocol.md)
- [Verification Evidence Protocol](02-Protocols/Verification Evidence Protocol.md)
- [Refinement Protocol](02-Protocols/Refinement Protocol.md)
- [Traceability Protocol](02-Protocols/Traceability Protocol.md)

## Architecture
- [Artifact-Centered Architecture](03-Architecture/Artifact-Centered Architecture.md)
- [Agent Portability Model](03-Architecture/Agent Portability Model.md)
- [Mechanical Verification Model](03-Architecture/Mechanical Verification Model.md)

## Fractal Self
- [Self Problem](04-Fractal-Self/Self Problem.md)
- [Self Assumptions](04-Fractal-Self/Self Assumptions.md)
- [Self Refinement](04-Fractal-Self/Self Refinement.md)
- [Self Justification](04-Fractal-Self/Self Justification.md)

## Examples
- [UI Application Guide](03-Architecture/UI Application Guide.md) — подробно о применении в UI
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
