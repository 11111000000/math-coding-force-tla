# Refinement: Landing Page Refactor (2026-06)

This refactor turns `Landing/index.html` from a static page into a
small artifact that obeys the same protocols the methodology imposes
on every other piece of work in the repository.

## State Mapping

The "state" of a landing page is a triple: `(active_locale,
pipeline_hover_index, viewport_size)`. The previous implementation
encoded `active_locale` in `localStorage` and let CSS handle hover
implicitly. The new implementation makes these three explicit so the
mechanical verifier can probe them.

| Model concept            | HTML/JS realization                              |
| ------------------------ | ------------------------------------------------ |
| `active_locale ∈ Locales` | `localStorage["mcf-lang"]` (string)            |
| `pipeline_hover_index`   | CSS `:hover` and `:focus-within` on `.stage-card`|
| `viewport_size`          | CSS media queries; no JS state                   |

## Operation Mapping

| Model action           | Code location                                     |
| ---------------------- | ------------------------------------------------- |
| `SetLocale(l)`         | `setLang(l)` in `<script>` of `Landing/index.html`|
| `HoverStage(i)`        | CSS `:hover` / `:focus` on `.stage-card:nth-child(i)` |
| `RevealDetail(i)`      | CSS shows `.stage-detail` of the hovered card     |

There is no explicit `Reset` — locale reset happens via the same
`SetLocale` action, and hover reset is a CSS property.

## Invariant Preservation

`NoAnglicismInRu` is preserved by hand-curated Russian strings in
`data-lang="ru"` blocks. The mechanical check is a grep that fails
build if a banned token appears in the Russian context.

`HeroBadgeFitsText` is preserved by `width: max-content; max-width:
100%` on `.hero-badge` so the element shrinks to its text. The
previous CSS used `display: inline-block` with hard-coded padding
that produced a frame noticeably wider than the text on certain
locales (the long "Разработка вокруг артефактов" expanded the box
more than "Artifact-Centered Development" did).

`StageHasAllFields` is preserved by the new `.stage-card` markup: a
numeric `.stage-num`, an `<img>` illustration, three `.stage-name`
elements with `data-lang`, a `.stage-file`, and a hidden
`.stage-detail` block that becomes visible on hover/focus.

`NoVerifiedEvidenceSection` is preserved by the absence of any
element with `class="proof-grid"` in the new DOM. Packet icons that
used to live there are now attached to the principles grid as
optional badges.

## Test Obligation Mapping

| Model property          | Test                                         |
| ----------------------- | -------------------------------------------- |
| `NoAnglicismInRu`       | grep test (see `implementation/test-i18n.sh`)|
| `HeroBadgeFitsText`     | Playwright DOM width assertion                |
| `StageHasAllFields`     | Playwright DOM presence assertion             |
| `PrincipleHasAllFields` | Playwright DOM presence assertion             |
| `NoVerifiedEvidenceSection` | Playwright `page.locator` negative check  |
| `HoverRevealsDetail`    | Playwright hover + screenshot                |

## Runtime-Check Mapping

The only runtime check the page performs is the language switch
itself, which already lives in `setLang()` inside the inline
`<script>`. The refactor does not introduce new runtime checks; it
preserves the existing one.

## Why this is a refinement, not a rewrite

The DOM tree is reshaped, but the public contract — the URLs, the
language switch, the section order, the inline SVG library — is
preserved. The CSS variable palette is unchanged. The three locales
remain present. A user who has bookmarked any internal anchor or who
relies on the language switch continues to see the same affordances
after the refactor.
