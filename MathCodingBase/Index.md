# MathCoding Index — Force-TLA+ Edition

> **Force-TLA+ edition.** This repository requires a formal TLA+ model
> that passes SANY + TLC on every task packet. The newer, more flexible
> edition at [`11111000000/math-coding`](https://github.com/11111000000/math-coding)
> relaxes this to a `VERIFIED` / `NEEDS_REVISION` / `UNVERIFIABLE:*`
> verdict space, accepting human-review as a substitute for mechanical
> verification. This edition does not.

A reader's map of the knowledge base. The methodology is small enough to read end-to-end in one sitting, but most people come with a specific question. Start from the section that matches yours.

## Meta

The orientation layer. Read these first if you are new.

- [Manifesto](00-Meta/Manifesto.md) — one page, the thesis
- [Dialectical Analysis](00-Meta/Dialectical Analysis.md) — why artifact-centeredness, not prompt-centeredness
- [Fractal Principle](00-Meta/Fractal Principle.md) — why the methodology describes itself through its own pipeline
- [Methodology in Russian](00-Meta/Methodology in Russian.md) — detailed introduction in Russian
- [Roadmap](00-Meta/Roadmap.md) — agent-maintained work plan, packet by packet

## Theory

The shortest path to "how math-coding works, formally".

- [Mathematical Development Cycle](01-Theory/Mathematical Development Cycle.md) — the seven steps
- [Three Layers of Rigor](01-Theory/Three Layers of Rigor.md) — when L1 contracts suffice, when you need L2 state machines, when L3 categories are worth it
- [TLA+ Role](01-Theory/TLA+ Role.md) — why TLA+ is the default formal substrate, and what lives outside it
- [Refinement as Bridge](01-Theory/Refinement as Bridge.md) — why the verified model is not yet the implementation

## Protocols

The mechanics. Each protocol answers one operational question.

- [Task Packet Protocol](02-Protocols/Task Packet Protocol.md) — what every packet must contain
- [Assumption Protocol](02-Protocols/Assumption Protocol.md) — how to record and tag assumptions
- [Verification Evidence Protocol](02-Protocols/Verification Evidence Protocol.md) — what `verification.json` must record
- [Refinement Protocol](02-Protocols/Refinement Protocol.md) — the minimum sections in `refinement.md`
- [Traceability Protocol](02-Protocols/Traceability Protocol.md) — how model elements map into code locations

## Architecture

The structural decisions that shape the repo.

- [Artifact-Centered Architecture](03-Architecture/Artifact-Centered Architecture.md) — why the agent is replaceable but the artifacts are not
- [Agent Portability Model](03-Architecture/Agent Portability Model.md) — what to keep and what to swap when porting
- [Mechanical Verification Model](03-Architecture/Mechanical Verification Model.md) — the limit between mechanical and human responsibility
- [UI Application Guide](03-Architecture/UI Application Guide.md) — the long worked example: formal methods for UI state machines

## Fractal Self

Where the methodology applies its own rules to itself.

- [Self Problem](04-Fractal-Self/Self Problem.md) — the methodology as a problem to solve
- [Self Assumptions](04-Fractal-Self/Self Assumptions.md) — what the methodology assumes about the world
- [Self Refinement](04-Fractal-Self/Self Refinement.md) — model concepts → repository files
- [Self Justification](04-Fractal-Self/Self Justification.md) — why this dual role isn't vanity

## Examples and artifacts

Working packets, all passed through mechanical verification.

- [UI Application Guide](03-Architecture/UI Application Guide.md) — narrative tutorial
- `examples/minimal-spec/` — verified, 2 states, 2 `THEOREM`s proved
- `examples/ui-modal-dialog/` — verified, 8 states
- `methodology/self-spec/` — verified, 7 states, the methodology describes itself
- `artifacts/ui-modal-react/` — verified, 8 states, React/TypeScript refinement

## Adapter docs

Per-runtime instructions.

- `adapters/cursor/README.md` — Cursor IDE
- `adapters/claude-code/README.md` — Claude Code
- `adapters/generic/README.md` — generic contract for any agent

## Verification tiers

The pipeline runs three tools. Each gates the next.

- **Tier 1: SANY** (parsing) — always required
- **Tier 2: TLC** (bounded model checking) — required for stateful specs
- **Tier 3: TLAPS** (proof-producing) — required only for `THEOREM` blocks