# Quickstart

## Purpose

This repository is a portable methodology scaffold for math-coding.

## First Use

1. Open the repository.
2. Read `README.md`.
3. Read `MathCodingBase/Index.md`.
4. Create or inspect a packet under `artifacts/`.
5. Use `.opencode/commands/mathpacket.md` if working through opencode.

## Create a Packet

```bash
./bin/mathpacket demo-task "Demo Task"
```

This creates the canonical packet scaffold under `artifacts/demo-task/`.

## Formalize

Edit `Model.tla` and `Model.cfg`. For stateful work, declare VARIABLES, Init, Next, Spec, and at minimum one safety property.

Add `THEOREM ... PROOF` blocks if you want proof-producing verification (requires TLAPS).

## Mechanical Verification

Discovery order:

- `$TLA2TOOLS_JAR`
- `tools/tla2tools.jar`
- Common user/system locations

TLAPS discovery order:

- `$TLAPM_BIN`
- `tools/tlaps/bin/tlapm`

If `java` is missing, wrappers fall back to:

```bash
nix shell nixpkgs#jdk21
```

### Run all tiers

```bash
./bin/verify artifacts/<task-id>
```

This runs SANY, TLC, and TLAPS (if available) and writes `verification.json` with real tool output.

### Step-by-step

```bash
./bin/tla-sany artifacts/<task-id>/Model.tla
./bin/tla-tlc -config artifacts/<task-id>/Model.cfg artifacts/<task-id>/Model.tla
./bin/tla-tlaps artifacts/<task-id>/Model.tla
```

## Generate Refinement

```bash
./bin/refine-from-model artifacts/<task-id>
```

This regenerates `refinement.md` and `traceability.json` skeleton from the parsed TLA+ model. Fill in target-language mappings afterward.

## Packet Validation

```bash
./bin/validate-packet artifacts/<task-id>
```

Performs structural validation including traceability gap detection (reports `source -> TODO` mappings).

## Verified Examples

- `examples/minimal-spec` — model: `Model`, verdict: `VERIFIED`, 2 THEOREMs proved
- `examples/ui-modal-dialog` — model: `Model`, verdict: `VERIFIED`, 8 reachable states
- `methodology/self-spec` — model: `Model`, verdict: `VERIFIED`, 7 reachable states

## Adapter Selection

If you are using a non-opencode agent:

- Cursor → `adapters/cursor/`
- Claude Code → `adapters/claude-code/`
- Other runtime → `adapters/generic/` (specification)

## Porting To Another Agent

The minimum reusable subset is:

- `schemas/`
- `MathCodingBase/02-Protocols/`
- `AGENTS.md`
- `README.md`
- `bin/`

## Operational Tools Summary

| Script | Purpose |
|--------|---------|
| `bin/mathpacket` | Create a new task packet scaffold |
| `bin/refine-from-model` | Generate refinement.md and traceability.json from Model.tla |
| `bin/verify` | Run SANY + TLC + TLAPS and write verification.json |
| `bin/validate-packet` | Structural validation + traceability gap detection |
| `bin/tla-sany` | Low-level SANY wrapper |
| `bin/tla-tlc` | Low-level TLC wrapper |
| `bin/tla-tlaps` | Low-level TLAPS wrapper |
| `bin/locate-tla2tools` | Show discovered tla2tools.jar path |
