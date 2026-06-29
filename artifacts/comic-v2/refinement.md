# Refinement: Comic v2 — Reader-State to Visual Elements

## State Mapping

| Model variable | Visual element | File format |
|---|---|---|
| `state \in ReaderStates` | SVG panel composition (palette, Maya expression, foreground/background weight) | `<rect fill>`, `<text>`, group `<g>` transforms |
| `panelIndex \in 0..11` | Panel viewport dimensions and grid position in Comic.md | `<svg width height>` attributes |
| `palette \in PaletteElements` | Background `<rect fill>` color + primary text/glyph color | hex values from STYLE.md |

### TypeScript-style pseudo-types (for documentation only; the implementation is hand-drawn SVG)

```ts
type ReaderState = "engaged" | "curious" | "alarmed" | "frustrated"
                 | "hopeful" | "enlightened" | "empowered"
type Palette = "blue" | "amber" | "red" | "green" | "purple"

interface Panel {
  index: 0..11
  state: ReaderState       // reader's cognitive state AFTER reading this panel
  palette: Palette         // dominant color element
  width: number            // 600 | 800 | 1000
  height: number           // 400 | 600 | 800
  motif: "code" | "deploy" | "clicks" | "bug" | "alone" | "mentor"
       | "model" | "crystal" | "fix" | "constellation" | "stamp"
}
```

The compiler (mkdocs, browser SVG renderer) preserves `TypeInvariant`,
`PaletteInvariant`, and `PanelProgressInvariant` structurally — invalid
states cannot be authored because each panel SVG is a single static file
with explicit attributes.

## Operation Mapping

The TLA+ action `ReadPanel` increments `panelIndex` by 1 and updates
`state` to `NextStateForPanel[panelIndex]`. The visual implementation
**is** the file naming: `artifacts/comic-v2/implementation/01-looks-right.svg`
corresponds to panelIndex=0, `02-ship-it.svg` to panelIndex=1, etc.

| Panel file | panelIndex | state (after) | palette | dimensions |
|---|---|---|---|---|
| `01-looks-right.svg`   | 0  | engaged → curious     | blue   | 800×600 (medium) |
| `02-ship-it.svg`       | 1  | curious → engaged     | blue   | 600×400 (small)  |
| `03-the-clicks.svg`    | 2  | engaged → curious     | green  | 600×400 (small)  |
| `04-the-bug.svg`       | 3  | curious → alarmed     | **red**| **1000×800 (LARGE — climax)** |
| `05-alone.svg`         | 4  | alarmed → frustrated  | **red**| 800×600 (medium) |
| `06-the-mentor.svg`    | 5  | frustrated → hopeful  | **purple** | 800×600 (medium) |
| `07-the-model.svg`     | 6  | hopeful → hopeful     | **purple** | 800×600 (medium) |
| `08-tlc-finds-it.svg`  | 7  | hopeful → enlightened | **green** | **1000×800 (LARGE — climax)** |
| `09-fix-first.svg`     | 8  | enlightened → enlightened | green | 800×600 (medium) |
| `10-better-world.svg`  | 9  | enlightened → empowered | green | 800×600 (medium) |
| `11-the-stamp.svg`     | 10 | empowered → empowered | blue   | 600×400 (small) |

The two `LARGE` panels (04, 08) are the visual climaxes — bug reveal
and TLC catching the bug. The small panels (02, 03, 11) are pacing
breathers. The medium panels carry narrative weight without shouting.

`FinishReading` corresponds to `panelIndex = 11`: terminal state where
Maya has internalized the methodology and acts on it. The action is
implicit — the comic ends, the reader continues.

## Invariant Preservation Strategy

| Invariant | Preservation mechanism |
|---|---|
| `TypeInvariant` | Each panel SVG is a single static file. `state`, `palette`, `panelIndex` are baked into the SVG at authoring time; the file's existence on disk is the proof. |
| `TransitionInvariant` | File naming convention `NN-*.svg` enforces monotonic `panelIndex`. Renaming or reordering breaks the `Comic.md` link list — visible diff. |
| `PaletteInvariant` | Each panel's background `<rect fill>` is a single hex value from STYLE.md. The author cannot use a palette element that doesn't belong to the state's mapping. |
| `PanelProgressInvariant` | The link order in `Comic.md` is the reading order. Skipping a panel requires deleting its link — visible diff. |

The type system (mkdocs strict mode, schema validation in Comic.md) does
the work. Runtime checks are not needed because the artifact is static.

## Test Obligations

Static SVG cannot be unit-tested the way TypeScript can. The verification
here is structural and visual:

1. **Link integrity** — `Comic.md` references each panel by path.
   `bin/validate-packet` (or a script in `implementation/`) walks the link
   list and confirms each `![Panel XX](../assets/comic-panels/XX-*.svg)`
   resolves to an existing file. A missing panel fails validation.

2. **Dimensions** — Each panel SVG has the documented `width` and `height`.
   A script reads `<svg width="N" height="M"` and asserts the dimensions
   match the table above. Climax panels must be 1000×800; breathers 600×400.

3. **Palette discipline** — Each panel's first `<rect fill="#......">` is
   within the palette set defined in `comic/STYLE.md`. A script greps
   the SVG, extracts the background hex, and checks membership.

4. **Maya consistency** — Maya's icon (simple silhouette, no face) must be
   present in panels 1, 2, 5, 6, 7, 9, 11. Panels 3, 4, 8, 10 are
   allowed to omit Maya (showing the world/system instead). The script
   checks a `data-maya="present"` marker attribute on the Maya `<g>` group.

5. **Reader test** — At least 4/5 readers must paraphrase the core idea
   after 2 minutes of reading. Recorded manually in `problem.md`
   acceptance section, not as a unit test.

## Runtime Checks

None. The artifact is a static SVG comic embedded in markdown. There is
no executable code, no async fetch, no state machine in the browser.

If the comic were to be served as an interactive web app (e.g. with
click-to-advance panels), then `panelIndex` would become a runtime
variable and `NextStateForPanel` would need to be enforced by a
reducer. That is **out of scope** for v2 — the comic is a comic, not
an interactive exhibit.

If the comic is later animated (panels appearing on scroll), then the
invariant `palette = PaletteForState(state)` becomes a CSS check
against the panel's current scroll position. Tracked as future work
under roadmap item 2.4, not part of this packet.

## Why This Refinement Stands on the Model

The model says: "the reader traverses 7 states across 11 panels; each
panel has a state, a palette, and a viewport size; the transitions are
fixed." The implementation says: "11 SVG files, each named with its
panel index, each painted with the state's palette, each sized by the
narrative weight." If the implementation drifts from the model, the
visible diff is in the file names, the palette hex values, and the
`width`/`height` attributes — exactly the things a code review notices.

The model is small (215 lines). The implementation is hand-drawn SVG.
The bridge between them is this document: a table that says, for every
panel, what state it depicts and what the file should look like.