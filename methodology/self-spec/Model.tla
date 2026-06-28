---- MODULE Model ----
EXTENDS Sequences, TLC

CONSTANT TaskStates

VARIABLE packetState

Precondition == packetState \in TaskStates
Postcondition(old, new) == new \in TaskStates
Invariant == packetState \in TaskStates

Init == packetState = "problem"

Advance ==
  /\ packetState \in {"problem", "assumptions", "spec", "verification", "refinement"}
  /\ packetState' = CASE packetState = "problem" -> "assumptions"
                        [] packetState = "assumptions" -> "spec"
                        [] packetState = "spec" -> "verification"
                        [] packetState = "verification" -> "refinement"
                        [] packetState = "refinement" -> "implementation"

Complete ==
  /\ packetState = "implementation"
  /\ packetState' = "done"

Loop ==
  /\ packetState = "done"
  /\ UNCHANGED packetState

Next == Advance \/ Complete \/ Loop

Spec == Init /\ [][Next]_packetState

====
