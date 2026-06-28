# Mechanical Verification Model

Mechanical verification is delegated to tools such as:

- SANY
- TLC

The verifier agent does not replace these tools.

Its responsibility is to:

1. ensure the spec artifact is present
2. ensure L1 gate conditions are met
3. invoke the tools
4. capture outputs
5. materialize a verification artifact

This prevents the methodology from collapsing into self-referential prompt confidence.

The repository-level operational hooks are:

- `./bin/tla-sany`
- `./bin/tla-tlc`
- `./bin/locate-tla2tools`

These are intentionally simple wrappers so the methodology can be transplanted to another runtime without rewriting the conceptual model.

## Limits of Mechanical Verification

There is a step between `tool exits` and `verification.json is written`.
At that step, an agent formats the output and decides what to record.

That decision is not itself mechanical. It is text interpretation.

The methodology accepts this as a **fundamental limitation**, not a defect
to engineer away. The mitigation is discipline:

- the `verdict` field is a closed enum (`VERIFIED`, `NEEDS_REVISION`,
  `UNVERIFIABLE`), so a mistyped verdict fails schema validation;
- `bin/verify` is the only sanctioned writer of `verification.json`;
- any code change touching `bin/verify.py` or `bin/validate-packet.py`
  must itself go through a packet.

What this methodology cannot guarantee:

- that the model captures the user's actual intent (assumptions must be
  user-confirmed for that);
- that an agent did not edit `verification.json` between tool exit and
  disk write (filesystem integrity is outside the methodology's scope);
- that TLAPS proved the *right* theorem (TLAPS only proves what it is
  asked to prove).

The boundary of trust is: tools run, tools return exit codes, the
verifier records the exit codes faithfully. Everything before and after
that boundary is human or agent responsibility.
