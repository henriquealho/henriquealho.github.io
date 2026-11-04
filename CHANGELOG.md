# Changelog

All notable changes to this site are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versioning rules

The site's public interface is its published URLs and data files:
the pages (`/`, `/docs.html`, `/projects.html`) and the JSON files under `/resources/`.

- **MAJOR**: a published URL is removed or renamed, or the shape of a JSON file
  under `/resources/` changes in a way that breaks existing consumers.
- **MINOR**: a backwards-compatible addition, such as a new page, section or feature,
  or new optional fields in a JSON file.
- **PATCH**: backwards-compatible fixes, content updates and visual tweaks.

Each release is tagged on `master` as `vMAJOR.MINOR.PATCH` after its pull request is merged.

## [Unreleased]

## [1.1.0] - 2026-11-03

### Added

- Projects page (`/projects.html`) rendered from `resources/projects.json`, ordered
  by most recent `date`, with a featured image, `version` and `status`
  (`finished`, `in-development`, `on-hold`) for each project.
- Shared top navigation (Home, Projects, Docs) on every page, with a skip link.
- `404.html` page with a link back home.
- Projects icon next to the social links on the home page.
- Canonical, description and Open Graph tags on the Docs and Projects pages.
- GoatCounter analytics on every page.
- Visible keyboard focus styles and `prefers-reduced-motion` support.

### Changed

- JavaScript split per page (`home.js`, `docs.js`, `projects.js`, `cards.js`)
  instead of a single `main.js`.
- Quotes are loaded once from a relative path and rotation pauses while the tab is hidden.
- The GitHub name and bio only replace the static text when the API responds.
- Sitemap now lists the Projects page.

### Removed

- jQuery, Popper and the Bootstrap 4.0 JavaScript bundle (only the Bootstrap 4.5.2 CSS is used).

### Fixed

- Random quote index could go out of range and leave the quote empty.
- `docs.html` loaded `quotes.json` as a script, causing a JavaScript error.
- Pages rendered in quirks mode because the `<!DOCTYPE html>` was missing.
- Missing `alt` text, accessible labels and `rel="noopener"` on external links.

## [1.0.0] - 2026-03-24

- Baseline: home page with rotating programming quotes and the Docs page.

[Unreleased]: https://github.com/henriquealho/henriquealho.github.io/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/henriquealho/henriquealho.github.io/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/henriquealho/henriquealho.github.io/releases/tag/v1.0.0
