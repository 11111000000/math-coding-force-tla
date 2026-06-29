---- MODULE LandingRefactor ----
EXTENDS Naturals

\* Self-spec for the landing page refactor.
\* This file exists so the methodology's own protocol applies to itself
\* (fractal property). TLC is not run against it; this module documents
\* the predicates that the implementation must satisfy, and the
\* verification report records them as L1 invariants.

CONSTANTS
  Stages,        \* the seven pipeline stages
  Principles,    \* the six principles
  Locales        \* {"en", "ru", "zh"}

\* ── L1 contract predicates ───────────────────────────────────────────

\* No English term in the Russian locale for which a Russian equivalent
\* exists in the corpus of methodology docs.
NoAnglicismInRu ==
  TRUE  \* captured as text-grep test in verification.json

\* Hero badge width is content-fit, not stretched.
HeroBadgeFitsText ==
  TRUE  \* captured as DOM assertion in verification.json

\* Each pipeline stage has: a numeric label, an icon, a name in three
\* locales, a target filename, and a hover-detail text.
StageHasAllFields ==
  TRUE  \* captured as DOM assertion

\* Each principle has an icon and three-locale name + description.
PrincipleHasAllFields ==
  TRUE  \* captured as DOM assertion

\* The "Verified Evidence" section no longer appears in the DOM.
NoVerifiedEvidenceSection ==
  TRUE  \* captured as DOM assertion

\* ── Liveness: what we promise the visitor ───────────────────────────

\* When a user hovers any pipeline stage, the detail panel becomes
\* visible. This is `WF`-style: if the hover state is continuously
\* maintained, the detail will eventually be shown.
HoverRevealsDetail ==
  TRUE  \* captured as Playwright hover-and-screenshot test

\* ── Spec ─────────────────────────────────────────────────────────────

Spec ==
  /\ NoAnglicismInRu
  /\ HeroBadgeFitsText
  /\ StageHasAllFields
  /\ PrincipleHasAllFields
  /\ NoVerifiedEvidenceSection
  /\ HoverRevealsDetail

====

\* Note on why TLC is not run:
\* The artifact being refined is HTML/CSS/JS, not a state machine.
\* TLC's bounded model checker cannot discharge DOM-level predicates.
\* The "verification" therefore degrades to mechanical browser-based
\* assertions recorded in verification.json. The L1 contract above is
\* retained as a self-documenting checklist so the methodology's
\* artifact-centered discipline is preserved for this packet.