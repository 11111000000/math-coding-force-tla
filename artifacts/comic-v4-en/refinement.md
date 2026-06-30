# Refinement: Comic v4 (English) — Reader State to Aesthetic Composition with Humor

## State Mapping

| Model variable | Visual element |
|---|---|
| `state` | Maya's posture, expression, gaze direction; lighting mood |
| `panelIndex` | Panel viewport dimensions and grid position in Comic.md |
| `palette` | Background `<rect fill>` + dominant accent color |
| `emotional_beat` | Maya's face expression, body language, scene lighting |
| `locale` | Text labels inside panel and caption — `"en"` uses English, `"ru"` uses Russian |
| `reader_state` | Humor-or-not decision: `CHUCKLED` panels get easter eggs, `DEEPLY_FOCUSED` panels are clean, `UNCERTAIN` panels avoid humor |

### Readability Constraints (NEW in v4)

ALL panels must satisfy:

- **Text size**: minimum 18px for captions, 24px for panel titles, 14px only for code/monospace props inside the scene (and only when the panel itself is 1000+px wide)
- **Caption: minimum one full-width line**, never split across two lines awkwardly
- **Text contrast**: text against background must achieve at least 4.5:1 ratio for body text, 7:1 for titles
- **Speech bubble**: if dialogue is in a bubble (vs. caption), the bubble has a 2px stroke border and at least 60% opacity background fill so the bubble stands out from the scene
- **No fine detail below 4px stroke** — lines thinner than 4px render invisibly on phones
- **Panel min width 800px** for new v4 panels (was 600px in v3) — to ensure readable detail on phones without zoom

### Character consistency

Maya continues from v3:

- Head r=22, slate-300 skin
- Eyes, mouth, eyebrows, hair shape — all expressive
- Body 50×110, slate-400 with dark slate-600 hoodie
- Hair short, slate-800 fill
- Hand visible when panel needs gesture (panel 2 triumph, panel 6 reaching, panel 8 reaction)

NEW in v4: when panel has a comedic moment, Maya's mouth shape changes
for an extra beat of expression (grimace, half-smile in panel 1
before the deploy, straight face in panel 5 with screen glow on
cheek, slight nod in panel 11).

## Operation Mapping

| File | panelIndex | state (after) | palette | dims (v4) | beat | reader_state | locale |
|---|---|---|---|---|---|---|---|
| `01-looks-right.svg` | 0 | curious | blue | 1000×700 | confident | CHUCKLED | en |
| `02-ship-it.svg` | 1 | engaged | blue | 800×600 | triumphant | CHUCKLED | en |
| `03-the-clicks.svg` | 2 | curious | green | 800×600 | neutral | CHUCKLED | en |
| `04-the-bug.svg` | 3 | alarmed | red | 1200×900 | panicked | UNCERTAIN | en |
| `05-alone.svg` | 4 | frustrated | red | 1000×700 | lonely | UNCERTAIN | en |
| `06-the-mentor.svg` | 5 | hopeful | purple | 1000×700 | rescued | READING | en |
| `07-the-model.svg` | 6 | hopeful | purple | 1000×700 | focused | CHUCKLED | en |
| `08-tlc-finds-it.svg` | 7 | enlightened | green | 1200×900 | triumphant | DEEPLY_FOCUSED | en |
| `09-fix-first.svg` | 8 | enlightened | green | 1000×700 | satisfied | READING | en |
| `10-better-world.svg` | 9 | empowered | green | 1000×700 | grateful | READING | en |
| `11-the-stamp.svg` | 10 | empowered | green | 800×600 | complete | READING | en |

(climax dimensions 1200×900 — 50% bigger than v3)

## Aesthetic Invariants

For each panel: emotional beat, character focus, background role,
continuity, AND v4 NEW: **humor element** (when reader_state =
CHUCKLED) and **readability verification** (caption size, contrast).

### Panel 01 — "Looks Right" (confident, CHUCKLED)

- **Emotional beat**: Confident, settled, slightly smug.
  Maya leans back in her chair; smile is gentle not bright.
- **Character focus**: Maya's face centered, hand on keyboard,
  coffee cup visible.
- **Background**: Friday sun through window, city silhouette,
  amber light. Laptop screen glows blue on Maya's face.
- **Continuity**: establishes baseline; coffee cup here becomes
  the coffee mug raised in panel 2.
- **Humor (CHUCKLED)**:
  - Small text on the laptop screen monospace: `// it compiles ✓`
  - Above the laptop, a tiny Stack Overflow logo (orange box with
    `[SO]` monospace) as a sticker on the bezel — visual easter egg
  - In the city silhouette: a tiny building with `WWW` written on it,
    slightly off-color — a quiet web humor beat
- **Readability**: Caption 22px, monospace caption 18px min.

### Panel 02 — "Ship It" (triumphant, CHUCKLED)

- **Emotional beat**: Triumphant deploy cheer. Mouth open wide,
  one arm raised with coffee mug, other arm pointing at laptop.
