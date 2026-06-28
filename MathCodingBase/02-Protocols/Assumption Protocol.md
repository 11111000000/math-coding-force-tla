# Assumption Protocol

Assumptions are mandatory and explicit.

## Each Assumption Must Have

- `id`
- `statement`
- `status`

## Status Values

- `user-confirmed`
- `agent-inferred`
- `open`

## Rule

No implementation may silently depend on an `open` assumption.

If an `open` assumption matters to correctness, the agent must either:

1. ask the user, or
2. branch the model and record both cases
