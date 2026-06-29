# Mechanical Verification Model

Mechanical verification is delegated to tools such as:

- SANY
- TLC
- TLAPS

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
- `./bin/tla-tlaps`
- `./bin/locate-tla2tools`

These are intentionally simple wrappers so the methodology can be transplanted to another runtime without rewriting the conceptual model.

## The Verdict Space

`verification.json.verdict` is a closed enum:

```
VERIFIED
NEEDS_REVISION
UNVERIFIABLE:TOOL_MISSING
UNVERIFIABLE:OUT_OF_SCOPE
UNVERIFIABLE:DEFERRED
```

The first two require real tool runs. The last three admit that mechanical verification is unavailable or inapplicable — but each carries a different obligation. See `Verification Evidence Protocol.md` for the full semantics.

## Three Subtypes of UNVERIFIABLE

`UNVERIFIABLE` is a discriminated union. The methodology refuses to treat "the tool didn't run" as a single bucket.

`UNVERIFIABLE:TOOL_MISSING` is the original meaning: a tool exists for this artifact, but it is broken or absent in CI. The owner of compensation is the infrastructure engineer — repair or pin the tool.

`UNVERIFIABLE:OUT_OF_SCOPE` is a category denial: the artifact kind does not admit mechanical verification at all. Prose quality, UX tone, strategic prioritization, ethics — these are decisions a human reviewer makes by reading, not a check a tool runs. The owner of compensation is a named human reviewer with declared competence and a review process.

`UNVERIFIABLE:DEFERRED` is a timing question: the tool runs, but the data it needs (production metrics, third-party answers, scaled load tests) does not exist yet. The owner of compensation is a named person with a deadline and a re-verification trigger.

There is no `UNVERIFIABLE:REJECTED`. An agent that believes verification is unnecessary must reformulate the task into one of the other four subtypes, not declare unverifiability.

## The Compensation Contract

Every `UNVERIFIABLE:*` packet must declare in `verification.json`:

```json
"human_review": {
  "by": "<named person or role>",
  "process": "<review procedure, steps, evidence the reviewer must produce>",
  "trigger": "<when the review runs: before-merge, before-release, on-schedule, ...>",
  "re_verification": "<optional: how or when mechanical verification resumes>"
}
```

`bin/validate-packet` enforces this. A packet that declares `UNVERIFIABLE:*` without a populated `human_review` does not pass validation.

This is the methodology's answer to the failure mode the broader community already knows: "human review" with no named reviewer or process is a way to dodge verification. Naming the reviewer and the trigger turns it into a real obligation.

## Limits of Mechanical Verification

There is a step between `tool exits` and `verification.json is written`.
At that step, an agent formats the output and decides what to record.

That decision is not itself mechanical. It is text interpretation.

The methodology accepts this as a **fundamental limitation**, not a defect to engineer away. The mitigation is discipline:

- the `verdict` field is a closed enum, so a mistyped verdict fails schema validation
- `bin/verify` is the only sanctioned writer of `verification.json` for `VERIFIED` and `NEEDS_REVISION`
- for `UNVERIFIABLE:*` the agent writes the file itself, but the human-review block records who picks up the obligation
- any code change touching `bin/verify.py` or `bin/validate-packet.py` must itself go through a packet

What this methodology cannot guarantee:

- that the model captures the user's actual intent (assumptions must be user-confirmed for that)
- that an agent did not edit `verification.json` between tool exit and disk write (filesystem integrity is outside the methodology's scope)
- that TLAPS proved the *right* theorem (TLAPS only proves what it is asked to prove)
- that the named reviewer in `human_review.by` actually reviewed the packet (this is the boundary where methodology hands off to social process)

The boundary of trust is:

- for `VERIFIED` and `NEEDS_REVISION`: tools run, tools return exit codes, the verifier records the exit codes faithfully
- for `UNVERIFIABLE:*`: the agent declares a subtype honestly and a human reviewer takes responsibility on the named trigger

Everything before and after those boundaries is human or agent responsibility.

The four blind spots named here in passing — the agent between tool exit and `verification.json` write, the unformalized human review, the assumption drift, and the under-validated refinement contract — are tracked with stable ids (L1–L4) in [`Known Limitations`](../00-Meta/Known%20Limitations.md). That file is the canonical place to look up what the methodology can and cannot guarantee; this section only admits the seam exists.