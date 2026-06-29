# Task Packet Protocol

Every non-trivial task is represented by a packet under:

`artifacts/<task-id>/`

The canonical way to create a packet is:

```bash
./bin/mathpacket <task-id> [title]
```

## Required Files

- `packet.json`
- `problem.md`
- `assumptions.yaml`
- `Model.tla`
- `Model.cfg` when constants are present
- `verification.json`
- `refinement.md`
- `traceability.json`
- `implementation/`

## Principle

The packet is the source of truth.
Chat messages are transient.

## Validation

- `packet.json` should conform to `schemas/packet-manifest.schema.json` (canonical manifest schema)
- `assumptions.yaml` should conform to `schemas/assumptions.schema.json`
- `verification.json` should conform to `schemas/verification-report.schema.json`
- `traceability.json` should conform to `schemas/traceability.schema.json`

Repository helper:

```bash
./bin/validate-packet artifacts/<task-id>
```