# Agent Portability Model

To port MathCodingFractal to another agent runtime, preserve:

1. `schemas/`
2. protocol docs from `MathCodingBase/02-Protocols/`
3. task packet directory conventions
4. mechanical verifier contract

Then adapt the integration layer:

- prompts
- commands
- tool permissions
- wrappers

This is why `.opencode/` is treated as an adapter, not the core.
