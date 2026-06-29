# Refinement: Comic v2 Regression Analysis

## State Mapping

| Model variable | Refinement artifact |
|---|---|
| `phase` | Section in `problem.md` and `Roadmap.md` describing where the methodology stands |
| `v1_available` | Boolean: is `comic/panels/*.svg` present in the knowledge base? |
| `v3_planned` | Boolean: is there a roadmap entry for v3 with Aesthetic Invariants? |

## Operation Mapping

| Action | Real-world operation |
|---|---|
| `Detect` | User notices regression in v2 panels |
| `PlanV3` | Roadmap entry for v3 with Aesthetic Invariants added |
| `RegressToShippedV2` | v2 was deployed (this happened already) |

## Invariant Preservation Strategy

`V1PreservationInvariant` is preserved structurally — `comic/panels/*.svg`
files are git-tracked. They cannot be deleted without an explicit `git rm`
that shows in the diff. The diff is the invariant.

`RegressionTrackedInvariant` is preserved procedurally — once detected,
the regression lives on in this packet and the Roadmap.md v3 entry. It
cannot silently disappear because the artifacts that record it are
git-tracked.

## Test Obligations

1. `comic/panels/` still contains 10 SVG files (v1 preservation)
2. `artifacts/comic-v2-regression-analysis/verification.json` has
   `verdict: UNVERIFIABLE:OUT_OF_SCOPE` with populated `human_review`
3. `Roadmap.md` references v3 with Aesthetic Invariants as an open item

## Runtime Checks

None — this is an analysis packet, not a behavior model. The model
here tracks the meta-state of the methodology's awareness of the issue.

## Aesthetic Invariants (proposed for v3)

The v2 process failed because refinement.md tracked primitives
(dimensions, palette, file naming) and missed intentions (emotional
beats, character expression). v3 must add an `Aesthetic Invariants`
section to `refinement.md`:

For each panel:
- **Emotional beat**: what emotion does this panel transmit?
  (panic, frustration, curiosity, triumph, ...)
- **Character focus**: is the protagonist's face/body in focus?
  what is she doing with her hands?
- **Background role**: does the background carry meaning
  (window light, red glow) or is it decoration?
- **Continuity**: does this panel pick up where the previous left off
  in pose, lighting, and focus?

These cannot be mechanically checked. They MUST be checked by a named
human reviewer with declared competence (illustration, narrative
comics, or visual storytelling). The compensation contract for
UNVERIFIABLE:OUT_OF_SCOPE applies.

## Why This Refinement Matters

The methodology's Known Limitations file (L4) names refinement as
"minimal by design and not validated". This packet is a worked
example of how L4 manifests in practice — a verified, structurally
green packet that nevertheless fails the human-facing purpose.

v3's Aesthetic Invariants is the proposed mitigation for L4 in the
visual-comms domain. It does not solve L4 generally; it addresses
one specific class of artifact (sequential visual narrative) where
L4 has been observed to fail.