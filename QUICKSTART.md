# Quickstart (Force-TLA+ edition)

> **Strict edition.** Every behavior packet requires a TLA+ model that
> passes SANY + TLC. The newer, more flexible edition is at
> [`11111000000/math-coding`](https://github.com/11111000000/math-coding).

This repo is a methodology scaffold for math-coding. If you have never seen it before, read `README.md` and `MathCodingBase/Index.md` first.

## First contact

1. Open the repository.
2. Read `README.md`.
3. Read `MathCodingBase/Index.md` to find the conceptual entry point that matches your question.
4. Pick a packet under `artifacts/` (existing or new) and open it.
5. If you work through opencode, use the `/mathpacket` slash command; the rest of the surface is the same.

## Create a packet

```bash
./bin/mathpacket demo-task "Demo Task"
```

The script writes the canonical scaffold under `artifacts/demo-task/`.

## Write the model

Open `Model.tla` and `Model.cfg`. For stateful work, declare `VARIABLES`, `Init`, `Next`, `Spec`, and at least one safety property. Add `THEOREM ... PROOF` blocks if you want TLAPS to discharge proof obligations that model checking can't.

## Run mechanical verification

The wrappers look for `tla2tools.jar` in this order:

- `$TLA2TOOLS_JAR`
- `tools/tla2tools.jar`
- common user and system locations

For TLAPS:

- `$TLAPM_BIN`
- `tools/tlaps/bin/tlapm`

If `java` is missing, drop into the Nix shell:

```bash
nix shell nixpkgs#jdk21
```

### All tiers in one command

```bash
./bin/verify artifacts/<task-id>
```

This runs SANY, TLC, and TLAPS (if TLAPS is on the path) and writes `verification.json` with the real tool output.

### One tier at a time

```bash
./bin/tla-sany  artifacts/<task-id>/Model.tla
./bin/tla-tlc   -config artifacts/<task-id>/Model.cfg artifacts/<task-id>/Model.tla
./bin/tla-tlaps artifacts/<task-id>/Model.tla
```

## Generate refinement and traceability

```bash
./bin/refine-from-model artifacts/<task-id>
```

The script reads the parsed TLA+ model and regenerates `refinement.md` and `traceability.json` skeletons. You fill in the target-language mappings by hand.

## Validate a packet

```bash
./bin/validate-packet artifacts/<task-id>
```

Reports missing files, schema mismatches, and any `source -> TODO` mappings that slipped through the refinement step.

## Verified examples

- `examples/minimal-spec` — verdict `VERIFIED`, 2 reachable states, 2 `THEOREM`s proved via TLAPS
- `examples/ui-modal-dialog` — verdict `VERIFIED`, 8 reachable states
- `methodology/self-spec` — verdict `VERIFIED`, 7 reachable states

## Pick an adapter

| Agent | Adapter |
|-------|---------|
| opencode | `.opencode/` |
| Cursor | `adapters/cursor/` |
| Claude Code | `adapters/claude-code/` |
| Anything else | `adapters/generic/` (read this as a spec) |

## Port to a new agent runtime

The minimum you keep:

- `schemas/`
- `MathCodingBase/02-Protocols/`
- `AGENTS.md`
- `README.md`
- `bin/`

Everything else is integration.

## Tools at a glance

| Script | What it does |
|--------|--------------|
| `bin/mathpacket` | Create a new task packet scaffold |
| `bin/refine-from-model` | Regenerate `refinement.md` and `traceability.json` from the parsed model |
| `bin/verify` | Run SANY + TLC + TLAPS and write `verification.json` |
| `bin/validate-packet` | Structural validation and traceability gap detection |
| `bin/tla-sany` | Low-level SANY wrapper |
| `bin/tla-tlc` | Low-level TLC wrapper |
| `bin/tla-tlaps` | Low-level TLAPS wrapper |
| `bin/locate-tla2tools` | Print the discovered `tla2tools.jar` path |