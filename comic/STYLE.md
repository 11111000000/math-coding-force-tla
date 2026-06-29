# MathCoding Comic — Visual Style Guide

> **Version 2 note.** v2 panels live in `artifacts/comic-v2/implementation/`.
> The hex codes, character design, and palette table below are v1 records —
> preserved for provenance. For the v2 verified style, see
> `artifacts/comic-v2/refinement.md` (state mapping) and the
> `Visual Style` table in `MathCodingBase/00-Meta/Comic.md`.
> The v1 panels in `comic/panels/` are kept as the original sketch;
> the workflow now copies from the verified packet.

## Title
**"The Math of Trust"** (Математика доверия)

## Tone
- Editorial / explanatory — like 3blue1brown meets The New Yorker
- Serious subject, accessible delivery
- Characters feel real, not superheroic
- Math/verification = beautiful, physical, almost mystical
- Bugs = small red creatures that hide in race conditions

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background dark | `#0b0f19` | Panel backgrounds, night scenes |
| Card dark | `#111827` | Panel inner backgrounds |
| Border | `#1e293b` | Panel borders, subtle dividers |
| Warm amber | `#fbbf24` | Human moments, protagonist hair, warmth |
| Math blue | `#60a5fa` | TLA+ code, math symbols, formal models |
| Verification green | `#34d399` | TLC success states, "VERIFIED" badges |
| Bug red | `#f87171` | Race conditions, errors, the antagonist |
| Formalism purple | `#a78bfa` | TLA+ keywords, abstract concepts |
| Text bright | `#f8fafc` | Primary text |
| Text dim | `#94a3b8` | Secondary text, captions |

## Visual Motifs

### The State Machine (recurring)
A circular diagram with 7 nodes labeled 01-07. Appears:
- As a constellation in the sky (hero shots)
- As a circuit board characters walk on (transition scenes)
- As a crystal model on a desk (verification scenes)

### The Bug (recurring antagonist)
A small red imp-like creature with sharp edges. Hides in:
- Race conditions (parallel lines that cross)
- Edge cases (corners of code blocks)
- Async callbacks (between brackets)
Disappears when scanned by the verification beam.

### The Formalist's Tablet
A glowing tablet showing TLA+ code. The tablet emits blue light that illuminates the protagonist's face when she reads it. The code on the tablet is the real Model.tla from our verified packets.

### The Crystal Computer (TLC)
A large geometric crystal/circuit hybrid. When scanning code, emits a green beam that reveals hidden bugs as red silhouettes.

## Character Design

### Maya (Protagonist)
- Mid-20s developer
- Short dark hair, slightly messy
- Hoodie, jeans, comfortable sneakers
- Laptop always visible
- Expression shifts from confident (panel 1) to horrified (panel 4) to curious (panel 5) to triumphant (panel 10)

### The Formalist (Mentor)
- Older, glasses, gray beard
- Wears a cardigan
- Holds a glowing tablet
- Calm, patient expression
- Speaks in short, precise sentences

### The Bug (Antagonist)
- Small red imp with sharp angles
- Hides in code, appears in shadows
- Defeated by verification beam (panel 8)

## Typography

- **Speech bubbles**: rounded rectangles, dark fill, blue or amber accent text
- **Math/code**: monospace, purple or blue
- **Captions**: monospace, dim text
- **Sound effects**: bold monospace, scaled large
- **Panel borders**: 2px solid `#1e293b`

## Panel Composition Rules

1. Wide establishing panels for setup (1, 2, 10)
2. Medium panels for action (3, 4, 6, 7, 9)
3. Close-ups for emotion (4 final beat, 8 bug reveal)
4. Always show at least one mathematical element (code, state diagram, symbol)
5. Negative space matters — don't overcrowd

## Emotional Arc

- Panels 1-2: confident blue (everything's fine)
- Panels 3-4: red creeps in (something's wrong)
- Panel 4 climax: red dominates (disaster)
- Panel 5: amber (discovery, warmth)
- Panels 6-8: blue/purple/green (verification process)
- Panel 9: green dominant (success)
- Panel 10: balanced (world improved)