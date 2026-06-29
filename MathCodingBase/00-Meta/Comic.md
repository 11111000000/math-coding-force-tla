# The Math of Trust

*A comic about turning "looks right" into "is right"*

Version 3 — verified packet at `artifacts/comic-v3/`. v3 reintroduces character expression (Maya's face, posture, hand position) and meaningful background (window light, lamp, monitor glow) that v2 simplified into headless icons. The visual regression was diagnosed in `artifacts/comic-v2-regression-analysis/`; the fix is the new **Aesthetic Invariants** section in v3's `refinement.md`, which the named reviewer signs in `verification.json#human_review`.

> **Looking for an earlier version?**
> - [`Comic_v1.md`](Comic_v1.md) — original 10-panel narrative with detailed character work
> - v2 packet at `artifacts/comic-v2/` — verified state machine model, 11 panels, but visually regressed; kept as the model artifact

---

## Visual Style

This comic follows the **MathCoding aesthetic**: dark backgrounds (`#0d1117`), monospace typography, geometric vector art, and a palette that works as a narrative device.

| Color | Hex | Role |
|---|---|---|
| Background | `#0d1117` | Every panel — the "screen-off" baseline |
| Blue | `#3b82f6` | Formal models, code, calm reading |
| Purple | `#a855f7` | Methodology introduced, TLA+ syntax |
| Green | `#22c55e` | Verification succeeded, VERIFIED stamps, users happy |
| Red | `#ef4444` | Bug present, alarm, frustration |
| Amber | `#f59e0b` | Human moments — dialogue, Friday sun, coffee |

The palette shifts with the reader's state. Maya carries the comic's emotional weight — her face (eyes, mouth, eyebrows) reads the beat of each panel.

**The recurring motif** is the state machine rendered as a constellation. It appears faint in panel 06 (the introduction), active with a flashing red bug-node in panel 08 (TLC finding it), and stretched across the night sky in panel 10 (the methodology at scale).

---

## The Story

### Act 1 — Vibe Coding

#### Panel 01 — "Looks Right"

*[Maya at her desk facing a laptop with TypeScript code. Friday sun through a window. Confident posture — hand on keyboard, slight smile. Coffee cup on the desk. City silhouette visible outside.]*

![Panel 01 — Looks Right](../assets/comic-panels/v3/01-looks-right.svg)

> Friday afternoon. 4:47 PM. Maya needs to ship a payment confirmation dialog.
>
> *Maya: "This should work. The tests pass. The code looks right."*

#### Panel 02 — "Ship It"

*[Maya raises both hands — one pointing at the laptop, the other with a coffee mug — in a deploy cheer. Code flowing from her laptop into a glowing green server tower. Confetti-like green dots. Clock shows 5:00 PM.]*

![Panel 02 — Ship It](../assets/comic-panels/v3/02-ship-it.svg)

> 5:00 PM. Deploy complete. Maya goes home for the weekend.
>
> *Maya: "Pushed to prod. See you Monday!"*

#### Panel 03 — "The Clicks"

*[Three vertical strips showing three different users on phones clicking Confirm. Diverse faces — different hair, skin tone, age hints. Big green checkmarks everywhere. Maya absent.]*

![Panel 03 — The Clicks](../assets/comic-panels/v3/03-the-clicks.svg)

> Saturday. Sunday. Users click 'Confirm'. Everything looks fine.
>
> 847 clicks. 847 confirmations. 847 happy users.

#### Panel 04 — "The Bug"

*[The climax. 1000×800 viewport. Top half: red phone notifications flooding. Bottom half: Maya's panicked face — eyes wide, mouth open, eyebrows raised, hands to temples — with multiple browser tabs around her. The bug-creature sits visibly at the intersection of "click event" and "async fetch".]*

![Panel 04 — The Bug](../assets/comic-panels/v3/04-the-bug.svg)

> Monday morning. 847 users were double-charged over the weekend.
>
> *Maya: "How?! The tests passed. The code review was clean. WHERE did this come from?"*

---

### Act 2 — Discovery

#### Panel 05 — "Alone"

*[**NEW in v2**. Maya at her desk, lights off except one small amber lamp. Screen emits a red glow — same code as panel 1, but now the panic is exhaustion. Empty chair where the Formalist will eventually sit. Bug-creature small in the screen's corner. Maya's head down, slumped.]*

![Panel 05 — Alone](../assets/comic-panels/v3/05-alone.svg)

> Tuesday morning. Three hours of staring at the code.
>
> The tests pass. The logic looks correct. The bug persists.
>
> *Maya: "Something is wrong. I just can't see it."*

The frustrated state gets a beat. The reader sits with Maya in the failure.

#### Panel 06 — "The Mentor"

*[Two-shot. The Formalist on the LEFT, taller, glasses, holding a glowing tablet showing TLA+ code (purple text on dark). Maya on the RIGHT, leaning forward, the purple light catching her face. Background shows faint constellation lines — first foreshadowing of the state machine. Bug-creature in background, small, dim.]*

![Panel 06 — The Mentor](../assets/comic-panels/v3/06-the-mentor.svg)

> Wednesday. The Formalist drops by her desk.
>
> *The Formalist: "You can prove this never happens. Before you ship."*

#### Panel 07 — "The Model"

*[Maya at her desk, two monitors. LEFT: TLA+ code with purple syntax highlighting. RIGHT: clean state diagram with circular green nodes connected by lines. Maya in profile, focused, hands on keyboard. Purple wash from the monitors.]*

![Panel 07 — The Model](../assets/comic-panels/v3/07-the-model.svg)

> Thursday. 47 lines of TLA+. The model is small. The states are clear.
>
> *Maya: "If state is 'confirming', the user can't click again... right?"*

---

### Act 3 — Verification

#### Panel 08 — "TLC Finds It"

*[The climax. 1000×800 viewport. TLC Crystal Computer at CENTER — large faceted green octagon. Green beam scanning from TLC toward the bug. WHERE THE BEAM HITS THE BUG — the red creature is REVEALED in green spotlight. Maya watches from the lower-left corner, hand raised to her mouth in surprise. The Formalist stands calmly beside her. The constellation ACTIVE in the background — one red bug-node flashing. Big green label: "StateInvariant violated".]*

![Panel 08 — TLC Finds It](../assets/comic-panels/v3/08-tlc-finds-it.svg)

> Friday. 14 generated. 12 distinct. Then —
>
> *TLC: "StateInvariant violated: state can be 'confirming' AND 'closed' simultaneously."*

This is the comic's thesis statement. The bug was always there. The model makes it visible. The model checker makes it undeniable.

#### Panel 09 — "Fix First, Then Code"

*[Maya points at the now-clean state diagram. All paths green. The bug-creature trapped in a small box labeled "FIXED IN MODEL" in red. TypeScript code on the LEFT monitor matches the verified model exactly. Small green checkmark "verdict: VERIFIED".]*

![Panel 09 — Fix First, Then Code](../assets/comic-panels/v3/09-fix-first.svg)

> The fix happens in the model first. Then the code follows the model. Then tests verify the code matches the model.
>
> *Maya: "If the model is right, and the code matches the model, then the code is right."*

---

### Act 4 — Better World

#### Panel 10 — "The World, Improved"

*[Wide panoramic. TOP: five diverse users as small icons, smiling, clicking confirm, green checkmarks everywhere. MIDDLE: state machine as constellation stretched across the "night sky" of the panel — many nodes, all green, all connected. BOTTOM: Maya at her desk looking up at the sky with satisfaction. The Formalist beside her, tablet dim. "3 months. Zero incidents."]*

![Panel 10 — Better World](../assets/comic-panels/v3/10-better-world.svg)

> Three months later. Zero incidents. Twelve features shipped. Forty-seven verified packets.
>
> The team builds calmly. The users trust the system. The code does what it says.

#### Panel 11 — "The Stamp"

*[NEW in v2. Terminal panel. 600×400, deliberately small. Center: large rectangular "VERIFIED" stamp, rotated -8 degrees, fill green, thick stroke border, monospace text "VERIFIED" inside in 80px. Background: faint repeating pattern of the state machine constellation as small icons — a meta-texture where the methodology is now everywhere. Maya's small icon in the bottom-right corner, looking at the stamp.]*

![Panel 11 — The Stamp](../assets/comic-panels/v3/11-the-stamp.svg)

> Title at top: "The math of trust."

The terminus. The methodology is internalized. From vibe-coding to math-coding, in 11 panels.

---

## The Moral

**From vibe-coding to math-coding.**

Every assumption explicit. Every property checked. Every claim backed by evidence.

This is **MathCoding**.

---

## Why This Matters

The story isn't hypothetical. Production systems fail every day from race conditions that "look right" but aren't. The gap between **looks right** and **is right** is exactly what formal verification closes.

When you write `Confirm == /\ state = "open" /\ state' = "confirming"` in TLA+, you're not writing code. You're writing a **mathematical contract**. And when TLC verifies that contract, it's not running tests — it's proving a theorem.

If the model is right, and the code matches the model, then the code is right.

That's the math of trust.

---

## Provenance

The verified packet lives at `artifacts/comic-v3/`:

- `problem.md` — what v3 fixes from v2
- `assumptions.yaml` — nine explicit assumptions including Aesthetic Invariants
- `Model.tla` — 7 reader states, 11 panel transitions, `BeatForPanel` mapping, `EmotionalBeatInvariant`
- `verification.json` — model VERIFIED, plus `human_review` block with named reviewer and 11-panel checklist
- `refinement.md` — 11-panel operation mapping + **Aesthetic Invariants** section (emotional beat, character focus, background role, continuity)
- `traceability.json` — 21 mappings across panel / invariant / palette / aesthetic-invariant / preservation / continuity
- `implementation/` — 11 SVG panels + `validate-panels.sh`

The workflow copies `artifacts/comic-v3/implementation/*.svg` into
`MathCodingBase/assets/comic-panels/v3/` before the mkdocs build.
Earlier versions remain available: v1 at `assets/comic-panels/v1/`,
v2 at `assets/comic-panels/v2/`.