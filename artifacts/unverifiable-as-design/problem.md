# Problem: UNVERIFIABLE as first-class verdict

## Context

`Mechanical Verification Model.md` documents three verdicts: `VERIFIED`, `NEEDS_REVISION`, `UNVERIFIABLE`. Two packets in the repo today carry `UNVERIFIABLE`:

1. `examples/minimal-spec/THEOREM` clauses that TLAPS cannot discharge and that TLC cannot express as temporal formulas — fallback verdict `UNVERIFIABLE` because the formal obligation is outside both tools' reach.
2. `artifacts/docs-humanization-2026-06` — prose rewrites with no executable semantics. `UNVERIFIABLE` because prose has no semantics to mechanically check.

These two cases share a label but have nothing in common. The first is a tool coverage gap inside MathCoding's normal scope. The second is a categorical denial that mechanical verification applies at all. Conflating them under one verdict loses information that downstream review needs.

The methodology currently has no rule about `UNVERIFIABLE` packets beyond "format tool output". The Artifact-Centered Architecture depends on verdicts as evidence; conflating tool failure with category mismatch erodes that evidence.

## Task

Promote `UNVERIFIABLE` from a single verdict to a discriminated union of subtypes, and make each subtype carry a compensation obligation that names the human reviewer and review process.

### Subtypes

| Subtype | When it applies | Owner of compensation |
|---|---|---|
| `UNVERIFIABLE:TOOL_MISSING` | Mechanical tool exists for the artifact kind but is broken, missing, or unavailable in CI | Infrastructure engineer — must repair or pin |
| `UNVERIFIABLE:OUT_OF_SCOPE` | Artifact kind lies outside mechanical verification's domain (prose quality, UX, ethics, strategy, design taste) | Named human reviewer with declared competence and review process |
| `UNVERIFIABLE:DEFERRED` | Verification requires data not yet available (production metrics, user research, scaling tests) | Named owner; deadline and trigger for re-verification |
| `UNVERIFIABLE:REJECTED` | Agent decided verification is unnecessary — refused to commit | Forbidden. Packet must reformulate the task into one of the other three subtypes |

### Compensation obligation

Every `UNVERIFIABLE:*` packet must declare in `verification.json`:

```json
"human_review": {
  "by": "<named person or role>",
  "process": "<review procedure, steps, what evidence reviewer must produce>",
  "trigger": "<when the review runs: before merge, before release, on schedule, ...>",
  "re_verification": "<optional: how/when to re-run mechanical verification if conditions change>"
}
```

Missing `human_review` makes the packet structurally invalid. `bin/validate-packet` must enforce this for `UNVERIFIABLE:*`.

### What stays unchanged

- `VERIFIED` continues to require real tool exit codes recorded with no agent mediation.
- `NEEDS_REVISION` continues to require a recorded counterexample.
- `bin/verify` is the only sanctioned writer of `verification.json` for `VERIFIED` and `NEEDS_REVISION`. For `UNVERIFIABLE:*`, the agent may write `verification.json` itself if `human_review` is filled — a deliberate carve-out because the agent is the only writer available when the tool cannot run.

## Desired Outcome

A future packet whose artifact is a UI tone decision or a marketing landing page or a strategic roadmap choice carries `UNVERIFIABLE:OUT_OF_SCOPE` plus a named reviewer and review procedure, and that packet passes `bin/validate-packet`. A broken CI pipeline generates `UNVERIFIABLE:TOOL_MISSING` and triggers the same validation, surfacing infrastructure failures as data rather than swallowing them.

## Out of scope

This packet does not change the L1/L2/L3 model, the refinement protocol, or the traceability protocol beyond adding the `human_review` field to `verification.json`. It does not introduce new tools. It does not change the `VERIFIED` or `NEEDS_REVISION` semantics.