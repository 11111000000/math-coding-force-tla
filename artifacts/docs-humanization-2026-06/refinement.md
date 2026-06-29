# Refinement: docs-humanization-2026-06

## State Mapping

The companion `Model.tla` describes the humanization contract as a degenerate state machine — one state, two actions (`Rewrite`, `Translate`). It exists for schema uniformity, not because the artifact has dynamic semantics. No refinement maps TLA+ variables onto program state, because there is no program.

## Operation Mapping

| Operation | Concrete artifact |
|-----------|-------------------|
| `Rewrite(doc)` | Replacement of one English `.md` file under the paths listed in `verification.json` `deliverables.english_humanized` |
| `Translate(doc)` | New file under `MathCodingBase/ru/` with `.ru.md` suffix and translated body |

The implementation step in this packet is the act of rewriting prose. No code generator, no reducer, no UI component. The "program" is the `humanize-writer` and `humanize-editor` skills plus their lexicons and lever catalogues in `~/.config/opencode/skills/`.

## Invariant Preservation Strategy

The methodology invariants that DO apply here:

- **Fractal property** — structural methodology changes go through a packet. This packet IS that mechanism.
- **Cross-link integrity** — every English file in the rewrite set has at most one Russian counterpart, and the cross-link uses the `.ru.md` suffix. Verified by manual inspection of the Russian `Index.ru.md` mirror section.
- **Terminology consistency** — Russian translations agree on a closed set of terms. Verified by scanning for English words in the Russian set; `verification.json` `audit_metrics.russian_negative_parallelisms` reports the final state.
- **Length preservation** — each English rewrite stays within ±10% of the source word count. Achieved by hand; spot-checked.

The methodology invariants that DO NOT apply here:

- `TypeSystemPreservesInvariant` — there is no type system over markdown prose.
- `RuntimeCheck` — there is no runtime. The "check" is human review and mechanical counters (em-dash density, negative-parallelism regex).

## Test Obligation Mapping

No executable tests in this packet. The equivalent obligations:

- Audit metrics in `verification.json` record before/after density numbers. Anyone reading the packet can re-run the counters and confirm.
- The Russian set contains zero negative parallelisms. The English set contains zero negative parallelisms. Both verified by the regex audit.
- Cross-link integrity: the Russian `Index.ru.md` lists 8 cross-links with `.ru.md` suffix; all resolve to existing files.

## Runtime-Check Mapping

No runtime checks. The Methodology's three-tier verification (SANY, TLC, TLAPS) is documented as not applicable to prose in `Mechanical Verification Model.md`. This packet accepts that and records `UNVERIFIABLE` rather than `VERIFIED`, exactly because the methodology's own `Mechanical Verification Model.md` says: when the tools don't apply, the verdict is `UNVERIFIABLE`, never `VERIFIED`.

## Why This Refinement Matters

Without `refinement.md`, this packet would be 26 rewritten files and 8 new Russian files dropped into the repo with no contract explaining why. The methodology says: never jump from the model to the code without stating how. Even when "code" means "rewritten prose", the discipline pays off — anyone picking up the packet can reconstruct what was done, why, and what bounds the work.