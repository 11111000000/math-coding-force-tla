# Refinement: Comic v3 — Reader-State to Aesthetic Composition

## State Mapping

| Model variable | Visual element | File format |
|---|---|---|
| `state \in ReaderStates` | Maya's posture, expression, gaze direction; lighting mood | `<g transform>`, `<circle>`, `<path>`, `<rect>` with face features |
| `panelIndex \in 0..10` | Panel viewport dimensions and grid position in Comic.md | `<svg width height>` attributes |
| `palette \in PaletteElements` | Background `<rect fill>` color + dominant accent color | hex values from STYLE.md |
| `emotional_beat \in EmotionalBeats` | Maya's face expression, body language, scene lighting, supporting props | `<path>` for mouth, `<circle>` for eyes, ambient circles for light |

### Character consistency (NEW in v3)

Maya is no longer a headless icon. She has:

- **Head**: r=22 (was r=15 in v2 — too small to read emotion), fill `#cbd5e1` (slate-300)
- **Face features**: eyes (small ellipses), mouth (path), eyebrow lines, hair shape (curved path)
- **Body**: 50×110 (was 40×80), fill `#94a3b8` (slate-400), with arm shapes (path) for posture
- **Hair**: short dark hair, fill `#1e293b` (slate-800), covers top of head
- **Clothing hint**: dark hoodie (rounded shape over body), fill `#475569` (slate-600)
- **Skin tone variation by panel**: subtle eye-area shadow or highlight tied to lighting
- **Hand**: small ellipse at end of arm path

Each panel's Maya must satisfy the character's emotional beat. The
same head dimensions across all panels — only the FACE FEATURES change.

### Continuity invariants (NEW in v3)

Across the 11 panels:

- **Pose continuity**: panel 2's "deploy party" Maya has hand-on-keyboard from panel 1
- **Lighting continuity**: panel 4's red alarm glow carries into panel 5's red lamp circle; panel 6's purple tablet glow becomes panel 7's purple monitor wash; panel 8's green beam becomes panel 9's green checkmark stamp
- **Focus continuity**: when panel X focuses on Maya's face (e.g. panel 4), panel X+1 must keep that focus area alive (e.g. panel 5's empty chair still in same position; panel 6's mentor in same lighting)

## Operation Mapping

| Panel file | panelIndex | state (after) | palette | dimensions | emotional_beat |
|---|---|---|---|---|---|
| `01-looks-right.svg`   | 0  | engaged → curious     | blue   | 800×600 | confident |
| `02-ship-it.svg`       | 1  | curious → engaged     | blue   | 600×400 | triumphant |
| `03-the-clicks.svg`    | 2  | engaged → curious     | green  | 600×400 | neutral |
| `04-the-bug.svg`       | 3  | curious → alarmed     | red    | **1000×800** | panicked |
| `05-alone.svg`         | 4  | alarmed → frustrated  | red    | 800×600 | lonely |
| `06-the-mentor.svg`    | 5  | frustrated → hopeful  | purple | 800×600 | rescued |
| `07-the-model.svg`     | 6  | hopeful → hopeful     | purple | 800×600 | focused |
| `08-tlc-finds-it.svg`  | 7  | hopeful → enlightened | green  | **1000×800** | triumphant |
| `09-fix-first.svg`     | 8  | enlightened → enlightened | green | 800×600 | satisfied |
| `10-better-world.svg`  | 9  | enlightened → empowered | green | 800×600 | grateful |
| `11-the-stamp.svg`     | 10 | empowered → empowered | green  | 600×400 | complete |

## Aesthetic Invariants

This section is the primary mitigation for Known Limitations L4 in the
visual-comms domain. Each panel has four invariants. These cannot be
mechanically checked; they require named-reviewer sign-off.

### Panel 01 — "Looks Right" (confident)

- **Emotional beat**: Confident, settled, slightly smug.
  Maya leans back in her chair; her hand is on the keyboard but not
  typing fast. Her mouth is a small smile. Her eyebrows are relaxed.
  Eye gaze is at the laptop screen.
- **Character focus**: Maya's face and torso are mid-frame. Coffee
  cup is on the right side of the desk.
- **Background role**: Friday sun through the window lights the
  scene from the left. City silhouette visible outside. Window glow
  is amber `#f59e0b`. The laptop screen glows blue on Maya's face.
- **Continuity**: Panel 1 establishes Maya's baseline posture and
  the "blue" palette. Panel 2 inherits the same posture (hand still
  on keyboard, same smile fading into deploy joy).

### Panel 02 — "Ship It" (triumphant, deploy party)

