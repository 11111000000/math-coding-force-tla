# Agent Portability Model

To port MathCoding to another agent runtime, preserve:

1. `schemas/`
2. protocol docs from `MathCodingBase/02-Protocols/`
3. task packet directory conventions
4. mechanical verifier contract, including the `UNVERIFIABLE` subtype union

Then adapt the integration layer:

- prompts
- commands
- tool permissions
- wrappers

This is why `.opencode/` is treated as an adapter, not the core.

The verdict enum and its `UNVERIFIABLE:*` subtypes belong to the verifier contract. Porting to a new runtime means preserving the union — `UNVERIFIABLE:TOOL_MISSING`, `UNVERIFIABLE:OUT_OF_SCOPE`, `UNVERIFIABLE:DEFERRED` — and the `human_review` obligation that comes with each. Without that, unverifiability degrades into refusal.