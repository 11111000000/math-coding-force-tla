---- MODULE Model ----
EXTENDS Naturals, TLC

\* The model describes the humanization-pass contract, not a stateful system.
\* This is documentation content rendered in TLA+ syntax so the schema
\* stays uniform across packets. There is one state, no transitions.

CONSTANTS
  DocumentSet,
  LeverSet

VARIABLES
  rewritten,    \* set of documents rewritten end-to-end
  translated    \* set of documents translated to Russian

vars == <<rewritten, translated>>

Init ==
  /\ rewritten = {}
  /\ translated = {}

\* Atomic action: rewrite one document
Rewrite(doc) ==
  /\ doc \in DocumentSet
  /\ doc \notin rewritten
  /\ rewritten' = rewritten \cup {doc}
  /\ UNCHANGED translated

\* Atomic action: translate one document (rewriting implies English source fixed)
Translate(doc) ==
  /\ doc \in DocumentSet
  /\ doc \in rewritten
  /\ doc \notin translated
  /\ translated' = translated \cup {doc}
  /\ UNCHANGED rewritten

Next ==
  \/ \E doc \in DocumentSet : Rewrite(doc) \/ Translate(doc)

Spec == Init /\ [][Next]_vars

\* L1 invariants
Precondition == DocumentSet # {} /\ LeverSet # {}

Postcondition ==
  /\ rewritten = DocumentSet
  /\ translated \subseteq rewritten

Invariant ==
  /\ rewritten \subseteq DocumentSet
  /\ translated \subseteq rewritten
  /\ rewritten # {} => DocumentSet # {}

\* Liveness: every document eventually rewritten; every entry-level
\* document eventually translated.
Progress ==
  []( \A d \in DocumentSet : <> (d \in rewritten) )

FullTranslation ==
  []( \A d \in "EntryLevel" : <> (d \in translated) )

====