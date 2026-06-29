# Dialectical Analysis

## Problem

Software development has been leaning on underspecified textual intent for years. An agent reads the prose, decides what it means, and produces code. The user reviews the code, finds bugs, files issues, the agent patches, repeat. The intent itself — what was supposed to happen — never appears as an artifact. It lives in the chat, in the heads of the developers, in the comments nobody updates.

Two failure modes follow. Either intent stays in prose and drifts, or intent moves into code and stays implicit. The fix is a third path: make intent an artifact.

## Thesis

Add formal methods to agent workflows. Make agents produce TLA+ before code. Then the model *is* the intent, mechanically checked, version-controlled, reviewable.

This works up to a point. The integration is straightforward, the tools exist (SANY, TLC, TLAPS), and the formal-methods community has spent decades turning distributed-systems reasoning into something executable.

## Antithesis

Formalization in chat is a different thing from formalization as a discipline. An agent can emit TLA+-looking text on the way to writing code, then ignore the model once the code compiles. The result has all the upfront cost of rigor and none of the benefit. The artifact gets discarded, the version control loses the diff, the next agent starts from scratch. This is ceremonial formalism: the form is there, the function isn't.

## Synthesis

The synthesis is structural, not procedural. The agent cannot be the source of rigor, because the agent is replaceable. The artifacts must be the source of rigor, because the artifacts persist.

That means:

- the unit of work is a task packet, not a conversation turn
- assumptions are explicit and tagged, not absorbed into prose
- formal specs live as files (`Model.tla`, `Model.cfg`), not inline in chat replies
- verification is mechanical and evidence-bearing, with a real exit code and a real verdict
- refinement is an explicit artifact linking model to code
- traceability is machine-readable
- the methodology applies its own rules to itself, via `methodology/self-spec/`

This is why MathCoding puts `artifacts/`, `schemas/`, and `methodology/self-spec/` at the centre, and the agent integrations (`.opencode/`, `adapters/cursor/`, `adapters/claude-code/`, `adapters/generic/`) on top. Swap the agent; the methodology stays.