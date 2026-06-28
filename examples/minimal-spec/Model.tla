---- MODULE Model ----
EXTENDS Naturals, TLC

VARIABLE bit

Precondition == bit \in {0, 1}
Postcondition(old, new) == new \in {0, 1} /\ new # old
Invariant == bit \in {0, 1}

Init == bit = 0

Toggle == /\ bit \in {0, 1}
          /\ bit' = 1 - bit

Next == Toggle

Spec == Init /\ [][Next]_bit

\* ===== MACHINE-PROVABLE THEOREMS (Tier 3: TLAPS) =====

THEOREM InitImpliesInvariant == Init => Invariant
PROOF BY DEF Init, Invariant
====

THEOREM TogglePreservesInvariant == Invariant /\ [Toggle]_bit => Invariant'
PROOF BY DEF Toggle, Invariant
====

====