- **Character focus**: Maya full body, server on right.
- **Background**: confetti green, server green status, clock 5:00 PM.
- **Continuity**: Maya's hand with mug tracks from panel 1's desk.
- **Humor (CHUCKLED)**:
  - The deploy confetti includes 2-3 small red "x" marks hidden
    among the green dots — almost invisible at first glance.
    Reader notices on re-read. Premonition.
  - Clock text reads `5:00 PM ⓘ` where ⓘ is a tiny tooltip that
    on second look reveals "Friday deploy" in monospace.
- **Readability**: Title 28px, caption 22px.

### Panel 03 — "The Clicks" (neutral, CHUCKLED)

- **Emotional beat**: Three users on phones, all green checkmarks,
  Maya absent, everything green.
- **Character focus**: Three diverse users, three vertical strips.
- **Background**: each strip a vertical band, distinct backgrounds.
- **Continuity**: All green, calm before storm of panel 4.
- **Humor (CHUCKLED)**:
  - Top of third strip: small green badge with text "847 users"
    but on close look, a tiny comment line in the strip's code
    says `// it works on MY machine` in monospace 14px
  - One user's phone shows a small "✓" in the corner that is the
    size of a dot — visual joke about tiny "happy" signals
- **Readability**: Three strips must remain readable. Caption 20px.

### Panel 04 — "The Bug" (panicked, UNCERTAIN)

- **Emotional beat**: Panicked. Top half: red phone notifications.
  Bottom half: Maya's face scaled large (head r=88 — TWICE v3).
  Eyes wide, mouth open in disbelief, eyebrows raised, hands
  raised to temples.
- **Character focus**: Maya's panicked face is THE focus of the
  bottom half.
- **Background**: red phone notifications flood the top half.
  Multiple browser tabs around Maya.
- **Continuity**: Maya's hands-up panic carries into panel 5
  where she's dropped them to the desk.
- **No humor**: UNCERTAIN reader_state. The bug is a serious
  subject. Panel stays clean.
- **Readability**: Title 36px, "ERROR" labels 22px, caption 18px.
  This panel is the largest (1200×900) for maximum impact.

### Panel 05 — "Alone" (lonely, UNCERTAIN)

- **Emotional beat**: Maya alone, slumped, screen red glow on
  her cheek. Eyes downcast.
- **Character focus**: Maya's silhouette from side, hunched.
  Empty chair beside her.
- **Background**: lamp circle (amber), red glow from screen,
  bug-creature in screen's corner.
- **Continuity**: Empty chair promises panel 6's mentor.
- **No humor**: UNCERTAIN. The loneliness is real.
- **Readability**: Lamp circle very visible (60px radius).

### Panel 06 — "The Mentor" (rescued, READING)

- **Emotional beat**: Rescued. Maya leaning forward, eyes wide.
  Formalist with tablet showing TLA+ code.
- **Character focus**: Two-shot, Maya on right, Formalist on left,
  tablet between them.
- **Background**: faint constellation lines, purple glow.
- **Continuity**: Empty chair now has the Formalist.
- **Humor (READING, gentle)**: The Formalist's tablet has a tiny
  mug icon next to the TLA+ code with text "I ♡ TLA+" 14px
  monospace — quiet fan-art easter egg.
- **Readability**: Tablet TLA+ code large enough to read at 22px.

### Panel 07 — "The Model" (focused, CHUCKLED)

- **Emotional beat**: Maya in profile, two monitors, focused.
- **Character focus**: Maya behind monitors, focused.
- **Background**: two monitors — left TLA+, right state diagram.
- **Continuity**: focused posture continues from panel 6 lean.
- **Humor (CHUCKLED, dry)**:
  - In the TLA+ code on the left monitor, a comment reads
    `// please work, please work` in 18px monospace (developer
    coping comment)
  - A second line below: `// last resort: try Stack Overflow`
- **Readability**: Code visible at 22px+ given 1000×700 panel.

### Panel 08 — "TLC Finds It" (triumphant, DEEPLY_FOCUSED)

- **Emotional beat**: TLC catches the bug. Maya's hand-to-mouth
  reaction. The Formalist calm.
- **Character focus**: TLC Crystal Computer at center.
- **Background**: active constellation with red bug-node flashing,
  green beam, bug in spotlight.
- **Continuity**: Maya's focused posture continues; the green beam
  is the visual payoff of the focused state from panel 7.
- **No forced humor**: DEEPLY_FOCUSED. BUT:
- **Subtle humor (developer-speak)**:
  - Above TLC: small monospace caption reads
    `14 generated, 12 distinct, 0 regrets`
    The "0 regrets" is a developer Easter egg.
  - The bug in the spotlight has a tiny sweat-drop emoji-like
    shape `💦` drawn as `<path>` — visual fear.
- **Readability**: "StateInvariant violated" at 32px minimum.

### Panel 09 — "Fix First, Then Code" (satisfied, READING)

