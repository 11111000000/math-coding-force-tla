---- MODULE Model ----
EXTENDS Naturals

\* Verdict and subtype tags.
Verdicts == {"VERIFIED", "NEEDS_REVISION", "UNVERIFIABLE"}

\* Three allowed unverifiable subtypes. REJECTED is forbidden.
UnverifiableSubtypes == {"TOOL_MISSING", "OUT_OF_SCOPE", "DEFERRED"}

\* Compensation record declared in verification.json under human_review.
\* Bounded for finite state enumeration.
Reviewers == {"alice", "bob"}
Processes == {"peer-review", "spec-audit"}
Triggers == {"before-merge", "before-release"}

VARIABLES
  verdict,        \* current verdict of the packet
  subtype,        \* one of UnverifiableSubtypes if verdict = "UNVERIFIABLE", else "none"
  reviewer,       \* human_review.by, "" if unset
  process,        \* human_review.process, "" if unset
  trigger         \* human_review.trigger, "" if unset

vars == <<verdict, subtype, reviewer, process, trigger>>

Init ==
  /\ verdict = "UNVERIFIABLE"
  /\ subtype = "OUT_OF_SCOPE"
  /\ reviewer = "alice"
  /\ process = "peer-review"
  /\ trigger = "before-merge"

\* L1 contracts: a packet is well-formed.

Precondition ==
  /\ verdict \in Verdicts
  /\ (verdict = "UNVERIFIABLE") => (subtype \in UnverifiableSubtypes)
  /\ (verdict # "UNVERIFIABLE") => (subtype = "none")

Postcondition ==
  IF verdict = "UNVERIFIABLE"
  THEN /\ subtype \in UnverifiableSubtypes
       /\ reviewer \in Reviewers
       /\ process \in Processes
       /\ trigger \in Triggers
  ELSE /\ subtype = "none"

\* Compensation must carry all three required fields when unverifiable.

CompensationFieldsInvariant ==
  (verdict = "UNVERIFIABLE") =>
    /\ reviewer \in Reviewers
    /\ process \in Processes
    /\ trigger \in Triggers

\* Forbidden subtype.

NoRejectedInvariant ==
  subtype # "REJECTED"

Invariant ==
  /\ Precondition
  /\ NoRejectedInvariant
  /\ CompensationFieldsInvariant

\* Verdict and subtype must agree.
\* Monotonic compensation: fields only set, never cleared.

Next ==
  /\ verdict' \in Verdicts
  /\ subtype' \in (UnverifiableSubtypes \cup {"none"})
  /\ (verdict' = "UNVERIFIABLE") = (subtype' \in UnverifiableSubtypes)
  /\ reviewer' \in (Reviewers \cup {reviewer})
  /\ process' \in (Processes \cup {process})
  /\ trigger' \in (Triggers \cup {trigger})

Spec == Init /\ [][Next]_vars

\* Liveness: any packet declared UNVERIFIABLE eventually has a
\* fully populated compensation record.

EventuallyCompensated ==
  []( (verdict = "UNVERIFIABLE") => <>((reviewer # "") /\ (process # "") /\ (trigger # "")) )

====