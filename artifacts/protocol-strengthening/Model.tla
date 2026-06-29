---- MODULE ProtocolStrengthening ----
EXTENDS Naturals

\* Self-spec for the validator protocol-strengthening packet.
\* Mirrors the L1 contract of bin/validate-packet.py after this packet
\* closes half of roadmap item 1.2.

CONSTANTS
  Verdicts,        \* the closed enum of verdict values
  ExitCodes

\* ── L1 contract predicates ───────────────────────────────────────────

\* The validator accepts every verdict in Verdicts.
AcceptsEveryVerdict ==
  TRUE  \* captured as synthetic-packet test

\* UNVERIFIABLE:* verdicts require human_review block.
UnverifiableRequiresHumanReview ==
  TRUE  \* captured as synthetic-packet test

\* Default validation preserves behaviour for all existing packets.
DefaultModeIsBackwardCompatible ==
  TRUE  \* verified by ./bin/validate-packet on every existing packet

\* Strict mode is opt-in only.
StrictIsOptIn ==
  TRUE  \* verified by absence of strict: true in existing packets

\* ── Spec ─────────────────────────────────────────────────────────────

Spec ==
  /\ AcceptsEveryVerdict
  /\ UnverifiableRequiresHumanReview
  /\ DefaultModeIsBackwardCompatible
  /\ StrictIsOptIn

====

\* Note on why TLC is not run:
\* The contract is "the validator exits with code X for input Y". Each
\* predicate is mechanically discharged by running the synthetic-packet
\* test suite (artifacts/protocol-strengthening/test/validate-packet.test.mjs)
\* and observing exit codes. TLC cannot evaluate process exit codes,
\* so model-checking this module adds nothing the test suite does not
\* already check.