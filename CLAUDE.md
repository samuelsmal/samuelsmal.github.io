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
- `_sass/` - SASS partials (_base.scss, _layout.scss, _cv.scss, _glitch.scss)
- Uses custom Tufte-inspired typography and layout styles

### Content Guidelines
- Posts use front matter with `layout: post`, `title`, `date`, and optional `tags`
- Date format: "YYYY-MM-DD" 
- Collections are configured in `_config.yml` with custom permalinks
- Assets (images, PDFs, diagrams) go in `assets/` subdirectories

### Key Configuration
- Site uses GitHub Pages compatible gems
- Collections directory is set to `collections/`
- Custom permalinks: `/:collection/:name`
- Excludes: Gemfile, Makefile, gemfiles/