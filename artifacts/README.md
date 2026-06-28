# Artifacts

Every task should live under its own packet directory:

`artifacts/<task-id>/`

This directory is the canonical unit of development.

Create one with:

```bash
./bin/mathpacket <task-id> [title]
```

Suggested initial template:

```text
artifacts/<task-id>/
  packet.json
  problem.md
  assumptions.yaml
  Model.tla
  Model.cfg
  verification.json
  refinement.md
  traceability.json
  implementation/
```
