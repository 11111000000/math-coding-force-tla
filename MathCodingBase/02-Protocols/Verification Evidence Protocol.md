# Verification Evidence Protocol

Verification is not a sentence. It is an artifact.

The canonical artifact path inside a packet is `verification.json`.

## Required Evidence Fields

- module name
- L1 gate result
- SANY command and exit code
- TLC command and result
- invariants checked
- temporal properties checked
- verdict

## Verdicts

- `VERIFIED`
- `NEEDS_REVISION`
- `UNVERIFIABLE`

`VERIFIED` requires actual tool execution.

## Wrapper Commands

Use repository wrappers when possible:

```bash
./bin/tla-sany Model.tla
./bin/tla-tlc -config Model.cfg Model.tla
```

Both require `TLA2TOOLS_JAR` to be set.

The parser wrapper runs `tla2sany.drivers.SANY` from `tla2tools.jar`.

If it is not set, the wrappers search common repository-local and user-local locations automatically.
