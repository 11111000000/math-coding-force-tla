---- MODULE Model ----
EXTENDS Naturals, TLC

\* This module is a verbatim copy of the verified model from
\* examples/ui-modal-dialog/Model.tla. The original packet has verdict
\* VERIFIED with 8 reachable states. We replicate the model here rather
\* than reference it across packets because TLA+ tooling does not allow
\* EXTENDS of a module by file path; each packet must be self-contained
\* for SANY and TLC to parse it.
\*
\* Traceability from this packet's evidence to the original verdict is
\* maintained through refinement.md and traceability.json.

CONSTANTS
  DialogStates

VARIABLES
  state,
  pendingResult

\* ===== L1 CONTRACTS =====

StateInvariant == state \in DialogStates

NoPendingIfSettled ==
  \/ pendingResult = "none"
  \/ (pendingResult = "ok" /\ state \in {"closing"})
  \/ state \in {"confirming", "canceling", "error"}

ConsistencyInvariant ==
  ~(state = "open" /\ state = "closed")

\* ===== L2 STATE MACHINE =====

Init ==
  /\ state = "closed"
  /\ pendingResult = "none"

Open ==
  /\ state = "closed"
  /\ state' = "opening"
  /\ UNCHANGED pendingResult

FinishOpen ==
  /\ state = "opening"
  /\ state' = "open"
  /\ UNCHANGED pendingResult

Confirm ==
  /\ state = "open"
  /\ state' = "confirming"
  /\ pendingResult' = "in-flight"

Cancel ==
  /\ state = "open"
  /\ state' = "canceling"
  /\ pendingResult' = "in-flight"

Dismiss ==
  /\ state = "open"
  /\ state' = "canceling"
  /\ pendingResult' = "in-flight"

Resolve ==
  /\ state \in {"confirming", "canceling"}
  /\ pendingResult = "in-flight"
  /\ state' = "closing"
  /\ pendingResult' = "ok"

Reject ==
  /\ state = "confirming"
  /\ pendingResult = "in-flight"
  /\ state' = "error"
  /\ pendingResult' = "failed"

FinishClose ==
  /\ state = "closing"
  /\ state' = "closed"
  /\ pendingResult' = "none"

Retry ==
  /\ state = "error"
  /\ state' = "confirming"
  /\ pendingResult' = "in-flight"

ErrorDismiss ==
  /\ state = "error"
  /\ state' = "closing"
  /\ pendingResult' = "none"

Next ==
  \/ Open
  \/ FinishOpen
  \/ Confirm
  \/ Cancel
  \/ Dismiss
  \/ Resolve
  \/ Reject
  \/ FinishClose
  \/ Retry
  \/ ErrorDismiss

Spec ==
  Init /\ [][Next]_<<state, pendingResult>> /\
    WF_<<state, pendingResult>>(Open) /\
    WF_<<state, pendingResult>>(FinishOpen) /\
    WF_<<state, pendingResult>>(Confirm) /\
    WF_<<state, pendingResult>>(Cancel) /\
    WF_<<state, pendingResult>>(Retry) /\
    SF_<<state, pendingResult>>(ErrorDismiss) /\
    WF_<<state, pendingResult>>(Resolve) /\
    WF_<<state, pendingResult>>(Reject) /\
    WF_<<state, pendingResult>>(FinishClose)

Safety ==
  []StateInvariant /\ []NoPendingIfSettled

Liveness ==
  /\ [](state = "open" ~> state \in {"closing", "error"})
  /\ [](state = "error" ~> state = "closed")

====