# The Math of Trust

*A comic about turning "looks right" into "is right"*

Version 4 — verified packet at `artifacts/comic-v4-en/`. Adds IT humor (Stack Overflow sticker, "0 regrets", "all your tests are belong to us") and readability improvements (bigger panels: 800-1200 wide vs 600-1000, larger text, stronger contrast). The methodology gains **Humor Discipline Rules** and **Readability Constraints** sections in `refinement.md`.

> **Looking for the Russian edition?** [`Comic.ru.md`](Comic.ru.md) — same model, same layout, Russian text labels.
> **Looking for an earlier version?**
> - [`Comic_v1.md`](Comic_v1.md) — original 10-panel narrative
> - v2 in `artifacts/comic-v2/` — verified state machine model, 11 panels, but visually regressed
> - v3 in `artifacts/comic-v3/` — restored visual quality, 11 panels, methodology baseline

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

**Subtle IT humor** lives as layer-2 easter eggs — visible on re-read, not on first scan. Stack Overflow sticker, "works on my machine", `0 regrets`, "all your tests are belong to us".

**The recurring motif** is the state machine rendered as a constellation. Faint in panel 06, active with a flashing red bug-node in panel 08, stretched across the sky in panel 10.

---

## The Story

### Act 1 — Vibe Coding

#### Panel 01 — "Looks Right"

*[Maya at her desk facing a laptop with TypeScript code. Friday sun through a window. Confident posture — hand on keyboard, slight smile. Coffee cup. City silhouette outside. Stack Overflow `[SO]` sticker on the laptop bezel.]*

![Panel 01](../assets/comic-panels/v4/01-looks-right.svg)

> Friday afternoon. 4:47 PM. Maya is about to ship a payment confirmation dialog.
>
> *Maya: "It compiles. Tests pass. Ship it."*

#### Panel 02 — "Ship It"

*[Maya raises both hands — one pointing at the laptop, the other with a coffee mug — in a deploy cheer. Code flowing into a glowing green server. Confetti-like green dots (with 2-3 red `x` hidden). Clock shows 5:00 PM.]*

![Panel 02](../assets/comic-panels/v4/02-ship-it.svg)

> 5:00 PM. Deploy complete. Maya goes home for the weekend.
>
> *Maya: "Pushed to prod. See you Monday!"*

#### Panel 03 — "The Clicks"

*[Three vertical strips — three different users on phones clicking Confirm. Diverse faces. Big green checkmarks everywhere. Maya absent. One strip shows `// on MY machine` in tiny text.]*

![Panel 03](../assets/comic-panels/v4/03-the-clicks.svg)

> Saturday. Sunday. Users click 'Confirm'. Everything looks fine.
>
> 847 clicks. 847 confirmations. 847 happy users.

#### Panel 04 — "The Bug" (climax, 1200×900)

