# Problem: Comic v2 — "The Math of Trust"

## Task

Improve the existing comic (`MathCodingBase/00-Meta/Comic.md` with 10 SVG panels)
so it transmits the core idea — **"looks right" ≠ "is right", and formal verification
closes the gap** — to a developer audience in under 2 minutes of reading.

## Desired Outcome

A reader who has never heard of TLA+ or MathCoding must be able to
state, after reading the comic:

1. **What went wrong**: the bug was a race condition between a click event
   and an async fetch, hidden by tests that only checked the happy path.
2. **Why it mattered**: production shipped code that "looked right" but
   wasn't — 847 users double-charged over a weekend.
3. **What the fix was**: write a formal model (TLA+), run a model checker
   (TLC) that exhaustively checks every reachable state, find the bug
   in the model, then write code that matches the verified model.
4. **Why it works**: if the model is right, and the code matches the model,
   then the code is right. Math becomes the proof.

The transfer must survive being paraphrased by the reader 30 seconds
after reading. If they remember only one sentence, that sentence must
contain the word "proof" or "verified".

## Concrete Problems in v1

| Problem | Impact |
|---------|--------|
| All 10 panels are the same size | Flat rhythm, no visual emphasis on key moments (the bug reveal, the verification) |
| Maya has detailed face, hair, clothing | Detail distracts from the idea; McCloud's iconographic principle violated |
| Panel 4 → Panel 5 jump is too abrupt | Reader loses narrative continuity between "disaster" and "discovery" |
| No visual hierarchy | All elements have equal weight; the eye doesn't know where to land |
| Color palette is documented but unused as narrative | Colors don't shift to reflect reader's emotional state |
| The "state machine constellation" only appears once | The recurring motif should anchor the reader's understanding |
| Maya looks the same in every panel | No visible transformation of the protagonist |

## Acceptance Criteria

- Comic has 11 panels (added transitional "alone, frustrated" panel)
- Reader-state model has 6 states with explicit transitions
- Each panel visually maps to a reader state with documented trace
- Panel sizes vary: small for context, large for climax (panel 5: Bug, panel 9: TLC Finds It)
- Maya is a simple icon (no facial detail), consistent across panels
- Color palette works as narrative device (shifts with state)
- Verified by 3rd-party readers (target: 4/5 can paraphrase the core idea)