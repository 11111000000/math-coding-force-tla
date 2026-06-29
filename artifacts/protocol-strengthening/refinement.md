# Refinement: Validator Protocol-Strengthening

This packet refines the L1 contract of `bin/validate-packet.py` and
materialises the new branches as Python functions plus a synthetic-
packet test suite.

## State Mapping

The "state" of a validator run is `(packet_dir, manifest, env)`. The
env part captures whether strict mode is enabled.

| Model concept         | Code location                                   |
| --------------------- | ----------------------------------------------- |
| `packet_dir`          | `sys.argv[1]`                                   |
| `manifest`            | `packet.json` content                          |
| `env`                 | `os.environ["MATHCODING_STRICT_VALIDATION"]`    |
| `verdict`             | `verification["verdict"]`                       |
| `human_review`        | `verification["human_review"]`                  |
| `traceability[i]`     | `traceability["mappings"][i]`                   |
| `tla_actions`         | regex extraction from `Model.tla`               |

## Operation Mapping

| Model action       | Code location                                            |
| ------------------ | -------------------------------------------------------- |
| `CheckVerdict`     | `_check_unverifiable_human_review` + the verdict `in VALID_VERDICTS` check |
| `CheckFiles`       | `main()` loop on `required.items()`                      |
| `CheckTraceability`| `mappings[i].task_id == manifest.task_id`               |
| `CheckStrict`      | `_check_assumptions_hash` + `_check_refinement_covers_actions` + `_check_traceability_targets` |

## Invariant Preservation

- `AcceptsEveryVerdict` — preserved by `VALID_VERDICTS` constant set
  plus the early-return in `main()`.
- `UnverifiableRequiresHumanReview` — preserved by
  `_check_unverifiable_human_review`, called before the success path.
- `DefaultModeIsBackwardCompatible` — preserved by `_strict_enabled`
  returning False unless env or manifest opts in.
- `StrictIsOptIn` — preserved by the same `_strict_enabled` check.

## Test Obligation Mapping

| Model property                    | Test (in validate-packet.test.mjs)                  |
| --------------------------------- | ---------------------------------------------------- |
| `AcceptsEveryVerdict`             | `valid.packet`, `unverifiable_subtype_accepted`     |
| `UnverifiableRequiresHumanReview` | `unverifiable_requires_human_review`                |
| `DefaultModeIsBackwardCompatible` | (manual: re-run ./bin/validate-packet on each existing packet) |
| `StrictIsOptIn`                   | (manual: re-run with MATHCODING_STRICT_VALIDATION=1 and confirm no auto-enable) |

## Runtime-Check Mapping

The validator itself is the runtime. The synthetic test suite is the
check; there is no separate runtime. Test failures are caught by exit
code (`process.exit(1)` on first FAIL).

## Backwards compatibility

Every existing packet was re-validated under default mode after this
packet shipped. All six return `Packet valid: <path>` with exit code 0.
Strict mode was also exercised; the result for each is recorded in
`verification.json.results.strict_mode_per_packet`.