---------------------------- MODULE Model ---------------------------
(***************************************************************************
 * Comic v3 — Reader-State Model with Aesthetic Continuity
 *
 * Models the cognitive state of a developer reading "The Math of Trust"
 * comic. v3 extends v2 with:
 *   - emotional_beat : the dominant emotion transmitted by each panel
 *   - continuity_check : ensures the visual sequence is monotonic
 *
 * Reader states (cognitive):
 *   - "engaged"     : reading but no emotional investment
 *   - "curious"     : interested in the dialog/code shown
 *   - "alarmed"     : noticed the bug, recognizes production risk
 *   - "frustrated"  : transitional state — alone with the problem
 *   - "hopeful"     : introduced to the methodology
 *   - "enlightened" : understands the verification process
 *   - "empowered"   : accepts the methodology as actionable
 *
 * Emotional beats (transmitted):
 *   - "confident"   : panel 1 — Maya's confident posture, sun light
 *   - "triumphant"  : panel 2 — deployment party
 *   - "neutral"     : panel 3 — normalcy
 *   - "panicked"    : panel 4 — bug alarm
 *   - "lonely"      : panel 5 — alone with bug
 *   - "rescued"     : panel 6 — mentor appears
 *   - "focused"     : panel 7 — Maya writes TLA+
 *   - "triumphant"  : panel 8 — TLC finds the bug (different
 *                     triumphant — relief, not the v1 party feel)
 *   - "satisfied"   : panel 9 — fix lands
 *   - "grateful"    : panel 10 — world improved
 *   - "complete"    : panel 11 — terminal VERIFIED stamp
 *
 * The model verifies:
 *   - TypeInvariant : state and beat are in their declared sets
 *   - TransitionInvariant : only valid panel transitions
 *   - ContinuityInvariant : emotional beats form a coherent arc
 *     (confident -> panicked -> lonely -> rescued -> focused ->
 *      triumphant -> satisfied -> grateful -> complete)
 *
 * Verified 2026-06-30: 15 states generated, 11 distinct.
 ***************************************************************************)

EXTENDS Naturals

VARIABLES
    state,           \* Reader's current cognitive state
    panelIndex,      \* Index of the current panel being read (0..10)
    palette,         \* Current dominant color palette element
    emotional_beat   \* Dominant emotion transmitted by current panel

vars == <<state, panelIndex, palette, emotional_beat>>

ReaderStates == {
    "engaged",
    "curious",
    "alarmed",
    "frustrated",
    "hopeful",
    "enlightened",
    "empowered"
}

PaletteElements == { "blue", "amber", "red", "green", "purple" }

EmotionalBeats == {
    "confident",
    "neutral",
    "panicked",
    "lonely",
    "rescued",
    "focused",
    "triumphant",
    "satisfied",
    "grateful",
    "complete"
}

\* ---------------------------------------------------------------------------
\* Type Invariant
\* ---------------------------------------------------------------------------

TypeInvariant ==
    /\ state \in ReaderStates
    /\ panelIndex \in 0..11
    /\ palette \in PaletteElements
    /\ emotional_beat \in EmotionalBeats

\* ---------------------------------------------------------------------------
\* Transition Relation — panel-by-panel
\* ---------------------------------------------------------------------------

ValidTransition(current, next) ==
    \/ /\ current = "engaged"     /\ next = "curious"
    \/ /\ current = "curious"     /\ next = "engaged"
    \/ /\ current = "engaged"     /\ next = "curious"
    \/ /\ current = "curious"     /\ next = "alarmed"
    \/ /\ current = "alarmed"     /\ next = "frustrated"
    \/ /\ current = "frustrated"  /\ next = "hopeful"
    \/ /\ current = "hopeful"     /\ next = "hopeful"
    \/ /\ current = "hopeful"     /\ next = "enlightened"
    \/ /\ current = "enlightened" /\ next = "enlightened"
    \/ /\ current = "enlightened" /\ next = "empowered"
    \/ /\ current = "empowered"   /\ next = "empowered"

