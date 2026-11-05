# Changelog

All notable changes to this site are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this site follows Calendar Versioning (CalVer).

## Versioning rules

Site releases use the `YYYY.MM.DD` format, tagged as `vYYYY.MM.DD`
(for example, `v2026.11.05`). The date is the release date, and there is at most
one release per calendar day.
The current released version is recorded in [`VERSION`](./VERSION).

Each release is tagged on `master` after its pull request is merged. Existing
SemVer tags and released changelog entries are retained as history.

Project versions shown on the Projects page belong to those projects and are
independent of this site's release versioning.

## [Unreleased]

- Switched the site's release versioning from SemVer to CalVer `YYYY.MM.DD`.

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

## [2026.03.24] - 2026-03-24

- Baseline: home page with rotating programming quotes and the Docs page.

[Unreleased]: https://github.com/henriquealho/henriquealho.github.io/compare/v2026.03.24...HEAD
[2026.03.24]: https://github.com/henriquealho/henriquealho.github.io/releases/tag/v2026.03.24
