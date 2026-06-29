# Refinement: rebrand-mathcoding

## State Mapping

The companion `Model.tla` describes the rename as a two-state entity that holds `name` and a constant `target`. The model is documentation, not a state machine that runs in production. The "implementation" is a Python script that walks the repository and substitutes strings.

| Model variable | Real artifact |
|---|---|
| `name` | The string the user reads in any prose, schema, or config file |
| `target` | The new string after rename |

In practice, `target = "MathCoding"` is constant; `name` is whatever the user would have seen before the script ran. After the script, every reachable `name` is `"MathCoding"`.

## Operation Mapping

The mechanical operation is one Python `str.replace` pass per file, with four substitution pairs ordered from longest to shortest so substrings do not eat each other.

| TLA+ concept | Code operation |
|---|---|
| `Init` | Initial file scan that finds 47 candidate files |
| `Next` | One `str.replace` cycle that mutates each file in place |
| `Postcondition` (`name = "MathCoding"`) | Post-scan `grep -r` that returns zero matches for the old brand |

## Invariant Preservation Strategy

The mechanical invariants this packet relies on:

- **Substring ordering**: longer forms (`MathCodingFractal-Self`) replaced before shorter forms (`MathCodingFractal`). Otherwise `MathCodingFractal-Self` would become `MathCoding-Self` only after `MathCodingFractal` had already eaten the prefix.
- **Exclude directories**: `node_modules/`, `.git/`, generated sites, and `tools/tlaps/` skipped, because their contents are not human-edited and would balloon the diff without value.
- **File extension allowlist**: only text-bearing extensions touched; binary formats skipped.
- **Root folder name preserved**: the script edits file contents, not directory names. The user's separate rename will land on a different packet.

The invariants the rename DOES NOT touch:

- File names that contain the brand (none exist; verified).
- Packet IDs under `artifacts/` (they are identifiers, not brand).
- `mkdocs.yml` URL fields, which already used lowercase forms.
- The `package-lock.json` content (regenerated on next `npm install`).

## Test Obligation Mapping

No executable tests added. The equivalent obligations:

- `grep -rIln 'MathCodingFractal\|mathcodingfractal\|mathcoding-fractal'` over the repository (excluding generated dirs) returns zero matches. Verified post-rename.
- `bin/verify` on every previously-`VERIFIED` packet still passes. Verified for `unverifiable-as-design`, `examples/ui-modal-dialog`, `examples/minimal-spec`, `methodology/self-spec`, this packet.
- `bin/validate-packet` on `unverifiable-as-design` and `docs-humanization-2026-06` still passes.

## Runtime-Check Mapping

None. The rename is a one-shot operation. If the user reverts any of the changes and a future agent re-applies the rename, the same script will succeed idempotently because the old brand no longer exists in scope.

## What This Refinement Doesn't Promise

This packet does not promise:

- That no readme, blog post, or external link outside the repository still mentions "MathCodingFractal". Those would require a separate audit.
- That the root folder rename will be mechanical when the user gets to it. The folder currently exists at `MathCodingFractal/`; renaming it touches git history and CI paths.
- That every user-facing reference in mkdocs-rendered HTML or pandoc-rendered output already reflects the new name. Those artifacts are generated and will regenerate on next build.