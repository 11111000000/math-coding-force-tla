# Problem: Validator Protocol-Strengthening

## Provenance

`bin/validate-packet.py` ships today as a style-guide validator. It
catches missing files, schema mismatches, and TODO targets in
`traceability.json`, but stops at the structural surface. The roadmap
item 1.2 commits to closing the gap where `refinement.md` full of
TODOs and stale `verification.json` verdicts still pass validation.

This packet closes the structural half of that gap by extending the
validator with three new rules, gated behind a feature flag, and
verifies them with a synthetic-packet test suite.

## Task

Extend `bin/validate-packet.py` with:

1. **Broader verdict enum.** Accept `UNVERIFIABLE:TOOL_MISSING`,
   `UNVERIFIABLE:OUT_OF_SCOPE`, `UNVERIFIABLE:DEFERRED` in addition to
   the bare `UNVERIFIABLE`. The current validator only accepts the bare
   string and rejects every packet that uses the discriminated subtypes
   introduced in `unverifiable-as-design`.
2. **Human-review obligation.** When the verdict is `UNVERIFIABLE:*`,
   the `verification.json` must carry a populated `human_review` block
   with `by`, `process`, and `trigger`. Without it, validation fails.
3. **L4 mitigation: every TLA+ action mentioned in refinement.md.**
   Strict mode extracts top-level `Name ==` definitions from
   `Model.tla`, skips framework symbols (`Init`, `Spec`, `Next`,
   `TypeOK`, `Safety`, `Fairness`, `Invariant`, `StateInvariant`,
   `Precondition`, `Postcondition`, etc.) and requires the rest to
   appear in `refinement.md`. The packet can also declare its own
   `actions: [...]` list in `packet.json` to override the heuristic.
4. **Traceability target resolution.** Strict mode verifies that
   targets in `traceability.json` either resolve to an existing file
   relative to the packet dir, take the `symbol:` form for documented
   symbols, or look like a free-form description that is not a path.

The new checks must be **opt-in**, not on by default. Otherwise they
break existing packets (`examples/ui-modal-dialog`,
`methodology/self-spec`, `artifacts/ui-modal-react`,
`artifacts/landing-refactor-2026-06`, `artifacts/unverifiable-as-design`).

Two opt-in modes:

- Environment variable `MATHCODING_STRICT_VALIDATION=1`.
- Per-packet `packet.json` field `"strict": true`.

The packet is verified when synthetic test packets exercise every
branch and produce the documented exit codes.

## Desired Outcome

- Default validation behaviour (no flag, no `strict`) is **unchanged**:
  every existing packet still validates.
- New strict checks are available behind the flag.
- A Node-based synthetic test suite covers every branch.
- `bin/validate-packet.py` continues to return exit codes `0/1/2/3/4/5/6/7`,
  with the new code `7` for the unverifiable-without-review case.

## Non-Goals

- This packet does **not** roll out strict mode on existing packets.
  That is a separate ratchet, packet by packet, with each old packet
  repaired to pass strict before its `strict: true` flag is flipped on.
- This packet does **not** add the `assumptions.yaml` hash check to
  strict mode. That requires `bin/verify` to record the hash on every
  successful run; the verify-side change is tracked in roadmap 1.2-ratchet.
- This packet does **not** add TLAPS / theorem-proof checks. Those are
  covered by the existing TLAPS tier in `bin/verify`.

## Reference

- `bin/validate-packet.py` — current validator
- `MathCodingBase/02-Protocols/Task Packet Protocol.md` — packet shape
- `MathCodingBase/00-Meta/Known Limitations.md` — L3, L4 mitigations
- `MathCodingBase/00-Meta/Roadmap.md` — item 1.2
- `artifacts/landing-refactor-2026-06/` — most recent verified packet