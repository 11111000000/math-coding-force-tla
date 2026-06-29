# The Math of Trust — Version 1

*A comic about turning "looks right" into "is right"*

> **This is version 1.** Version 2 lives at [`Comic.md`](Comic.md) — it
> adds a transitional panel between disaster and mentor, a terminal
> VERIFIED stamp, and a verified reader-state model. Version 1 is kept
> here because the original character work, palette, and panel
> compositions have their own merit and are part of the project's
> provenance.

---

## Visual Style

This comic follows the **MathCoding aesthetic**: dark backgrounds, monospace typography, geometric vector art, and a color palette where blue represents formal models, green represents verification, amber represents human moments, and red represents bugs.

The state machine is the recurring visual motif — it appears as code on screens, as a circuit board characters walk on, and as a constellation in the night sky.

---

## The Story

### Act 1 — Vibe Coding

#### Panel 01 — "Looks Right"

*[Illustration: Maya at her desk, laptop showing AI-generated code, confident posture, Friday afternoon sun]*

![Panel 01 — Looks Right](../assets/comic-panels/v1/01-looks-right.svg)

> Friday afternoon. Maya needs to ship a payment confirmation dialog.
>
> *Maya: "This should work. The tests pass. The code looks right."*

#### Panel 02 — "Ship It"

*[Illustration: Code flowing from Maya's laptop into a glowing green server, confetti particles, clock at 5:00 PM]*

![Panel 02 — Ship It](../assets/comic-panels/v1/02-ship-it.svg)

> 5:00 PM. Deploy complete. Maya goes home for the weekend.
>
> *Maya: "Pushed to prod. See you Monday!"*

#### Panel 03 — "The Clicks"

*[Illustration: Three users in vertical strips, each clicking "Confirm" on their phones, green checkmarks everywhere]*

![Panel 03 — The Clicks](../assets/comic-panels/v1/03-the-clicks.svg)

> Saturday. Sunday. Users click 'Confirm'. Everything looks fine.
>
> 847 clicks. 847 confirmations. 847 happy users.

#### Panel 04 — "The Bug"

*[Illustration: Top half flooded with red phone notifications ("Charged twice!", "Where's my refund?"). Bottom half shows Maya's panicked face with multiple browser tabs open. The bug-creature sits at the intersection of "click event" and "async fetch" — the race condition.]*

![Panel 04 — The Bug](../assets/comic-panels/v1/04-the-bug.svg)

> Monday morning. 847 users were double-charged over the weekend.
>
> *Maya: "How?! The tests passed. The code review was clean. WHERE did this come from?"*

---

### Act 2 — Discovery

#### Panel 05 — "The Mentor"

*[Illustration: Two-shot. The Formalist (older, glasses, cardigan) holds a glowing tablet showing TLA+ code. Maya leans in, curious. Blue light from tablet illuminates her face. The bug-creature lurks in the background, small.]*

![Panel 05 — The Mentor](../assets/comic-panels/v1/05-the-mentor.svg)

> Tuesday. A colleague shows Maya something she hasn't seen before.
>
> *The Formalist: "You can prove this never happens. Before you ship."*

#### Panel 06 — "The Pipeline"

*[Illustration: The 7-stage pipeline rendered as a physical path through a stylized landscape. Maya walks the path with the Formalist pointing ahead. Color shifts from blue (formal) to green (verified) along the path.]*

![Panel 06 — The Pipeline](../assets/comic-panels/v1/06-the-pipeline.svg)

> Seven stages. Each one turns assumption into evidence.
>
> *The Formalist: "Problem → Assumptions → Formalize → Verify → Refine → Implement → Trace. No step is optional."*

#### Panel 07 — "The Model"

*[Illustration: Maya's desk, two monitors. Left: TLA+ code with purple syntax highlighting. Right: state diagram with circular nodes. Maya's face lit by the purple glow, focused. The bug is invisible — hiding in the model.]*

![Panel 07 — The Model](../assets/comic-panels/v1/07-the-model.svg)

> Maya writes 47 lines of TLA+. The model is small. The states are clear.
>
> *Maya: "If 'confirming' is the state, then the user can't click again... right?"*

---

### Act 3 — Verification

#### Panel 08 — "TLC Finds It"

*[Illustration: The Crystal Computer (TLC) at center, faceted and glowing green. Green beam scans Maya's code. Where the beam hits the bug — the red creature is revealed, illuminated, caught. Maya watches from a control panel, hand to mouth. The Formalist stands calmly beside her.]*

![Panel 08 — TLC Finds It](../assets/comic-panels/v1/08-tlc-finds-it.svg)

> TLC checks every reachable state. 13 states. 8 distinct. Then —
>
> *TLC: "StateInvariant violated: state can be 'confirming' AND 'closed' simultaneously."*

#### Panel 09 — "Fix First, Then Code"

*[Illustration: Maya triumphant, pointing at the now-clean state diagram with all paths green. The bug path is now BLOCKED with a red wall. The TypeScript code on the left matches the verified model exactly. The bug is trapped in a small box labeled "FIXED IN MODEL". Code review checkmark.]*

![Panel 09 — Fix First, Then Code](../assets/comic-panels/v1/09-fix-first.svg)

> The fix happens in the model first. Then the code follows the model. Then tests verify the code matches the model.
>
> *Maya: "If the model is right, and the code matches the model, then the code is right."*

---

### Act 4 — Better World

#### Panel 10 — "The World, Improved"

*[Illustration: Wide panoramic. Top: diverse users around the world, smiling, clicking Confirm, green checkmarks, no red. Middle: the state machine rendered as a constellation in the night sky, each node glowing green and connected by verified paths. The bug-creature nowhere to be seen. Bottom: Maya at her desk, looking up at the sky with satisfaction. The Formalist beside her, tablet dim now. A small team visible in the background — devs working calmly, not firefighting.]*

![Panel 10 — Better World](../assets/comic-panels/v1/10-better-world.svg)

> Three months later. Zero incidents. Twelve features shipped. Forty-seven verified packets.
>
> The team builds calmly. The users trust the system. The code does what it says.

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

## Source Files

The v1 comic SVG files live in `comic/panels/` in the repository root. The build workflow copies them to `MathCodingBase/assets/comic-panels/v1/` before the mkdocs build so the Comic_v1.md images resolve correctly.

For panel-by-panel detailed descriptions (storyboard), see `comic/STORYBOARD.md`. For visual style rationale, see `comic/STYLE.md`.

---

## What v2 Adds

Version 2 keeps the same narrative but addresses three things:

1. **Adds panel 05 "Alone"** — a transitional moment between disaster and mentor, so the reader sits with the failure.
2. **Adds panel 11 "The Stamp"** — a terminal VERIFIED stamp as the comic's closing image.
3. **Replaces panel 06 "The Pipeline"** with "The Mentor" + "The Model" structure, removing the abstract pipeline shot in favor of the two protagonist panels.

The character design in v2 was simplified to icons — that simplification was a methodology failure documented in the v3 plan. v1's character work is preserved here.