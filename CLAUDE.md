# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Jekyll-based static site blog. Use these commands for development:

- `make serve` - Start local development server with live reload
- `make serveDrafts` - Start development server including draft posts (in `collections/_drafts/`)
- `make build` - Build the site for production
- `make update` - Update Ruby gem dependencies

All commands use `bundle exec jekyll` under the hood and require Ruby and Bundler to be installed.

## Architecture and Structure

This is a Jekyll static site using the Minima theme with a custom directory structure:

### Content Organization
- `collections/_posts/` - Published blog posts (markdown files with YYYY-MM-DD-title.md format)
- `collections/_drafts/` - Draft posts (not published, viewable only with `make serveDrafts`)
- `collections/_collections/` - Special collection pages (principles, product ideas, etc.)
- Main pages: `index.md`, `about.md`, `cv.md`, `now.md`, `values.md`, `collections.md`

### Layout System
- `_layouts/base.html` - Main layout template with nav and footer
- `_layouts/post.html` - Blog post template (extends base)
- `_layouts/cv.html` - CV-specific layout
- `_includes/` - Reusable components (nav, footer, head, etc.)

### Styling
- `assets/css/styles.scss` - Main stylesheet that imports all SASS partials
- `_sass/` - SASS partials (_base.scss, _layout.scss, _cv.scss, _katex.scss, _calculator.scss, _glitch.scss)
- Uses custom Tufte-inspired typography and layout styles

### Content Guidelines
- Posts use front matter with `layout: post`, `title`, `date`, and optional `tags`
- Tags: keep the vocabulary tight — reuse an existing tag rather than coining a
  near-synonym (`software engineering`, not `engineering`; `tooling`, not `tool`).
  `/tags` (`tags.md`) splits them into threads (2+ posts) and single labels, and
  every tag gets an anchor at `/tags/#<slugified-tag>`. `_includes/post-tags.html`
  renders the footer of each post: a "Filed under" line linking to those anchors,
  then one group per tag listing the other posts carrying it. Both are plain
  Liquid over `site.tags` — the site builds on GitHub Pages, so no plugin-generated
  tag pages (`jekyll-archives` and friends are unavailable).
- Date format: "YYYY-MM-DD" 
- Collections are configured in `_config.yml` with custom permalinks
- Assets (images, PDFs, diagrams) go in `assets/` subdirectories

### Per-page opt-in flags

Both are front-matter booleans that `_includes/head.html` turns into a script include.

- `math: true` — KaTeX. Write formulas as `$$...$$`; kramdown rewrites them to
  `\(...\)` / `\[...\]`, which is what `_includes/katex.html` matches.
- `calculator: true` — the declarative calculator engine, `assets/js/calculator.js`.

The calculator needs no JavaScript in the post. Name inputs, give outputs an
expression over those names, and the engine wires them up:

```html
<input class="calc-in" data-calc-name="salary" type="number" value="150000">
<span class="calc-out" data-calc-name="rate"
      data-calc="salary / hours" data-calc-format="money">99.73</span>
```

- `data-calc-group="kafka"` on outputs makes `sum(kafka)` available — that is how
  a column of line items becomes a total.
- `data-calc-format`: `num` (default) | `money` | `compact` | `pct`, with
  `data-calc-decimals` to override the default places. Currency symbols and units
  stay in the prose or the column header; formatters emit only a number.
- **The text inside an output is its no-JS fallback and must be the correct
  hand-computed figure.** It is also what is restored if the expression breaks.
- One namespace per page; two calculators in one post means prefixing names.
- A `.calc-out` must never sit inside `$$...$$` — KaTeX replaces that DOM when it
  renders. Use a `.calc-formula` block for a derivation with live values in it.
- Styling lives in `_sass/_calculator.scss`. Full contract at the top of
  `assets/js/calculator.js`.

`assets/js/llm-footprint.js` predates the engine and stays on its own code — its
unit-scaling and range formatting are genuinely post-specific.

### Key Configuration
- Site uses GitHub Pages compatible gems
- Collections directory is set to `collections/`
- Custom permalinks: `/:collection/:name`
- Excludes: Gemfile, Makefile, gemfiles/