*[Top half: red phone notifications flooding. Bottom half: Maya's panicked face — eyes wide, mouth open, eyebrows raised, hands to temples — with multiple browser tabs around her. The bug-creature sits at the intersection labeled "click event" and "async fetch" — the race condition.]*

![Panel 04](../assets/comic-panels/v4/04-the-bug.svg)

> Monday morning. 847 users were double-charged over the weekend.
>
> *Maya: "How?! The tests passed. The code review was clean. WHERE did this come from?"*

---

### Act 2 — Discovery

#### Panel 05 — "Alone"

*[Maya at her desk, lights off except one small amber lamp. Screen emits a red glow. Empty chair beside her — for the Formalist. Bug-creature in the screen's corner. Maya's head down, slumped.]*

![Panel 05](../assets/comic-panels/v4/05-alone.svg)

> Tuesday morning. Three hours of staring at the code.
>
> *Maya: "Something is wrong. I just can't see it."*

#### Panel 06 — "The Mentor"

*[The Formalist on the LEFT — taller, glasses, holding a glowing tablet showing TLA+ code. Maya on the RIGHT, leaning forward, the purple light catching her face. Background shows faint constellation lines. `♥ TLA+` icon on the tablet.]*

![Panel 06](../assets/comic-panels/v4/06-the-mentor.svg)

> Wednesday. The Formalist drops by her desk.
>
> *The Formalist: "You can prove this never happens. Before you ship."*

#### Panel 07 — "The Model"

*[Two monitors. LEFT: TLA+ code with comments `// please work, please work` and `// last resort: // try Stack Overflow`. RIGHT: state diagram with green nodes. Maya in profile.]*

![Panel 07](../assets/comic-panels/v4/07-the-model.svg)

> Thursday. 47 lines of TLA+. The states are clear. The bug is invisible.
>
> *Maya: "If state is 'confirming', the user can't click again... right?"*

---

### Act 3 — Verification

#### Panel 08 — "TLC Finds It" (climax, 1200×900)

*[TLC Crystal Computer at CENTER — large faceted green octagon. Green beam scanning toward the bug. The bug caught in green spotlight. Maya watches from lower-left corner, hand raised to her mouth in surprise. The constellation ACTIVE in background with a red bug-node flashing. TLC stats: `14 generated, 12 distinct, 0 regrets`. Big green label: "StateInvariant violated".]*

![Panel 08](../assets/comic-panels/v4/08-tlc-finds-it.svg)

> Friday. 14 generated. 12 distinct. One bug. The model was right.
>
> *TLC: "StateInvariant violated: state can be 'confirming' AND 'closed' simultaneously."*

This is the comic's thesis statement. The bug was always there. The model makes it visible. The model checker makes it undeniable.

#### Panel 09 — "Fix First, Then Code"

*[Maya points at the now-clean state diagram. All paths green. The bug-creature trapped in a small box labeled "FIXED IN MODEL" in red. TypeScript code on the LEFT monitor matches the verified model exactly. Small green checkmark "VERIFIED".]*

![Panel 09](../assets/comic-panels/v4/09-fix-first.svg)

> The fix happens in the model first. Then the code follows the model. Then tests verify the code matches the model.
>
> *Maya: "If the model is right, and the code matches the model, then the code is right."*

---

### Act 4 — Better World

#### Panel 10 — "Better World"

*[Wide panoramic. TOP: five diverse users, smiling, clicking confirm. MIDDLE: state machine as constellation stretched across the sky — many nodes, all green. BOTTOM: Maya at her desk looking up. The Formalist beside her, tablet dim. Italic note: "// yes, really". Stats: 3 months. 0 incidents. 12 features. 47 packets.]*

![Panel 10](../assets/comic-panels/v4/10-better-world.svg)

> Three months later. Zero incidents. Twelve features shipped. Forty-seven verified packets.

#### Panel 11 — "The Stamp"

*[800×600, deliberately small. Center: large rectangular "VERIFIED" stamp, rotated -8 degrees, fill green, thick stroke, monospace text "VERIFIED" 100px. Background: faint repeating pattern of state machine constellation. Maya's small icon in the bottom-right corner, looking at the stamp. Tiny text inside: `// all your tests // are belong to us`.]*

![Panel 11](../assets/comic-panels/v4/11-the-stamp.svg)

> Title at top: "The math of trust."

The terminus. From vibe-coding to math-coding, in 11 panels.

---

## The Moral

**From vibe-coding to math-coding.**

Every assumption explicit. Every property checked. Every claim backed by evidence.

This is **MathCoding**.

---

## Why This Matters

Production systems fail every day from race conditions that "look right" but aren't. The gap between **looks right** and **is right** is exactly what formal verification closes.

If the model is right, and the code matches the model, then the code is right.

That's the math of trust.

---

## Provenance

Verified packets live at:

- `artifacts/comic-v4-en/` — English edition
- `artifacts/comic-v4-ru/` — Russian edition (`Comic.ru.md`)

Both share the same TLA+ model. `locale` determines which panel set renders.

Earlier versions remain available:

- v1: `assets/comic-panels/v1/`, narrative at `Comic_v1.md`
- v2: `assets/comic-panels/v2/`, packet at `artifacts/comic-v2/` (regressed visuals)
- v3: `assets/comic-panels/v3/`, packet at `artifacts/comic-v3/` (restored visuals, methodology baseline)

The workflow copies panels into `MathCodingBase/assets/comic-panels/v{1,2,3,4}/` before mkdocs build.