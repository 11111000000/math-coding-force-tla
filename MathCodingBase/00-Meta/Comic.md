# The Math of Trust

*A comic about turning "looks right" into "is right"*

Version 2 — verified packet at `artifacts/comic-v2/`. Adds panel 05 ("Alone", the frustrated beat) and panel 11 ("The Stamp", the terminus). Replaces the v1 "Pipeline" panel with a dedicated methodology-moment in 06. Panel sizes vary: 600×400 breathers, 800×600 narrative, 1000×800 climaxes.

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

The palette shifts with the reader's state (tracked in `artifacts/comic-v2/Model.tla`). When Maya is reading, code is blue. When the bug appears, the screen goes red. When TLC catches the bug, everything goes green.

**Maya** is a simple icon — body 40×80, head r=15, no facial details. McCloud's iconographic principle: reduce the protagonist so the reader can fill in the details and project themselves. Detail distracts from the idea.

**The recurring motif** is the state machine rendered as a constellation. It appears faint in panel 06 (the introduction), active with a flashing red bug-node in panel 08 (TLC finding it), and stretched across the night sky in panel 10 (the methodology at scale).

---

## The Story

### Act 1 — Vibe Coding

#### Panel 01 — "Looks Right"

*[Maya at her desk facing a laptop with TypeScript code. Friday sun through a window. Confident posture.]*

![Panel 01 — Looks Right](../assets/comic-panels/01-looks-right.svg)

> Friday afternoon. Maya needs to ship a payment confirmation dialog.
>
> *Maya: "This should work. The tests pass. The code looks right."*

#### Panel 02 — "Ship It"

