# Cursor Adapter for MathCodingFractal

This adapter integrates MathCodingFractal methodology with Cursor IDE.

## What It Provides

- A `.cursorrules` file that instructs Cursor's AI to follow the MathCodingFractal methodology.
- A reference guide for setting up Cursor to discover MathCodingFractal artifacts.
- Optional: a set of saved prompts matching MathCodingFractal's commands.

## Installation

1. Place `.cursorrules` at the project root (alongside `opencode.json`):

   ```bash
   cp adapters/cursor/.cursorrules /your/project/.cursorrules
   ```

2. Add the MathCodingFractal paths to Cursor's context include list (Cursor Settings → Features → Docs).

3. Ensure `bin/`, `schemas/`, and `MathCodingBase/` are accessible.

## Usage

Once installed, you can prompt Cursor with:

- "Create a MathCoding task packet for <feature>"
- "Formalize this problem into a TLA+ spec"
- "Run mechanical verification on this packet"
- "Generate refinement for the verified model"

Cursor will follow the rules in `.cursorrules` and use the artifacts in `MathCodingBase/` for context.

## Customization

- Edit `.cursorrules` to enforce stricter discipline or add project-specific rules.
- Edit `workflow.md` to change the conversational flow.

## Limitations

- Cursor does not call external tools (like SANY/TLC) automatically. You still need to run `./bin/verify` yourself.
- The `.cursorrules` file is advisory; it does not block non-conforming actions.

## Files

- `.cursorrules` — the rule file
- `workflow.md` — suggested conversational flow for using MathCodingFractal with Cursor