- **Emotional beat**: Triumphant. Maya raises both arms (one hand
  pointing at the laptop, one hand with a coffee mug raised) in a
  deploy cheer. Mouth wide open in a laugh.
- **Character focus**: Maya's full body visible. Coffee mug in left
  hand. Code-flow lines from her laptop to the right.
- **Background role**: Confetti-like green dots fill the upper-right.
  Server tower on the right, green status lights. Clock shows 5:00 PM.
- **Continuity**: Maya's face has the same head r=22, hair, hoodie
  colors as panel 1 — only the expression and pose change.

### Panel 03 — "The Clicks" (neutral)

- **Emotional beat**: Neutral, normal. Three users on phones in
  vertical strips. No close-up of any single face. Green checkmarks
  appear next to each click. Maya is absent.
- **Character focus**: Three users; each shown from chest up,
  holding a phone with green checkmark. Diverse faces — different
  hair, skin tone, age hints.
- **Background role**: Each strip is a vertical band; backgrounds
  are simple grey-slate `#1e293b` for separation.
- **Continuity**: All green, no alarm. The "normalcy" baseline
  before the storm of panel 4.

### Panel 04 — "The Bug" (panicked, climax)

- **Emotional beat**: Panicked. Maya's face fills the lower-right
  quadrant, scaled large (head r=44 — twice normal). Eyes wide,
  mouth open, eyebrows raised in alarm. Hands raised to temples.
- **Character focus**: Maya's panicked face is THE focus of the
  bottom half. Top half is phone notifications in red — but Maya
  is the protagonist.
- **Background role**: Top half: red phone notifications
  ("Charged twice!", "Where's my refund?", "I'm switching banks"),
  each with a small red exclamation icon. Bottom half: multiple
  browser tabs shown as overlapping rectangles around Maya's head.
  The bug-creature sits visibly at the intersection labeled "click
  event" and "async fetch" with a small text label.
- **Continuity**: Panel 5 inherits the red alarm color but reduces
  intensity — the panic is now exhaustion.

### Panel 05 — "Alone" (lonely)

- **Emotional beat**: Lonely. Maya at her desk, lights off except
  one small lamp (amber `#f59e0b` circle behind her). Maya's
  posture is slumped, head down, looking at the same code from
  panel 1 but now with the screen emitting red glow.
- **Character focus**: Maya's silhouette from the side, hunched.
  Eyes not visible (downcast). Mouth closed, no smile, no grimace
  — just stillness.
- **Background role**: Single lamp circle behind Maya on the left.
  Empty chair on the right where the Formalist will sit in panel 6.
  Bug-creature in the screen's corner, watching.
- **Continuity**: Empty chair is the visual promise of panel 6.

### Panel 06 — "The Mentor" (rescued)

- **Emotional beat**: Rescued. Maya leans forward, eyes wide with
  attention. The Formalist (older, glasses, taller) holds a glowing
  tablet showing TLA+ code. The tablet's purple glow catches both
  their faces.
- **Character focus**: Two-shot. Maya on the right, leaning
  toward the Formalist on the left. The Formalist's tablet is
  between them.
- **Background role**: Faint constellation lines (state machine
  foreshadow) in the background. Bug-creature in background, small,
  dim. The amber from panel 5 is gone; purple has taken over.
- **Continuity**: Maya's posture has changed from slumped to
  leaning forward — the rescue arc. The empty chair from panel 5
  now has the Formalist.

### Panel 07 — "The Model" (focused)

- **Emotional beat**: Focused. Maya sits upright, eyes on the
  right monitor (state diagram). Mouth closed, slight smile of
  concentration. Both monitors emit purple glow.
- **Character focus**: Maya's silhouette from behind, two monitors
  visible. Left monitor: TLA+ code with purple syntax highlighting.
  Right monitor: clean state diagram with circular green nodes.
- **Background role**: Two monitors side by side. The bug-creature
  is invisible — hiding in the model. Maya's shadow visible on
  the desk surface.
- **Continuity**: Maya's face is in profile here, hands on
  keyboard. Panel 8 inherits the focused posture and adds the
  green verification beam.

### Panel 08 — "TLC Finds It" (triumphant, relief — climax)

- **Emotional beat**: Triumphant (relief, different from panel 2's
  deploy joy). Maya stands back, one hand raised to her mouth in
  surprise, the other hand pointing at the TLC Crystal Computer.
  The Formalist beside her, calm.
- **Character focus**: TLC Crystal Computer at CENTER — large
  faceted green octagon (hexagonal sides). Green beam scanning
  from TLC toward Maya's code. Maya watches from the lower-left
  corner, hand raised. The Formalist stands calmly beside her.
