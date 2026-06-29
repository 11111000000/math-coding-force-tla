# Verification Evidence Protocol

Verification is not a sentence. It is an artifact.

The canonical artifact path inside a packet is `verification.json`.

## Required Evidence Fields

- module name
- L1 gate result
- SANY command and exit code
- TLC command and result
- invariants checked
- temporal properties checked
- verdict
- when verdict is `UNVERIFIABLE:*`: the `human_review` object (see below)

## Verdicts

The verdict field is a closed enum:

- `VERIFIED`
- `NEEDS_REVISION`
- `UNVERIFIABLE:TOOL_MISSING`
- `UNVERIFIABLE:OUT_OF_SCOPE`
- `UNVERIFIABLE:DEFERRED`

`VERIFIED` requires actual tool execution with recorded exit codes. `NEEDS_REVISION` requires a recorded counterexample.

## UNVERIFIABLE Subtypes

`UNVERIFIABLE` is a discriminated union. Every unverifiable packet must declare which subtype applies and why.

### `UNVERIFIABLE:TOOL_MISSING`

A mechanical tool exists for the artifact kind, but it is broken, missing, or unavailable in CI. The packet's owner must repair or pin the tool. Example: TLC jar removed from CI image; SANY reports a Java path issue.

### `UNVERIFIABLE:OUT_OF_SCOPE`

The artifact kind lies outside mechanical verification's domain. Examples: prose quality, UX aesthetics, ethical decisions, strategic prioritization, design taste. The packet must declare a named human reviewer with declared competence and a review process.

### `UNVERIFIABLE:DEFERRED`

Verification requires data not yet available: production metrics, user research, load tests at scale, third-party feedback. The packet must declare an owner, a re-verification trigger, and a deadline.

### `REJECTED` is forbidden

There is no `UNVERIFIABLE:REJECTED` subtype. An agent that decides verification is unnecessary must reformulate the task into a smaller verifiable task. Skipping verification on the grounds of personal judgement is a methodological failure, not an unverifiability.

## Compensation Obligation

Every `UNVERIFIABLE:*` packet must include a `human_review` object in `verification.json`:

```json
"human_review": {
  "by": "<named person or role>",
  "process": "<review procedure, steps, evidence the reviewer must produce>",
  "trigger": "<when the review runs: before-merge, before-release, on-schedule, ...>",
  "re_verification": "<optional: how or when mechanical verification resumes>"
}
```

Missing or empty fields fail `bin/validate-packet` for unverifiable packets. This is the cost of declaring unverifiability: you owe a named reviewer and a process.

## Writer Restriction

`bin/verify` is the only sanctioned writer of `verification.json` for `VERIFIED` and `NEEDS_REVISION`. For `UNVERIFIABLE:*`, the agent may legitimately write the file itself when no tool runs. This carve-out is explicit: unverifiability by definition means the tool did not produce the evidence, so the agent formats the explanation and the human-review declaration.

## Wrapper Commands

Use repository wrappers when possible:

```bash
./bin/tla-sany Model.tla
./bin/tla-tlc -config Model.cfg Model.tla
```

Both require `TLA2TOOLS_JAR` to be set.

The parser wrapper runs `tla2sany.drivers.SANY` from `tla2tools.jar`.

If it is not set, the wrappers search common repository-local and user-local locations automatically.