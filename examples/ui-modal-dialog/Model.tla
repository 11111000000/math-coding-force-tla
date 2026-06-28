---- MODULE Model ----
EXTENDS Naturals, TLC

CONSTANTS
  DialogStates

VARIABLES
  state,
  pendingResult

\* ===== L1 CONTRACTS =====

\* State must always be one of the declared dialog states
StateInvariant == state \in DialogStates

\* There is at most one background operation in flight
NoPendingIfSettled ==
  \/ pendingResult = "none"
  \/ (pendingResult = "ok" /\ state \in {"closing"})
  \/ state \in {"confirming", "canceling", "error"}

\* The dialog is never simultaneously open and closed
ConsistencyInvariant ==
  ~(state = "open" /\ state = "closed")

\* ===== L2 STATE MACHINE =====

Init ==
  /\ state = "closed"
  /\ pendingResult = "none"

\* ---- transitions ----

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

\* Click outside is treated as a cancel-equivalent
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

\* Spec with weak fairness on user-driven and background-resolution transitions,
\* and strong fairness on ErrorDismiss because the user must be able to close it.
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