- **Background role**: Constellation ACTIVE in background with one
  red bug-node flashing red — the climax of the visual. Big green
  label "StateInvariant violated" at the top.
- **Continuity**: Maya's hand-to-mouth reaction beats the
  v2's static icon. The green beam connects the model (panel 7)
  to the bug (panel 4) — the visual closes the loop.

### Panel 09 — "Fix First, Then Code" (satisfied)

- **Emotional beat**: Satisfied. Maya points at the verified state
  diagram with a calm, satisfied smile. The bug-creature is
  trapped in a small box labeled "FIXED IN MODEL" in red.
- **Character focus**: Maya triumphant, pointing at the diagram.
  TypeScript code on the LEFT monitor matches the verified model.
- **Background role**: All state diagram paths green. Small green
  checkmark "verdict: VERIFIED".
- **Continuity**: Maya's posture shifts from reaction (panel 8) to
  resolution (panel 9). Same monitors, but the bug is now boxed.

### Panel 10 — "Better World" (grateful)

- **Emotional beat**: Grateful. Wide panoramic. Diverse users in
  the top half, smiling, clicking confirm. Maya at her desk in the
  bottom half, looking up at the constellation with satisfaction.
- **Character focus**: Multiple users across the top, all with
  green checkmarks. Maya small but present, looking up. The
  Formalist beside her, tablet dim.
- **Background role**: State machine as a constellation stretched
  across the "night sky" of the panel — many nodes, all green,
  all connected. Small team visible in background.
- **Continuity**: The constellation has now expanded from panel 6
  (faint) and panel 8 (active) to panel 10 (immense).

### Panel 11 — "The Stamp" (complete)

- **Emotional beat**: Complete. Terminal. Single large rectangular
  "VERIFIED" stamp, rotated -8 degrees, fill green, thick stroke
  border. "VERIFIED" in monospace text inside, 60px.
- **Character focus**: Maya's small icon in the bottom-right
  corner, looking at the stamp. No dialogue. No action.
- **Background role**: Faint repeating pattern of the state
  machine constellation as small icons (a meta-texture — the
  methodology is now everywhere).
- **Continuity**: The stamp inherits the green from panels 8-10
  and the blue from panels 1-2 — the methodology has integrated
  all colors.

## Invariant Preservation Strategy

| Invariant | Preservation mechanism |
|---|---|
| `TypeInvariant` | Each panel SVG is a single static file with explicit dimensions, palette hex, and emotional_beat encoded in the scene composition |
| `TransitionInvariant` | File naming convention `NN-*.svg` enforces monotonic `panelIndex`. Reordering breaks the `Comic.md` link list |
| `PaletteInvariant` | First `<rect fill>` is `#0d1117` background; the dominant accent is from PaletteElements |
| `EmotionalBeatInvariant` | Each panel's face features (mouth path, eyebrow path, eye shape) encode the beat. The validator asserts file existence; the human reviewer asserts beat correctness |
| `Aesthetic Invariants` | This document. Verified by named reviewer, recorded in `verification.json#human_review.by` |

## Test Obligations

1. **Structural (mechanical)**: `validate-panels.sh` confirms:
   - 11 panel files exist with correct dimensions
   - Background is `#0d1117`
   - Palette accent present
   - Maya data-attribute on appropriate panels
2. **Mechanical model**: `bin/verify` confirms:
   - SANY parses Model.tla
   - TLC verifies the state transitions and palette + beat invariants
3. **Visual (human)**: A named reviewer with declared competence in
   visual storytelling inspects each panel and signs the human_review
   block in `verification.json`. The review checklist:
   - [ ] Maya's face shows the declared emotional beat
   - [ ] Background carries the declared meaning (light, color, props)
   - [ ] Continuity with the previous panel is preserved
   - [ ] No regression versus v1 quality

## Runtime Checks

None. The artifact is a static SVG comic embedded in markdown. There
is no executable code, no async fetch, no state machine in the browser.

## Why This Refinement Stands on the Model

The model says: "the reader traverses 7 cognitive states across 11
panels, each panel has a state, a palette, a viewport size, and an
emotional beat." The implementation says: "11 SVG files, each named
with its panel index, each painted with the state's palette, each
composed to transmit the declared emotional beat, each connected to
the previous and next by lighting, pose, and focus continuity."

If the implementation drifts from the model:
- Wrong state — file naming exposes it (visible diff)
- Wrong palette — first `<rect>` exposes it (validator catches)
- Wrong emotional beat — the named reviewer catches (human_review)
- Broken continuity — the named reviewer catches (human_review)

The model is small enough (~200 lines) that all three checks are
practical to run for every commit.