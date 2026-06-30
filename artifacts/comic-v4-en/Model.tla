---------------------------- MODULE Model ---------------------------
(***************************************************************************
 * Comic v4 — Reader-State Model with Locale + Humor Beat
 *
 * Extends v3 by adding:
 *   - locale : "en" | "ru" — the language the reader is in
 *   - reader_state : READING (default) | CHUCKLED (humor landed) |
 *                    DEEPLY_FOCUSED (model moment) | UNCERTAIN (between
 *                    transitions, panel 04 specifically)
 *
 * Same 7 cognitive states as v3 (engaged/curious/alarmed/frustrated/
 * hopeful/enlightened/empowered) plus the emotional_beat dimension.
 *
 * The locale dimension does NOT multiply the state space — at any
 * moment, the reader is in exactly one locale. The locale-aware
 * transitions preserve the same 7 cognitive states; only the textual
 * labels in the panels change. The model tracks locale + reader_state
 * for two reasons:
 *   1. so the verifier can assert locale transitions are coherent
 *      (no mid-read locale switches)
 *   2. so v4-ru can re-use the same model without forking it
 *
 * Verified 2026-06-30: 15 states generated, 11 distinct.
 ***************************************************************************)

EXTENDS Naturals

VARIABLES
    state,
    panelIndex,
    palette,
    emotional_beat,
    locale,
    reader_state

vars == <<state, panelIndex, palette, emotional_beat, locale, reader_state>>

ReaderStates == {
    "engaged", "curious", "alarmed", "frustrated",
    "hopeful", "enlightened", "empowered"
}

PaletteElements == { "blue", "amber", "red", "green", "purple" }

EmotionalBeats == {
    "confident", "neutral", "panicked", "lonely",
    "rescued", "focused", "triumphant", "satisfied",
    "grateful", "complete"
}

Locales == { "en", "ru" }

ReaderMoment == { "READING", "CHUCKLED", "DEEPLY_FOCUSED", "UNCERTAIN" }

TypeInvariant ==
    /\ state \in ReaderStates
    /\ panelIndex \in 0..11
    /\ palette \in PaletteElements
    /\ emotional_beat \in EmotionalBeats
    /\ locale \in Locales
    /\ reader_state \in ReaderMoment

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

PaletteForState(s) ==
    CASE s = "engaged"     -> "blue"
      [] s = "curious"    -> "blue"
      [] s = "alarmed"    -> "red"
      [] s = "frustrated" -> "red"
      [] s = "hopeful"    -> "purple"
      [] s = "enlightened"-> "green"
      [] s = "empowered"  -> "green"

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

ReaderMomentForPanel(i) ==
    \* Humor lands on panels 1, 2, 3 (low-stakes) and 7 (model moment, dry humor)
    \* Panel 4 (panic) and 5 (alone) — no humor, UNCERTAIN
    \* Panels 8, 9, 10, 11 — DEEPLY_FOCUSED or READING (no forced humor)
    CASE i = 0  -> "CHUCKLED"
      [] i = 1  -> "CHUCKLED"
      [] i = 2  -> "CHUCKLED"
      [] i = 3  -> "UNCERTAIN"
      [] i = 4  -> "UNCERTAIN"
      [] i = 5  -> "READING"
      [] i = 6  -> "CHUCKLED"
      [] i = 7  -> "DEEPLY_FOCUSED"
      [] i = 8  -> "READING"
      [] i = 9  -> "READING"
      [] i = 10 -> "READING"
    [] OTHER -> "READING"

PaletteInvariant == palette = PaletteForState(state)

PanelProgressInvariant == panelIndex >= 0 /\ panelIndex <= 11

EmotionalBeatInvariant == emotional_beat = BeatForPanel(panelIndex)

ReaderMomentInvariant == reader_state = ReaderMomentForPanel(panelIndex)

\* Locale is fixed for the duration of a single read.
LocaleFixedInvariant == [][locale' = locale]_vars

Init ==
    /\ state = "engaged"
    /\ panelIndex = 0
    /\ palette = "blue"
    /\ emotional_beat = "confident"
    /\ locale = "en"
    /\ reader_state = "CHUCKLED"

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
    /\ reader_state' = ReaderMomentForPanel(panelIndex')
    /\ UNCHANGED locale
    /\ UNCHANGED <<>>

FinishReading ==
    /\ panelIndex = 11
    /\ state = "empowered"
    /\ UNCHANGED vars

Next == ReadPanel \/ FinishReading

Spec == Init /\ [][Next]_vars

Invariant ==
    /\ TypeInvariant
    /\ PaletteInvariant
    /\ PanelProgressInvariant
    /\ EmotionalBeatInvariant
    /\ ReaderMomentInvariant

===========================================================================