- **Emotional beat**: Maya points at verified diagram, calm smile.
- **Character focus**: Maya's pose, two monitors.
- **Background**: All state paths green, bug in box.
- **Continuity**: Maya's pointing gesture continues from panel 8's
  reaction but now is calm/satisfied, not shocked.
- **No humor**: READING. The fix lands clean.
- **Readability**: TypeScript code at 18px, state diagram nodes
  with their labels at 16px+.

### Panel 10 — "Better World" (grateful, READING)

- **Emotional beat**: Panoramic. Diverse users, Maya small but
  present, constellation stretched across the sky.
- **Character focus**: Five users, Maya at her desk.
- **Background**: state machine as constellation, sky tone.
- **Continuity**: Constellation has expanded from panel 6/8 to 10.
- **No forced humor, but small developer easter eggs (READING)**:
  - Stats panel in lower right shows `0 incidents`, `100% uptime`,
    `47 packets` — and in smaller italic: `// yes, really`
  - One user's badge has small text: `verified ✔ verified`
    (over-verified redundancy joke)
- **Readability**: Five users' icons must each be readable —
  minimum 60×60 each. Caption 22px.

### Panel 11 — "The Stamp" (complete, READING)

- **Emotional beat**: Terminal VERIFIED stamp, rotated -8 degrees.
- **Character focus**: Maya's small icon, bottom-right.
- **Background**: faint constellation meta-pattern.
- **Continuity**: Stamp inherits green (8-10) and palette
  discipline from all predecessors.
- **Humor (READING, terminal)**:
  - Small text inside the stamp area, monospace 12px:
    `// all your tests are belong to us`
    — a meme reference ("All Your Base Are Belong To Us")
    for developers.
  - The `VERIFIED` text itself includes a tiny caret-shape
    signature next to the D.
- **Readability**: "VERIFIED" at 100px+ font weight bold.

## Humor Discipline Rules

1. **Humor must be layer-2**: easter eggs must NOT change the
   emotional beat the model declares. Panel 1 is "confident" — the
   Stack Overflow logo sticker doesn't make Maya suddenly cynical.
   It is BACKGROUND HUMOR, not narrative humor.

2. **Humor only in CHUCKLED or gentle READING states**:
   panels 1, 2, 3, 6 (gentle), 7, 11 (terminal).
   NEVER in 4 (panic), 5 (alone).

3. **Cap easter eggs at 2-3 per panel** — more than that and
   the comic reads like a meme, not a story.

4. **Each easter egg must reward re-reading**, not be visible
   on first scan. Tiny easter eggs of 12-14px monospace are
   fine. HUGE easter eggs break the spell.

5. **Every developer easter egg must be something that
   developers will get AND non-developers will pass over**:
   Stack Overflow logo, "Works on My Machine", "Friday deploy",
   "Try Stack Overflow", "all your base", "0 regrets".

## Readability Discipline Rules

1. **Minimum text size 18px for body, 22-28px for titles**.
2. **Speech bubbles always have stroke and semi-transparent fill**
   so they read against any background.
3. **No text inside dark scene elements smaller than 22px**
   (code is the exception — 16-18px monospace IS the design).
4. **Captions always at least 0.7 panel widths wide**
   so they don't crowd.
5. **Panel widths scale with information density**:
   climax (4, 8) get 1200×900, narrative (5,6,7,9,10) get 1000×700,
   pacing (1, 2, 3, 11) get 800-1000 wide.

## Invariant Preservation Strategy

| Invariant | Mechanism |
|---|---|
| `TypeInvariant` | Each SVG has explicit dimensions + palette + locale |
| `LocaleFixedInvariant` | Stuttering enforcement of locale `[](locale'=locale)` |
| `EmotionalBeatInvariant` | BeatForPanel mapping; reviewer verifies facial expression |
| `ReaderMomentInvariant` | ReaderMomentForPanel; tells where humor can land |
| Readability | Validator + reviewer verify font sizes 18px+ |
| Aesthetic Invariants | Human review |

## Test Obligations

1. **Structural** (mechanical): `validate-panels.sh`
   - 11 panels, correct dimensions, palette present, Maya present
2. **Locale coherence**: `locale` does not change during a read
3. **Humor discipline**: easter egg count ≤ 3 per panel, all 14-22px
4. **Visual (human)**: `human_review` sign-off with checklist
   - All 12 points in v3 checklist + humor at panels 1/2/3/6/7/11
   - Text size ≥ 18px verified on each panel

## Runtime Checks

None — static SVG comic embedded in markdown.

## Why v4 Stands on v3

v3 proved the **mechanical** discipline (state machines, palette,
Aesthetic Invariants declared). v4 adds **narrative** discipline:
humor placed where emotion allows it, readability enforced
through minimum sizes, and locale-aware structure so v4-ru can
inherit without forking.

v4 doesn't replace v3 — v3 stays as the verified aesthetic baseline.
v4 is the "production" comic — the one that ships to a wider
audience with humor and accessibility, where v3 is the rigorous
artifact the methodology uses to test L4 mitigations.