# MathCoding Comic — Storyboard & Panel Descriptions

## Title: "The Math of Trust"
**Subtitle**: How formal methods turn "looks right" into "is right"

---

## ACT 1: VIBE-CODING (Panels 1-4)

### Panel 1 — "Looks Right"
**Setting**: Maya's desk, modern dev environment, multiple monitors
**Composition**: Wide shot, Maya centered, confident posture
**Visual elements**:
- Maya in hoodie, mid-20s, short dark hair
- Laptop open showing a chat-style AI prompt: "Build a confirm dialog"
- AI response streaming code on the right monitor
- Code visible: a React component with useState, onClick handlers
- Confident blue lighting
- A small clock in corner: "Friday 4:47 PM"
**Caption**: "Friday afternoon. Maya needs to ship a payment confirmation dialog."
**Dialogue**: Maya (thinking bubble): "This should work. The tests pass. The code looks right."

### Panel 2 — "Ship It"
**Setting**: Production deployment visualization
**Composition**: Medium shot, abstract — code flowing from Maya's laptop into a glowing server tower
**Visual elements**:
- Code blocks flowing like a river from Maya's machine
- Server tower with green status lights
- Confetti-like green particles (deploy success)
- Clock strikes 5:00 PM
**Caption**: "5:00 PM. Deploy complete. Maya goes home for the weekend."
**Dialogue**: Maya (chat message): "Pushed to prod. See you Monday!"

### Panel 3 — "The Clicks"
**Setting**: User's perspective — split-screen showing multiple users
**Composition**: Three vertical strips showing different users
**Visual elements**:
- Three diverse users clicking "Confirm Purchase" buttons
- Each click creates a green checkmark
- Looks normal — everything green
**Caption**: "Saturday. Sunday. Users click 'Confirm'. Everything looks fine."
**Dialogue**: (none — silent normalcy)

### Panel 4 — "The Bug"
**Setting**: Disaster — production alerts, red lighting
**Composition**: Split panel — top half shows user complaints flooding in, bottom half shows Maya's panicked face
**Visual elements**:
- Top: Phone notifications stacking up: "Charged twice!", "Where's my refund?", "I'm switching banks"
- Red bug-creature (sharp angles, red, imp-like) sitting on a payment flow diagram
- Bottom: Maya on Monday morning, eyes wide, multiple browser tabs open with errors
- Red dominant in this panel — alarm state
- The bug is shown sitting at the intersection of "click event" and "async fetch" — the race condition
**Caption**: "Monday morning. 847 users were double-charged over the weekend."
**Dialogue**: Maya: "How?! The tests passed. The code review was clean. WHERE did this come from?"

---

## ACT 2: DISCOVERY (Panels 5-7)

### Panel 5 — "The Mentor"
**Setting**: A quiet corner of the office, late afternoon
**Composition**: Two-shot — Maya and the Formalist
**Visual elements**:
- The Formalist (older, glasses, cardigan) holding a glowing tablet
- The tablet shows TLA+ code in purple light
- Blue light from tablet illuminates Maya's curious face
- Maya is leaning in, posture changed from defensive to curious
- The bug-creature is visible in the background, small, lurking
**Caption**: "Tuesday. A colleague shows Maya something she hasn't seen before."
**Dialogue**: The Formalist: "You can prove this never happens. Before you ship."

### Panel 6 — "The Pipeline"
**Setting**: Abstract — Maya and the Formalist walking through the state machine diagram
**Composition**: Wide panel, the state machine as a physical landscape
**Visual elements**:
- The 7-stage pipeline rendered as a path through a stylized landscape
- Each stage is a gate/doorway labeled 01-07:
  - 01 Problem (scroll/document)
  - 02 Assumptions (signpost with branches)
  - 03 Formalize (TLA+ crystal)
  - 04 Verify (TLC beam)
  - 05 Refine (bridge)
  - 06 Implement (forge)
  - 07 Trace (golden thread)
- Maya walks the path, the Formalist points ahead
- Color shifts from blue (formal) to green (verified) along the path
**Caption**: "Seven stages. Each one turns assumption into evidence."
**Dialogue**: The Formalist: "Problem → Assumptions → Formalize → Verify → Refine → Implement → Trace. No step is optional."

### Panel 7 — "The Model"
**Setting**: Close-up of Maya's desk, now with two monitors
**Composition**: Medium shot, Maya typing on the left, model visible on the right
**Visual elements**:
- Left monitor: `Model.tla` file with purple syntax highlighting
- Code visible:
  ```
  VARIABLES state, pendingResult
  Open == /\ state = "closed"
         /\ state' = "opening"
  Confirm == /\ state = "open"
            /\ state' = "confirming"
            /\ pendingResult' = "in-flight"
  ```
