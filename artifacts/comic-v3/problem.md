# Problem: Comic v3 — Visual Quality Reinstated

## Task

Restore the visual quality that v1 had and v2 lost. Comic v2 was
verified (SANY + TLC, 14/12 distinct states) but the user observed it
was "simpler, rougher, less expressive" than v1. The root cause was
documented in `artifacts/comic-v2-regression-analysis/` — refinement.md
tracked primitives (file naming, palette hex, icon dimensions) instead
of intentions (emotional beats, character expression, what each panel
must communicate).

The methodology's Known Limitations L4 (refinement is minimal-by-design
and not validated) is the canonical reference for this gap.

## Desired Outcome

A v3 comic packet where each of the 11 panels:

1. Has **explicit Aesthetic Invariants** in `refinement.md` (emotional
   beat, character focus, background role, continuity)
2. Has a **named human reviewer** with declared competence in visual
   storytelling, who has signed the `verification.json` `human_review`
   block
3. Visually restores Maya's face (eyes, mouth, expression) and Maya's
   body language (posture, hand position, gaze direction)
4. Visually restores the background world (city silhouette through the
   window, sun light, coffee cup, browser tabs, code editor feel)
5. Preserves all v2 verified model elements (7 reader states, 11 panel
   transitions, palette discipline, dimension variation)

## What v3 explicitly inherits from v2

- Reader-state model with 7 states (engaged/curious/alarmed/frustrated/hopeful/enlightened/empowered)
- Palette discipline (blue/amber/red/purple/green as reader-state markers)
- Dimension variation (600×400 breathers, 800×600 narrative, 1000×800 climaxes)
- The two new panels from v2 (panel 05 "Alone" and panel 11 "The Stamp")

## What v3 explicitly fixes from v2

- Maya is no longer a headless 40×80 rectangle. She has a head with
  cheekbones, eye sockets, mouth, hair shape — enough to read emotion
- Maya has a body language — tilt, arm position, gaze direction
- Backgrounds carry meaning — window light in panel 1, alarm glow in
  panel 4, lamp circle in panel 5, tablet glow in panel 6, monitor
  wash in panel 7, beam spotlight in panel 8
- Hand-to-mouth reaction in panel 8
- Coffee cup visible in panel 1, panel 7
- Multiple browser tabs around Maya in panel 4
- Each panel picks up lighting/mood from the previous panel

## Acceptance Criteria

- 11 panels render with character expression and environmental detail
- Aesthetic Invariants section in refinement.md for every panel
- `human_review` block has `by: <named illustrator>`, signed and dated
- `validate-panels.sh` structural check still passes
- `bin/verify` model still passes (read states, transitions, palette)
- v1 panels remain in `comic/panels/` and `Comic_v1.md` as provenance
- v2 panels remain in `artifacts/comic-v2/implementation/` and
  referenced from `Comic.md`'s Provenance section