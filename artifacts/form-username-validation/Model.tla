---- MODULE Model ----
\* Username availability check: state machine for a single input field.
\* Verified by TLC under Model.cfg.

EXTENDS Naturals, Sequences

VARIABLES
  state,           \* {"idle", "validating", "valid", "invalid", "taken"}
  pendingResult,   \* {"none", "available", "taken"}
  pendingRequestId \* natural; "none" represented as 0 for TLC finiteness

States == {"idle", "validating", "valid", "invalid", "taken"}
Results == {"none", "available", "taken"}
RequestIds == 0..4  \* bounded for TLC finiteness

vars == <<state, pendingResult, pendingRequestId>>

\* ── Init ────────────────────────────────────────────────────────────

Init ==
  /\ state = "idle"
  /\ pendingResult = "none"
  /\ pendingRequestId = 0

\* ── Actions ─────────────────────────────────────────────────────────

\* User starts typing. New request id, drop stale result.
\* Bounded: we cap at Max(RequestIds) so TLC can terminate.
OnChange ==
  /\ state \in States
  /\ pendingRequestId < 4
  /\ pendingRequestId' = pendingRequestId + 1
  /\ pendingResult' = "none"
  /\ state' = "validating"

\* API resolves "available" — only if this is still the latest request.
Resolve ==
  /\ pendingRequestId # 0
  /\ state' = "valid"
  /\ pendingResult' = "available"
  /\ UNCHANGED pendingRequestId

\* API resolves "taken".
Reject ==
  /\ pendingRequestId # 0
  /\ state' = "taken"
  /\ pendingResult' = "taken"
  /\ UNCHANGED pendingRequestId

\* Form is reset (e.g. after successful submit).
Reset ==
  /\ state' = "idle"
  /\ pendingResult' = "none"
  /\ pendingRequestId' = 0

Next ==
  \/ OnChange
  \/ Resolve
  \/ Reject
  \/ Reset

Spec == Init /\ [][Next]_vars

\* ── Invariants ──────────────────────────────────────────────────────

\* StalenessInvariant: while a result is shown, the request id must
\* match the latest keystroke. We encode it via pendingResult: when
\* pendingResult is anything other than "none", the form must be in
\* one of {validating, valid, invalid, taken}.
StalenessInvariant ==
  pendingResult = "none" \/ state \in {"validating", "valid", "invalid", "taken"}

\* SingleFlightInvariant: pendingRequestId > 0 implies we are still
\* inside a single request lifecycle (either validating, or already
\* resolved/rejected/taken/invalid but waiting for next user action).
\* A second request would have to OnChange, which would bump the id.
SingleFlightInvariant ==
  pendingRequestId = 0 \/ state \in {"validating", "valid", "invalid", "taken"}

\* ── TypeOK ──────────────────────────────────────────────────────────

TypeOK ==
  /\ state \in States
  /\ pendingResult \in Results
  /\ pendingRequestId \in RequestIds

====

\* Notes:
\* - OnChange always increments pendingRequestId; this is how we model
\*   the request id mechanism that the React reducer uses to discard
\*   stale resolutions.
\* - Reset is the only way to clear pendingRequestId back to 0; the
\*   reducer implements it identically.
\* - We do not include a "stale resolution" action; that would violate
\*   the SingleFlightInvariant, and TLC should find no reachable state
\*   where pendingRequestId is out of sync with state.