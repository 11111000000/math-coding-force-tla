# MathCodingFractal

**MathCodingFractal** is a methodology and portable scaffold for replacing vibe-coding with math-coding. It works with any sufficiently capable coding agent and is built around **task packets** — a stable unit of development that contains problem, assumptions, formal model, mechanical verification evidence, refinement, traceability, and implementation.

## Why This Exists

Vibe-coding generates plausible-looking code from prose intent. The result often looks correct in the moment but does not survive contact with concurrency, scale, or new requirements. Math-coding replaces that with a discipline:

- assumptions are made explicit
- the model is mechanically checked before code
- evidence, not confidence, justifies moving on
- the methodology describes and constrains itself

## What It Provides

- **Canonical artifact model**: every task is a packet under `artifacts/<task-id>/`.
- **Eight mandatory packet artifacts**: `packet.json`, `problem.md`, `assumptions.yaml`, `Model.tla`, `Model.cfg`, `verification.json`, `refinement.md`, `traceability.json`, `implementation/`.
- **Machine-readable schemas**: `schemas/` contains JSON Schema definitions for the manifest, assumptions, verification report, and traceability.
- **Three-tier mechanical verification**: SANY (parsing), TLC (model checking), TLAPS (proof-producing).
- **Operational tooling**: `bin/` contains `mathpacket`, `verify`, `validate-packet`, `refine-from-model`, `tla-sany`, `tla-tlc`, `tla-tlaps`, and `locate-tla2tools`.
- **Nix reproducibility**: `flake.nix` provides a devShell with `jdk21` and exposes the tools as `apps`.
- **Multi-agent integration**: `.opencode/` plus `adapters/cursor/` and `adapters/claude-code/`.
- **Obsidian knowledge base**: `MathCodingBase/` contains the conceptual documentation and the methodology's self-application.

## Verified Packets Included

The repository currently contains four packets that pass mechanical
verification end-to-end: three example/self packets plus one artifact packet
with a React/TypeScript refinement.

| Packet | Type | Verdict | States | Notes |
|--------|------|---------|--------|-------|
| `examples/minimal-spec` | example | `VERIFIED` (SANY + TLC + TLAPS) | 2 | `tlaps.theorems_proved = 2` |
| `examples/ui-modal-dialog` | example | `VERIFIED` (SANY + TLC) | 8 | Real UI state machine |
| `methodology/self-spec` | self | `VERIFIED` (SANY + TLC) | 7 | Methodology describes itself |
| `artifacts/ui-modal-react` | artifact | `VERIFIED` (SANY + TLC) | 8 | React/TypeScript refinement; repository-level JS/TS runtime still pending |

## Quickstart

```bash
# 1. Create a new packet
./bin/mathpacket demo-task "Demo Task"

# 2. Edit problem.md, assumptions.yaml, Model.tla, Model.cfg
# 3. Generate refinement skeleton
./bin/refine-from-model artifacts/demo-task

# 4. Run mechanical verification (all three tiers)
./bin/verify artifacts/demo-task

# 5. Validate
./bin/validate-packet artifacts/demo-task

# 6. Implement, then re-verify and re-validate
```

## Repository Shape

```
.
├── README.md                       this file
├── AGENTS.md                       repository-wide rules
├── QUICKSTART.md                   operational quickstart
├── opencode.json                   portable opencode integration
├── flake.nix                       reproducible devShell + apps
├── schemas/                        machine-readable schemas
├── bin/                            operational tooling
│   ├── mathpacket
│   ├── refine-from-model
│   ├── verify
│   ├── validate-packet
│   ├── tla-sany
│   ├── tla-tlc
│   ├── tla-tlaps
│   └── locate-tla2tools
├── adapters/                       multi-agent integration
│   ├── cursor/
│   ├── claude-code/
│   └── generic/
├── MathCodingBase/                 Obsidian knowledge base
│   ├── 00-Meta/                    manifesto, dialectical analysis, methodology in Russian
│   ├── 01-Theory/                  mathematical development cycle, TLA+ role, refinement
│   ├── 02-Protocols/               artifact, assumption, refinement protocols
│   ├── 03-Architecture/            architecture, portability, mechanical verification, UI guide
│   └── 04-Fractal-Self/            self-application
├── examples/                       verified example packets
│   ├── minimal-spec/
│   └── ui-modal-dialog/
├── artifacts/                      canonical place for new task packets
├── methodology/self-spec/          methodology's own packet
├── tools/                          tla2tools.jar and TLAPS installation
└── .opencode/                      opencode integration layer
```

## Agent Portability

Three adapter directories implement the methodology for different agent runtimes:

- **opencode** — `.opencode/` with skills, agents, and slash commands
- **Cursor** — `adapters/cursor/.cursorrules` plus a workflow guide
- **Claude Code** — `adapters/claude-code/CLAUDE.md` plus slash commands
- **Generic** — `adapters/generic/README.md` defines the minimum contract for any agent

## Verification Pipeline

Three tiers, executed by `./bin/verify`:

1. **SANY** parses `Model.tla`. Without parse OK, no further verification.
2. **TLC** model-checks over reachable states up to the bounds given in `Model.cfg`.
3. **TLAPS** proves any `THEOREM` blocks using backend provers (Zenon, Isabelle, Z3).

The verdict is:

- `VERIFIED` — all required tiers passed with real tool output
- `NEEDS_REVISION` — at least one tier failed
- `UNVERIFIABLE` — tools unavailable or insufficient

## Status

- Mechanical verification end-to-end on four packets.
- TLAPS proves two real `THEOREM`s in `examples/minimal-spec`.
- `bin/refine-from-model` auto-generates refinement skeletons from parsed TLA+.
- `bin/validate-packet` reports structural issues and traceability gaps.
- `artifacts/ui-modal-react` contains reducer, view, tests, and traceability,
  but the repository still needs a shared JS/TS runtime harness before that
  packet is executable in a fresh checkout.
- The highest-priority next step is therefore repository-local JS/TS runtime
  support, not another UI packet.
- Three adapters ready: opencode, Cursor, Claude Code, plus a generic spec.
