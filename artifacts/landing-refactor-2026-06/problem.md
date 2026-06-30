# Problem: Landing Page Refactor (2026-06)

## Provenance

`Landing/index.html` is the public landing page deployed to
`https://11111000000.github.io/math-coding-force-tla/`. It is the first artifact a
visitor sees and the surface where the methodology is presented in three
languages. The page is part of the repository (`Landing/index.html` is
copied to `_site/index.html` by `.github/workflows/deploy.yml`), so any
change to it ships via the same pipeline that ships the methodology
itself.

## Task

Address four user-reported defects in the current landing page:

1. **Russian locale leaks English terms.** Several words in
   `data-lang="ru"` blocks are English (`Evidence`, `verified`) or
   carry heavy English flavor (`пайплайн`, `Рефинемент`). For each such
   word, a Russian native speaker would expect a Russian equivalent.
2. **Hero badge has oversized border.** `.hero-badge` looks like the
   frame is significantly wider than the text inside it, breaking the
   visual hierarchy where the badge should sit cleanly above the
   headline.
3. **The "Seven Stages" pipeline is a flat list.** The current
   implementation renders seven `.pipeline-step` tiles in a single row
   with name + filename, no illustration, no tooltip, no detail. The
   user cannot tell what happens at each stage without reading the docs.
4. **The "Verified Evidence" section duplicates the proof of work.**
   Four `.proof-card`s show packet names and state counts. The user does
   not see why this section exists; the icons, however, are
   visually appealing and should be reused elsewhere.

## Desired Outcome

- A Russian reader sees Russian words, not anglicisms.
- The hero badge sits tightly around its text.
- The seven-stage pipeline becomes a click-through, hover-detailed
  guide: each stage has an illustration and a hover panel that shows
  the stage's purpose, the file it produces, and a one-line "what bug
  this catches" note.
- The "Verified Evidence" section is removed; the four packet icons
  are re-used inside the principles section (or a small companion
  row) so that the visual signal is preserved without redundancy.

## Non-Goals

- Switching the build pipeline. The page is still a single static
  `Landing/index.html` with inline CSS/JS; this packet refactors that
  file only.
- Translating content into Chinese. Only Russian wording is in scope;
  Chinese (`data-lang="zh"`) is preserved as-is unless the same defect
  is also present there.
- Touching `_site/` directly. That directory is the build output and
  is overwritten by CI.
- Touching the docs site, the comic panels, or the knowledge base.

## Reference

- `Landing/index.html` — the file under refactor
- `landing/img/*.svg` — the illustration library available for reuse
- `MathCodingBase/02-Protocols/Task Packet Protocol.md` — packet shape
- `MathCodingBase/02-Protocols/Refinement Protocol.md` — required
  refinement sections
