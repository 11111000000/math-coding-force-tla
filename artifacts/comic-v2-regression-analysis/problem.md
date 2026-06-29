# Problem: Comic v2 Quality Regression

## Task

Document the quality regression observed in the Comic v2 packet (panels
in `artifacts/comic-v2/implementation/`) compared to Comic v1 (panels
in `comic/panels/`). v2 panels were verified as structurally correct
(dimensions, palette, Maya presence) but the user observed they are
"simpler, rougher, less expressive" than v1.

## Desired Outcome

A packet that records:

1. **What regressed**: specific qualities lost in v2 vs v1
2. **Why it regressed**: which methodological assumptions failed
3. **What a v3 should do**: which refinements to the methodology would
   catch this regression before deployment

The verdict for this packet is `UNVERIFIABLE:OUT_OF_SCOPE` — visual
quality is not mechanically checkable. The human_review block names a
named reviewer and a process for v3.

## Observed Regression

| Quality | v1 | v2 | Delta |
|---------|----|----|-------|
| Maya has a face | yes (eyes, mouth, expression) | no (head circle only) | lost |
| Background detail | city silhouette, sun, window light | flat dark fill | lost |
| Coffee cup on desk | yes | sometimes yes, sometimes no | inconsistent |
| Pose / body language | slight tilt, working posture | rigid vertical icon | lost |
| Panel 4 (Bug) intensity | Maya's panicked eyes, multiple tabs, hand-to-head | single panic-position icon | lost |
| Panel 5 (Mentor) intimacy | Maya leaning in, light catching her face | two icons side by side | reduced |
| Panel 8 (TLC climax) | faceted crystal, beam, hand-to-mouth reaction | smaller crystal, no reaction beat | lost |
| Text/caption integration | caption flows with imagery | text floating on background | reduced |

The structural validator passes for all 11 v2 panels. The user-facing
quality regressed.

## Why

Three specific failures in the v2 process:

1. **McCloud's principle applied as maximum abstraction, not appropriate abstraction.**
   v2 reduced Maya to body 40×80 + head r=15. McCloud's *Understanding
   Comics* argues for finding the *right* level of abstraction for the
   story, not the minimum. v2's minimum is below what the story needs.

2. **Refinement.md specified primitives, not intentions.**
   v2/refinement.md describes file naming, palette hex, and Maya icon
   dimensions. It does not say "Panel 4 must convey panic" or "Maya
   in panel 6 must lean in toward the mentor's tablet". Refinement
   tracked form without tracking meaning.

3. **Validation checked structure, not expression.**
   validate-panels.sh asserts file existence, dimensions, palette hex,
   Maya data-attribute. It does not check emotional transmission.
   The verifier confirmed a green build of something that did not
   communicate its purpose as well as v1.

## Acceptance Criteria

- This packet documents what regressed and why
- The packet's verdict is UNVERIFIABLE:OUT_OF_SCOPE with a named
  reviewer and a process for v3
- v1 panels remain available in the knowledge base
- v2 panels remain available in the knowledge base (with v1 link)
- The Methodology/Russian mirror files are not affected by this
  regression — they are about prose, not about visual design