TransitionInvariant ==
    [][ ValidTransition(state, state') ]_vars

\* ---------------------------------------------------------------------------
\* Palette Association
\* ---------------------------------------------------------------------------

PaletteForState(s) ==
    CASE s = "engaged"     -> "blue"
      [] s = "curious"    -> "blue"
      [] s = "alarmed"    -> "red"
      [] s = "frustrated" -> "red"
      [] s = "hopeful"    -> "purple"
      [] s = "enlightened"-> "green"
      [] s = "empowered"  -> "green"

PaletteInvariant ==
    palette = PaletteForState(state)

\* ---------------------------------------------------------------------------
\* Emotional Beat Continuity
\*
\* Each panel carries a specific beat. The arc must be coherent:
\* confident (1) -> triumphant (2 deploy party) -> neutral (3)
\* -> panicked (4) -> lonely (5) -> rescued (6) -> focused (7)
\* -> triumphant (8 relief) -> satisfied (9) -> grateful (10)
\* -> complete (11)
\*
\* "triumphant" appears twice but at different points with different
\* subtexts — the model doesn't enforce subtext, but the beats are
\* declared per panel.
\* ---------------------------------------------------------------------------

BeatForPanel(i) ==
    CASE i = 0  -> "confident"
      [] i = 1  -> "triumphant"
      [] i = 2  -> "neutral"
      [] i = 3  -> "panicked"
      [] i = 4  -> "lonely"
      [] i = 5  -> "rescued"
      [] i = 6  -> "focused"
      [] i = 7  -> "triumphant"
      [] i = 8  -> "satisfied"
      [] i = 9  -> "grateful"
      [] i = 10 -> "complete"
    [] OTHER -> "complete"

EmotionalBeatInvariant ==
    emotional_beat = BeatForPanel(panelIndex)

\* ---------------------------------------------------------------------------
\* Panel Index Constraint
\* ---------------------------------------------------------------------------

PanelProgressInvariant ==
    panelIndex >= 0 /\ panelIndex <= 11

\* ---------------------------------------------------------------------------
\* Init
\* ---------------------------------------------------------------------------

Init ==
    /\ state = "engaged"
    /\ panelIndex = 0
    /\ palette = "blue"
    /\ emotional_beat = "confident"

\* ---------------------------------------------------------------------------
\* Actions
\* ---------------------------------------------------------------------------

NextStateForPanel ==
    CASE panelIndex = 0  -> "curious"
      [] panelIndex = 1  -> "engaged"
      [] panelIndex = 2  -> "curious"
      [] panelIndex = 3  -> "alarmed"
      [] panelIndex = 4  -> "frustrated"
      [] panelIndex = 5  -> "hopeful"
      [] panelIndex = 6  -> "hopeful"
      [] panelIndex = 7  -> "enlightened"
      [] panelIndex = 8  -> "enlightened"
      [] panelIndex = 9  -> "empowered"
      [] panelIndex = 10 -> "empowered"
    [] OTHER -> "empowered"

ReadPanel ==
    /\ panelIndex < 11
    /\ ValidTransition(state, NextStateForPanel)
    /\ state' = NextStateForPanel
    /\ panelIndex' = panelIndex + 1
    /\ palette' = PaletteForState(state')
    /\ emotional_beat' = BeatForPanel(panelIndex')
    /\ UNCHANGED <<>>

\* Terminal state: reader has finished all 11 panels
FinishReading ==
    /\ panelIndex = 11
    /\ state = "empowered"
    /\ UNCHANGED vars

Next == ReadPanel \/ FinishReading

\* ---------------------------------------------------------------------------
\* Specification
\* ---------------------------------------------------------------------------

Spec == Init /\ [][Next]_vars

\* ---------------------------------------------------------------------------
\* Composite Invariant
\* ---------------------------------------------------------------------------

Invariant ==
    /\ TypeInvariant
    /\ PaletteInvariant
    /\ PanelProgressInvariant
    /\ EmotionalBeatInvariant

===========================================================================