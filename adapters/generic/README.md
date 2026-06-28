# Generic Adapter Spec for MathCodingFractal

This document specifies a minimal contract for integrating MathCodingFractal into any agent runtime. Any runtime that satisfies this contract can use the methodology.

## Required Surface

### 1. Skill/Rule Loading

The agent must load:

- `AGENTS.md` from the project root
- `MathCodingBase/**/*.md` (Obsidian knowledge base)
- Optionally: schemas and protocol docs

### 2. Command Interface

The runtime should expose the following commands. Each command invokes the corresponding `bin/` script and returns a structured result.

| Command | Implementation |
|---------|----------------|
| `mathpacket` | `./bin/mathpacket <task-id> [title]` |
| `verify` | `./bin/verify <packet-dir>` |
| `refine` | `./bin/refine-from-model <packet-dir>` |
| `validate-packet` | `./bin/validate-packet <packet-dir>` |

### 3. Tool Execution

The runtime must be able to:

- Run shell commands via `bin/*` scripts
- Read JSON artifacts under `artifacts/<task-id>/`
- Write JSON artifacts under `artifacts/<task-id>/`

### 4. Mandatory Prompts

When the agent receives a user request:

1. Identify whether the request is a new task or an update to an existing packet.
2. Run the appropriate `bin/` script.
3. Surface `verification.json.verdict` to the user.
4. Refuse to generate code if verdict is not VERIFIED.

## Portable Artifact Schema

The adapter must produce and consume these artifact paths:

```
artifacts/<task-id>/
  packet.json          # manifest (packet-manifest.schema.json)
  problem.md           # free text
  assumptions.yaml     # assumptions.schema.json
  Model.tla            # TLA+ module (name matches filename)
  Model.cfg            # TLC config
  verification.json    # verification-report.schema.json
  refinement.md        # free text
  traceability.json    # traceability.schema.json
  implementation/      # generated code
```

## Mandatory Constraints

The adapter MUST:

- Run `./bin/verify` before declaring any packet VERIFIED.
- Never override `verification.json.verdict` without actual tool output.
- Never invent missing `Model.tla` elements. If something is missing, fail and report.
- Pass assumptions with status `open` only after user confirmation.

The adapter MUST NOT:

- Skip `assumptions.yaml` even if the task seems trivial.
- Generate code if `verification.json.verdict != VERIFIED`.
- Treat chat transcripts as the spec.

## Reference Implementation

See:

- `adapters/cursor/` — Cursor adapter
- `adapters/claude-code/` — Claude Code adapter
- `.opencode/` — opencode integration

## Implementing a New Adapter

To integrate a new agent runtime:

1. Create `adapters/<runtime>/` with:
   - `README.md` describing installation and usage
   - A rule file (e.g., `.cursorrules`, `CLAUDE.md`, `system_prompt.txt`)
   - Slash commands or equivalent
2. Translate the rule file to invoke `bin/*` scripts.
3. Document tool invocation permissions.
4. Test against the four verified packets.

## Minimal Adapter Test

After implementing the adapter, run:

```bash
./bin/verify examples/minimal-spec
./bin/verify examples/ui-modal-dialog
./bin/verify methodology/self-spec
./bin/verify artifacts/ui-modal-react
./bin/validate-packet examples/minimal-spec
./bin/validate-packet examples/ui-modal-dialog
./bin/validate-packet methodology/self-spec
./bin/validate-packet artifacts/ui-modal-react
```

If all eight commands succeed, the adapter is compatible.
