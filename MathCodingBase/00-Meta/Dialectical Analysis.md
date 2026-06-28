# Dialectical Analysis

## Problem

How can software development stop relying on underspecified textual intent and instead become a mathematically disciplined activity that agents can execute?

## Thesis

Add formal methods to agent workflows. Make agents produce TLA+ before code.

## Antithesis

If formalization is just another chat step, the system degenerates into ceremonial formalism. The agent may emit formal-looking text without a durable process, without artifacts, and without evidence.

## Synthesis

The methodology must be artifact-centered, not prompt-centered.

That means:

- the unit of work is a task packet
- assumptions are explicit
- formal specs are stored as files
- verification is mechanical and evidence-bearing
- refinement is explicit
- traceability is recorded
- the methodology formalizes itself

This is why MathCodingFractal is structured around `artifacts/`, `schemas/`, and `methodology/self-spec/`, with agent integrations layered on top.
