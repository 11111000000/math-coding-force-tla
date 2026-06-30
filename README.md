# MathCoding (Force-TLA+ edition)

> **This is the historical Force-TLA+ edition of MathCoding.**
> Every task packet here is required to carry a formal TLA+ model that
> passes SANY + TLC before any code is written. The newer, more flexible
> edition lives at [`11111000000/math-coding`](https://github.com/11111000000/math-coding).
> The flexible edition accepts `UNVERIFIABLE:*` verdicts with named
> human review as a substitute for mechanical verification; this
> edition does not. Treat this repo as a strict subset.

MathCoding is a methodology plus a portable scaffold. It replaces vibe-coding with math-coding, and it works with any coding agent that can read a file and run a shell command.

The unit of work is a **task packet** — a folder that holds the problem statement, the assumptions, the formal model, the verification evidence, the refinement plan, the traceability map, and the implementation. The packet is the source of truth. The chat is not.

## Why this exists

Vibe-coding generates plausible code from prose intent. The result looks fine in the moment, then breaks the first time a user clicks twice, a request arrives out of order, or a deployment scales past one node. The code worked; the model of the code didn't exist.

Math-coding inverts the order. You write the model first. You check it with a tool. Only then do you write the code that implements it. Four rules fall out of that:

- assumptions are explicit and tagged (`user-confirmed`, `agent-inferred`, or `open`)
- the model is mechanically checked before any code exists
- the verdict on a model is `VERIFIED`, `NEEDS_REVISION`, or `UNVERIFIABLE` — never "looks fine"
- the methodology describes itself with the same artifacts it asks of you

## What ships in this repo

- a canonical packet layout under `artifacts/<task-id>/`
- eight mandatory packet artifacts: `packet.json`, `problem.md`, `assumptions.yaml`, `Model.tla`, `Model.cfg`, `verification.json`, `refinement.md`, `traceability.json`, `implementation/`
- machine-readable JSON Schemas under `schemas/` for the manifest, assumptions, verification report, and traceability
- three tiers of mechanical verification: SANY parses, TLC model-checks, TLAPS proves
- operational tooling under `bin/`: `mathpacket`, `verify`, `validate-packet`, `refine-from-model`, `tla-sany`, `tla-tlc`, `tla-tlaps`, `locate-tla2tools`
- a Nix flake that gives you a reproducible devShell with `jdk21` and exposes every script as an app
- adapter layers for opencode (`.opencode/`), Cursor (`adapters/cursor/`), Claude Code (`adapters/claude-code/`), and a generic contract (`adapters/generic/`)
- an Obsidian knowledge base at `MathCodingBase/` with the methodology's own self-application

## Verified packets

Four packets pass mechanical verification end-to-end today. Three are example or self packets; one is a real artifact packet with a React/TypeScript refinement.

| Packet | Type | Verdict | States | Notes |
|--------|------|---------|--------|-------|
| `examples/minimal-spec` | example | `VERIFIED` (SANY + TLC + TLAPS) | 2 | two `THEOREM`s proved via TLAPS |
| `examples/ui-modal-dialog` | example | `VERIFIED` (SANY + TLC) | 8 | realistic UI state machine |
| `methodology/self-spec` | self | `VERIFIED` (SANY + TLC) | 7 | the methodology describes itself |
| `artifacts/ui-modal-react` | artifact | `VERIFIED` (SANY + TLC) | 8 | React/TypeScript refinement; 16 tests pass |

## Quickstart

```bash
# 1. Create a packet
./bin/mathpacket demo-task "Demo Task"

# 2. Edit problem.md, assumptions.yaml, Model.tla, Model.cfg
# 3. Generate refinement skeleton from the parsed model
./bin/refine-from-model artifacts/demo-task

# 4. Run all three verification tiers
./bin/verify artifacts/demo-task

# 5. Validate structural shape
./bin/validate-packet artifacts/demo-task

# 6. Write code, then re-verify and re-validate
```

## Repository shape

```
.
├── README.md                       this file
├── AGENTS.md                       repository-wide rules for any agent
├── QUICKSTART.md                   operational quickstart
├── opencode.json                   portable opencode integration
├── flake.nix                       reproducible devShell and apps
├── schemas/                        JSON Schemas for the four machine-readable artifacts
├── bin/                            operational tooling
│   ├── mathpacket
│   ├── refine-from-model
│   ├── verify
│   ├── validate-packet
│   ├── tla-sany
│   ├── tla-tlc
│   ├── tla-tlaps
│   └── locate-tla2tools
├── adapters/                       per-agent integration
│   ├── cursor/
│   ├── claude-code/
│   └── generic/
├── MathCodingBase/                 Obsidian knowledge base
│   ├── 00-Meta/                    manifesto, dialectical analysis, methodology in Russian
│   ├── 01-Theory/                  cycle, three layers, TLA+ role, refinement
│   ├── 02-Protocols/               packet, assumption, refinement, verification, traceability
│   ├── 03-Architecture/            architecture, portability, mechanical verification, UI guide
│   └── 04-Fractal-Self/            self-application
├── examples/                       verified example packets
│   ├── minimal-spec/
│   └── ui-modal-dialog/
├── artifacts/                      canonical home for new task packets
├── methodology/self-spec/          methodology's own packet
├── tools/                          tla2tools.jar and TLAPS installation
└── .opencode/                      opencode integration layer
```

## Agent portability

Four adapter directories, one contract:

- **opencode** — `.opencode/` with skills, agents, and slash commands
- **Cursor** — `adapters/cursor/.cursorrules` plus a workflow guide
- **Claude Code** — `adapters/claude-code/CLAUDE.md` plus slash commands
- **Generic** — `adapters/generic/README.md` defines the minimum contract any agent must satisfy

To port MathCoding to a new runtime, keep the schemas, the protocol docs, the packet directory convention, and the mechanical verifier contract. Swap the prompts, slash commands, tool permissions, and wrappers. Everything above the adapter line stays untouched.

## Verification pipeline

Three tiers, run by `./bin/verify`:

1. **SANY** parses `Model.tla`. No parse, no further verification.
2. **TLC** enumerates reachable states up to the bounds in `Model.cfg` and checks every invariant and temporal property.
3. **TLAPS** proves any `THEOREM` blocks using backend provers (Zenon, Isabelle, Z3, and SMT solvers).

The verdict is one of:

- `VERIFIED` — every required tier passed against real tool output
- `NEEDS_REVISION` — at least one tier failed; `verification.json` contains the counterexample
- `UNVERIFIABLE:TOOL_MISSING` — the tool exists but is broken or absent in CI; trust is suspended until the tool is repaired
- `UNVERIFIABLE:OUT_OF_SCOPE` — the artifact kind does not admit mechanical verification (prose, UX, strategy, ethics); trust moves to a named human reviewer
- `UNVERIFIABLE:DEFERRED` — the tool runs but the data does not yet exist; trust is delayed until the data arrives

Every `UNVERIFIABLE:*` packet owes a `human_review` block: a named reviewer, a process, and a trigger. "Trust me, it's fine" is not a verdict.

## Status

- Four packets pass mechanical verification end-to-end.
- TLAPS proves two real `THEOREM`s in `examples/minimal-spec`.
- `bin/refine-from-model` rebuilds the refinement and traceability skeletons from the parsed TLA+ model.
- `bin/validate-packet` reports structural issues and any `source -> TODO` mappings left in the traceability.
- `artifacts/ui-modal-react` ships a reducer, a view, and 16 tests that all pass.
- Three adapters are live: opencode, Cursor, Claude Code, plus the generic contract.

The next architectural step is the protocol-strengthening packet tracked in `Roadmap.md` — closing the gap where a refinement can be a TODO skeleton and still pass validation.