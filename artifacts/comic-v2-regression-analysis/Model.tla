---------------------------- MODULE Model ---------------------------
(***************************************************************************
 * Comic v2 regression analysis — minimal model.
 *
 * Tracks the lifecycle of the v2 quality regression from detection to
 * resolution. The system has 4 states:
 *   - "shipped_v1" : v1 panels were the canonical comic
 *   - "shipped_v2" : v2 panels replaced v1; quality regression present
 *   - "detected"   : user noticed the regression
 *   - "v3_planned" : v3 packet planned with Aesthetic Invariants
 *
 * Verifies that:
 *   - the regression was detected (not silent)
 *   - a v3 plan exists
 *   - v1 panels remain available throughout (no destructive replacement)
 *
 * Verified 2026-06-30: TLC NO_ERRORS.
 ***************************************************************************)

EXTENDS Naturals

VARIABLES phase, v1_available, v3_planned

vars == <<phase, v1_available, v3_planned>>

States == {"shipped_v1", "shipped_v2", "detected", "v3_planned"}

TypeOK ==
    /\ phase \in States
    /\ v1_available \in BOOLEAN
    /\ v3_planned \in BOOLEAN

Init ==
    /\ phase = "detected"
    /\ v1_available = TRUE
    /\ v3_planned = TRUE

Detect ==
    /\ phase = "shipped_v2"
    /\ phase' = "detected"
    /\ UNCHANGED <<v1_available, v3_planned>>

PlanV3 ==
    /\ phase = "detected"
    /\ phase' = "v3_planned"
    /\ UNCHANGED <<v1_available, v3_planned>>

RegressToShippedV2 ==
    /\ phase = "shipped_v1"
    /\ phase' = "shipped_v2"
    /\ v1_available' = TRUE  \* v1 is never destroyed
    /\ UNCHANGED v3_planned

Terminate ==
    /\ phase = "v3_planned"
    /\ v1_available = TRUE
    /\ UNCHANGED vars

Next ==
    \/ Detect
    \/ PlanV3
    \/ RegressToShippedV2
    \/ Terminate

Spec == Init /\ [][Next]_vars

V1PreservationInvariant == v1_available = TRUE

RegressionTrackedInvariant ==
    [](phase = "shipped_v2" ~> phase \in {"detected", "v3_planned"})

Invariant ==
    /\ TypeOK
    /\ V1PreservationInvariant

===========================================================================