*[Code flowing from Maya's laptop into a glowing green server. Small confetti. Clock at 5:00 PM. Smaller 600×400 breather.]*

![Panel 02 — Ship It](../assets/comic-panels/02-ship-it.svg)

> 5:00 PM. Deploy complete. Maya goes home for the weekend.
>
> *Maya: "Pushed to prod. See you Monday!"*

#### Panel 03 — "The Clicks"

*[Three vertical strips showing three different users on phones clicking Confirm. Green checkmarks everywhere. Maya absent. Smaller 600×400 breather.]*

![Panel 03 — The Clicks](../assets/comic-panels/03-the-clicks.svg)

> Saturday. Sunday. Users click 'Confirm'. Everything looks fine.
>
> 847 clicks. 847 confirmations. 847 happy users.

#### Panel 04 — "The Bug"

*[The climax. 1000×800 viewport. Top half: red phone notifications flooding. Bottom half: Maya's icon scaled LARGE, panicked, multiple browser tabs around her. The bug-creature sits visibly at the intersection of "click event" and "async fetch" with explicit labels — the race condition.]*

![Panel 04 — The Bug](../assets/comic-panels/04-the-bug.svg)

> Monday morning. 847 users were double-charged over the weekend.
>
> *Maya: "How?! The tests passed. The code review was clean. WHERE did this come from?"*

---

### Act 2 — Discovery

#### Panel 05 — "Alone"

*[**NEW in v2**. Transitional panel. Maya at her desk, lights off except one small lamp. The screen emits a red glow. Empty chair beside her — where the Formalist will eventually sit. The bug-creature is small, in the screen's corner, watching. Minimal text. Lonely composition.]*

![Panel 05 — Alone](../assets/comic-panels/05-alone.svg)

> Tuesday morning. Maya has been staring at the code for three hours.
>
> The tests pass. The logic looks correct. The bug persists.
>
> *Maya: "Something is wrong. I just can't see it."*

The frustrated state gets a beat. v1 jumped from "the bug" straight to "the mentor"; v2 gives the reader a moment to feel the weight of being alone with a failure that tests can't see.

#### Panel 06 — "The Mentor"

*[Two-shot. The Formalist (taller icon, glasses) on the LEFT holding a glowing tablet. Maya on the RIGHT, leaning forward, the purple light catching her. Background shows faint constellation lines — first foreshadowing of the state machine. The Formalist has a speech bubble.]*

![Panel 06 — The Mentor](../assets/comic-panels/06-the-mentor.svg)

> Wednesday. The Formalist drops by her desk.
>
> *The Formalist: "You can prove this never happens. Before you ship."*

#### Panel 07 — "The Model"

*[Maya's desk, two monitors. LEFT: TLA+ code with purple syntax highlighting. RIGHT: a state diagram with circular green nodes connected by lines. Maya's icon lit by both purples. The bug is invisible — hiding in the model.]*

![Panel 07 — The Model](../assets/comic-panels/07-the-model.svg)

> Thursday. Maya writes 47 lines of TLA+. The model is small. The states are clear.
>
> *Maya: "If state is 'confirming', the user can't click again... right?"*

---

### Act 3 — Verification

#### Panel 08 — "TLC Finds It"

*[The climax. 1000×800 viewport. TLC Crystal Computer at CENTER — large faceted green octagon. Green beam scanning from TLC toward Maya's code. WHERE THE BEAM HITS THE BUG — the red creature is REVEALED in green spotlight, illuminated, caught. Maya watches from a small control panel in the lower-left, hand raised. The Formalist stands calmly beside her. The constellation ACTIVE in the background — one bug-flashing red node. Title at top. Big green label: "StateInvariant violated".]*

![Panel 08 — TLC Finds It](../assets/comic-panels/08-tlc-finds-it.svg)

> Friday. TLC checks every reachable state. 14 generated, 12 distinct. Then —
>
> *TLC: "StateInvariant violated: state can be 'confirming' AND 'closed' simultaneously."*

This is the comic's thesis statement. The bug was always there. The model makes it visible. The model checker makes it undeniable.

#### Panel 09 — "Fix First, Then Code"

*[Maya triumphant, pointing at a now-clean state diagram. All paths green. The bug-creature trapped in a small box labeled "FIXED IN MODEL" in red. TypeScript code on the LEFT matches the verified model exactly. Small green checkmark with "verdict: VERIFIED".]*

![Panel 09 — Fix First, Then Code](../assets/comic-panels/09-fix-first.svg)

> The fix happens in the model first. Then the code follows the model. Then tests verify the code matches the model.
>
> *Maya: "If the model is right, and the code matches the model, then the code is right."*

---

### Act 4 — Better World

#### Panel 10 — "The World, Improved"

*[Wide panoramic. TOP: diverse users as small icons, smiling, clicking confirm, green checkmarks everywhere. MIDDLE: state machine as constellation stretched across the "night sky" of the panel — many nodes, all green, all connected. BOTTOM: Maya at her desk looking up at the sky with satisfaction. The Formalist beside her, tablet dim now. Small team visible in background.]*

![Panel 10 — Better World](../assets/comic-panels/10-better-world.svg)

> Three months later. Zero incidents. Twelve features shipped. Forty-seven verified packets.
>
> The team builds calmly. The users trust the system. The code does what it says.

#### Panel 11 — "The Stamp"

*[**NEW in v2**. Terminal panel. 600×400, deliberately small. Center: large rectangular "VERIFIED" stamp, rotated -8 degrees, fill green, thick stroke border, monospace text "VERIFIED" inside in 60px. Background: faint repeating pattern of the state machine constellation as small icons — a meta-texture where the methodology is now everywhere. Maya's small icon in the bottom-right corner, looking at the stamp. No dialogue.]*

![Panel 11 — The Stamp](../assets/comic-panels/11-the-stamp.svg)

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

The verified packet lives at `artifacts/comic-v2/`:

- `problem.md` — seven acceptance criteria
- `assumptions.yaml` — ten explicit assumptions (status-tagged)
- `Model.tla` — 7 reader states, 11 panel transitions, `NextStateForPanel` mapping
- `verification.json` — SANY PASS, TLC NO_ERRORS, 14 generated / 12 distinct
- `refinement.md` — panel-to-state mapping table
- `traceability.json` — 28 mappings across panel / invariant / palette / motif / dimension / character
- `implementation/` — 11 SVG panels + `validate-panels.sh`

The workflow copies `artifacts/comic-v2/implementation/*.svg` into `MathCodingBase/assets/comic-panels/` before the mkdocs build. The Comic.md images resolve from there.