- Right monitor: a circular state diagram with nodes (closed → opening → open → confirming → closing → closed)
- Maya's face lit by the purple glow, focused
- The bug-creature is invisible here — it's hiding in the model
**Caption**: "Maya writes 47 lines of TLA+. The model is small. The states are clear."
**Dialogue**: Maya (thinking): "If `confirming` is the state, then the user can't click again... right?"

---

## ACT 3: VERIFICATION (Panels 8-9)

### Panel 8 — "TLC Finds It"
**Setting**: Abstract — the verification chamber
**Composition**: Centered on the crystal computer (TLC) emitting a beam through Maya's code
**Visual elements**:
- The Crystal Computer: a large geometric structure, faceted like a quartz crystal, emitting green light
- Green beam scans across a floating representation of Maya's code
- WHERE THE BEAM HITS THE BUG: the red creature is revealed, illuminated, sharp angles visible, eyes wide — caught
- Maya watches from a control panel, hand to mouth
- The Formalist stands calmly beside her
- Small green verification counters floating: "13 states generated, 8 distinct, 0 violations... wait — Invariant violated at state 5"
**Caption**: "TLC checks every reachable state. 13 states. 8 distinct. Then —"
**Dialogue**: TLC (text bubble, monospace): "StateInvariant violated: state can be 'confirming' AND 'closed' simultaneously."

### Panel 9 — "Fix First, Then Code"
**Setting**: Maya's desk, triumphant
**Composition**: Medium shot, Maya pointing at the model
**Visual elements**:
- Maya has updated the model — the bug path is closed (shown as a red line now blocked by a wall)
- The state diagram is clean, all paths green
- Code on the left monitor: the TypeScript implementation, matching the verified model exactly
- The bug-creature is gone — vapor, or trapped in a box
- Clock: "11:47 AM" — same day
- Code review (a small figure reviewing): "Looks correct." with a checkmark
**Caption**: "The fix happens in the model first. Then the code follows the model. Then tests verify the code matches the model."
**Dialogue**: Maya: "If the model is right, and the code matches the model, then the code is right."

---

## ACT 4: BETTER WORLD (Panel 10)

### Panel 10 — "The World, Improved"
**Setting**: Wide panoramic — the entire system
**Composition**: Three-tier composition: users on top, system in middle, Maya below
**Visual elements**:
- TOP: diverse users around the world, smiling, clicking Confirm, green checkmarks, no red
- MIDDLE: the state machine rendered as a constellation in the night sky, each node glowing green and connected by verified paths. The bug-creature nowhere to be seen
- BOTTOM: Maya at her desk, looking up at the sky with satisfaction. The Formalist beside her, tablet dim now. A small team visible in the background — devs working calmly, not firefighting
- A small clock: "Three months later"
- Number floating: "Zero incidents. 12 features shipped. 47 verified packets."
- A subtle visual: the entire codebase glows with a faint blue grid — the verification extends through everything
**Caption**: "Three months later. Zero incidents. Twelve features shipped. Forty-seven verified packets. The team builds calmly. The users trust the system. The code does what it says, because someone proved it."
**Dialogue**: Maya (small, at the bottom): "We don't ship code that 'looks right' anymore. We ship code that's been proven right."

---

## FINAL FRAME (after panel 10)

A simple text panel, no illustration:
> "From vibe-coding to math-coding.
> Every assumption explicit. Every property checked. Every claim backed by evidence.
> This is MathCodingFractal."

---

## Style Notes for Each Panel

| Panel | Dominant Color | Mood | Key Visual |
|-------|----------------|------|------------|
| 1 | Blue (confident) | Calm | Code on screen, Maya relaxed |
| 2 | Green (deploy) | Triumph | Code flowing into server |
| 3 | Green (normalcy) | Peaceful | Users clicking happily |
| 4 | Red (alarm) | Panic | Bug revealed, errors flooding |
| 5 | Blue/purple (curiosity) | Hopeful | Tablet glow, Maya leaning in |
| 6 | Blue-to-green gradient | Educational | Walking through pipeline |
| 7 | Purple (focus) | Concentrated | Code and state diagram |
| 8 | Green beam + red bug | Revelation | Crystal computer scanning |
| 9 | Green (success) | Triumphant | Clean code, bug gone |
| 10 | Balanced blue/green | Peaceful | Constellation, calm team |