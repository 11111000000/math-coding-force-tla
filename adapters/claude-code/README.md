# Claude Code Adapter for MathCoding

This adapter integrates MathCoding with Claude Code's project-scoped rules and slash commands.

## What It Provides

- A `CLAUDE.md` rules file (Claude Code's equivalent of `AGENTS.md`).
- A set of slash commands for direct invocation.
- Reference to MathCoding's portable schemas and protocols.

## Installation

1. Place `CLAUDE.md` at the project root:

   ```bash
   cp adapters/claude-code/CLAUDE.md /your/project/CLAUDE.md
   ```

2. Install the slash commands under `.claude/commands/`:

   ```bash
   mkdir -p /your/project/.claude/commands
   cp adapters/claude-code/commands/*.md /your/project/.claude/commands/
   ```

3. (Optional) Install MathCoding skills as Claude-compatible skills:

   ```bash
   mkdir -p /your/project/.claude/skills
   cp -r .opencode/skills/* /your/project/.claude/skills/
   ```

## Slash Commands Provided

- `/formalize <task-id>` — Create or update a MathCoding task packet
- `/verify <packet>` — Run mechanical verification and update verification.json
- `/refine <packet>` — Regenerate refinement.md and traceability.json from Model.tla

## Usage

After installation, you can invoke from Claude Code:

```
/formalize user-registration
```

Claude Code will:

1. Run `./bin/mathpacket user-registration`.
2. Fill `problem.md` and `assumptions.yaml`.
3. Produce `Model.tla`.
4. Run `./bin/verify artifacts/user-registration`.

## Customization

- Edit `CLAUDE.md` to add project-specific rules.
- Add more slash commands by following the same pattern.

## Limitations

- Claude Code's slash commands are advisory; they don't enforce the methodology on their own.
- External tool execution (SANY/TLC) still requires `bin/verify`.

## Files

- `CLAUDE.md` — project-level rules
- `commands/formalize.md` — slash command
- `commands/verify.md` — slash command
- `commands/refine.md` — slash command
