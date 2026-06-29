# Problem: Rename MathCoding to MathCoding

## Context

The methodology name "MathCoding" reads as heavy, self-referential branding. Inside the repository, we don't need that. The methodology is "math coding" — the systematic application of mathematical formal-methods artifacts to coding workflows. The fractal property is a real architectural fact about the methodology, not a name element we should advertise in every prose paragraph.

The root folder keeps the old name for now (the user will rename it separately). Inside the repo, the brand identity becomes plain: `MathCoding`.

## Task

Replace every occurrence of `MathCoding`, `mathcoding`, `mathcoding`, and `MathCoding-Self` with the simplified equivalent (`MathCoding`, `mathcoding`, `mathcoding-self`) across:

- All `.md`, `.json`, `.yaml`, `.yml`, `.py`, `.sh`, `.nix`, `.tla`, `.cfg`, `.tsx`, `.ts`, `.js`, `.svg`, `.css`, `.html`, `.txt`, `.mdx` files under the repository root.
- Both English-language documentation under `MathCodingBase/` and Russian-language translations under `MathCodingBase/ru/`.

What stays unchanged:

- The root folder name `MathCoding/` (the user will rename later).
- File names that contain the brand (none exist today; verified by scan).
- Packet IDs under `artifacts/` (`docs-humanization-2026-06`, `unverifiable-as-design`, `ui-modal-react`, etc.) — they name the packet, not the methodology.
- `package-lock.json` JSON keys that are generated artefacts of npm and should be regenerated on next `npm install` (we still update them mechanically; regeneration will rewrite them anyway).
- Generated directories: `node_modules/`, `.git/`, `dist/`, `build/`, `_site/`, `site/`, `states/`, `landing/`, `Landing/`, `tools/tlaps/`.

## Desired Outcome

A repo where the methodology is referred to as `MathCoding` everywhere a reader or contributor encounters it: in prose, schema names, agent adapter docs, opencode skill names, `flake.nix` app names, `mkdocs.yml` site titles, and `package.json` `name` fields. The root folder keeps `MathCoding/` until the user renames it; nothing inside the folder depends on the outer name.

## Out of scope

- Renaming the root folder.
- Renaming packet IDs.
- Renaming generated artefacts (`_site/`, `site/`).
- Renaming `landing/` and `Landing/` (these are working directories for the mkdocs landing page; their content does not advertise the brand).
- A second pass of humanization. This is a mechanical rename, not a prose revision.