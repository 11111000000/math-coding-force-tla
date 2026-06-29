# Problem: Humanization pass + Russian translations of key methodology docs

## Context

The `MathCodingBase/` knowledge base and the top-level entry documents were authored in a mix of styles. Some files (Methodology in Russian, UI Application Guide) read naturally; others (Manifesto, Roadmap, Fractal Principle) carry classic LLM tells: rule-of-three bullet lists, "this is not X, it is Y" parallelism, low burstiness, em-dash density, abstract statements without grounding numbers.

The methodology itself says: **artifacts are the source of truth, and the methodology describes itself**. So the prose in those artifacts is part of the methodology. If the prose reads as AI-generated, the methodology presents as AI-generated. That is a real cost: contributors skim it once and dismiss it as boilerplate.

## Task

Two parallel deliverables:

1. **Humanize** all 22 key documents under `MathCodingBase/` plus `README.md`, `QUICKSTART.md`, `AGENTS.md`, and `Index.md`. Apply the nine levers from `humanize-writer` and `humanize-editor`. Preserve factual content; preserve length (±10 %); preserve language. Add first-person voice where the genre permits.

2. **Translate** eight entry-level English documents into Russian, with all translatable terms rendered in Russian. Tools and TLA+ syntax keep their Latin form. The eight: `README.md`, `QUICKSTART.md`, `AGENTS.md`, `Index.md`, `Manifesto.md`, `Dialectical Analysis.md`, `Fractal Principle.md`, `Roadmap.md`. Place Russian versions under `MathCodingBase/00-Meta/ru/` with filename suffix `.ru.md`.

## Desired Outcome

A reader sampling any single artifact in `MathCodingBase/` should not be able to flag it as LLM output by sentence rhythm, parallelism density, or generic vocabulary. A Russian-speaking newcomer can find a fully translated introduction without translating English on the fly.

## Out of scope

- Comic (`Comic.md`) — visual narrative; translated text already lives in the panels themselves.
- `Methodology in Russian.md` — already Russian; will be humanized, not translated.
- Schemas, JSON, code, `.tla` files, `bin/` scripts.
- Implementation packets (`artifacts/ui-modal-react/`, `artifacts/comic-v2/`, `artifacts/landing-refactor-2026-06/`) — separate work.