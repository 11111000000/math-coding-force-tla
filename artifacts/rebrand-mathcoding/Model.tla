---- MODULE Model ----
EXTENDS Naturals

\* The rename is mechanical: an entity state holds the name. The
\* mechanical check is whether the rename produced a well-formed
\* post-state.

VARIABLES name, target

Init ==
  /\ name = "MathCoding"
  /\ target = "MathCoding"

Precondition == name # ""
Postcondition == name = "MathCoding"

Next ==
  /\ name' \in {"MathCoding", "MathCoding"}
  /\ target' = "MathCoding"

Spec == Init /\ [][Next]_<<name, target>>

\* Liveness: the rename eventually reaches the target.

EventuallyRenamed == <>(name = "MathCoding")

====
