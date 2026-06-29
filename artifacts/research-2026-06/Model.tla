---- MODULE Model ----
EXTENDS Naturals, FiniteSets

\* Empirical model of the methodology's application to itself.
\* This is an observational model, not a controller. The state holds
\* observed values. Next refines these observations.

CONSTANTS
  CorpusSize,
  SelfApplicationCount,
  ExternalCount,
  EducationalCount

ASSUME
  /\ CorpusSize = 11
  /\ SelfApplicationCount = 5
  /\ ExternalCount = 4
  /\ EducationalCount = 2

VARIABLES
  verified_packets,
  connective_share,
  refinement_dominates_model,
  lifecycle_gate_present,
  epistemic_markers_present,
  multi_substrate_support

vars == << verified_packets,
            connective_share,
            refinement_dominates_model,
            lifecycle_gate_present,
            epistemic_markers_present,
            multi_substrate_support >>

Init ==
  /\ verified_packets = {p \in {"docs-humanization-2026-06",
                                  "unverifiable-as-design",
                                  "rebrand-mathcoding",
                                  "examples/minimal-spec",
                                  "examples/ui-modal-dialog",
                                  "methodology/self-spec",
                                  "comic-v2",
                                  "ui-modal-react"} : TRUE}
  /\ connective_share = 9
  /\ refinement_dominates_model = TRUE
  /\ lifecycle_gate_present = FALSE
  /\ epistemic_markers_present = TRUE
  /\ multi_substrate_support = FALSE

Precondition ==
  /\ 0 <= connective_share /\ connective_share <= 10
  /\ Cardinality(verified_packets) >= 5
  /\ refinement_dominates_model = TRUE
  /\ epistemic_markers_present = TRUE

Postcondition ==
  Precondition

CorpusCountInvariant ==
  SelfApplicationCount + ExternalCount + EducationalCount = CorpusSize

RefinementDominatesInvariant ==
  refinement_dominates_model = TRUE

EpistemicMarkersRequired ==
  epistemic_markers_present = TRUE

Invariant ==
  /\ CorpusCountInvariant
  /\ RefinementDominatesInvariant
  /\ EpistemicMarkersRequired

\* Successor progress: at some point lifecycle gate and multi-substrate
\* support will both be TRUE. Connective share may reduce over time.

Next ==
  \/  /\ connective_share' \in 0..9
      /\ connective_share' <= connective_share
      /\ verified_packets' = verified_packets
      /\ refinement_dominates_model' = TRUE
      /\ lifecycle_gate_present' \in {lifecycle_gate_present, TRUE}
      /\ epistemic_markers_present' = epistemic_markers_present
      /\ multi_substrate_support' \in {multi_substrate_support, TRUE}

Spec == Init /\ [][Next]_vars

\* No temporal progress property. This model is observational,
\* not prescriptive. Progress toward the successor methodology is a
\* human commitment recorded in problem.md, not a model guarantee.

====