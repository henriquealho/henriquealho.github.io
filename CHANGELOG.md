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

## [2026.11.05] - 2026-11-05

- Switched the site's release versioning from SemVer to CalVer `YYYY.MM.DD`.

### Added

- A compact Medium feature in the existing home-page quote area, rotating through
  recent articles from the Medium RSS feed without adding another page; feed results
  include a short text excerpt, are cached locally, and failed requests are throttled
  to avoid repeated rate limits.
- Integrated Programming Quotes into the personal site at `/quotes.html`, with
  deep links, browsing controls, and local quote data.
- Projects page (`/projects.html`) rendered from `resources/projects.json`, ordered
  by most recent `date`, with a featured image, `version` and `status`
  (`finished`, `in-development`, `on-hold`) for each project.
- Shared top navigation on every page, with a skip link.
- Quotes link in shared navigation and sitemap.
- Responsive touch targets, matching 404 styling, and social metadata across pages.
- Animated lightbulb loading states for quotes, projects and resources.
- `404.html` page with a link back home.
- Projects icon next to the social links on the home page.
- Canonical, description and Open Graph tags on the Docs and Projects pages.
- GoatCounter analytics on every page.
- Visible keyboard focus styles and `prefers-reduced-motion` support.
- Custom lamp favicon in SVG format.
- Date-based project visibility using `isVisible` ISO date/time values; Super Tuga is
  scheduled to become visible at 20:00 UTC on 2026-11-05.

### Changed

- Replaced the static lamp background with custom vector bulb artwork distributed
  across both sides of the page.
- Lowered the desktop lamp background while preserving its mobile positioning.
- Mobile backgrounds now keep the lamp illustration visible on narrow screens.
- Quotes use a compact fixed-height panel with a 140-character limit.
- JavaScript split per page (`home.js`, `docs.js`, `projects.js`, `cards.js`)
  instead of a single `main.js`.
- Quotes are loaded once from a relative path and rotation pauses while the tab is hidden.
- The GitHub name and bio only replace the static text when the API responds.
- Sitemap now lists the Projects page.

### Removed

- Quotes longer than 140 characters from the quote collection.
- jQuery, Popper and the Bootstrap 4.0 JavaScript bundle (only the Bootstrap 4.5.2 CSS is used).

### Fixed

- Random quote index could go out of range and leave the quote empty.
- `docs.html` loaded `quotes.json` as a script, causing a JavaScript error.
- Pages rendered in quirks mode because the `<!DOCTYPE html>` was missing.
- Missing `alt` text, accessible labels and `rel="noopener"` on external links.

## [2026.03.24] - 2026-03-24

- Baseline: home page with rotating programming quotes and the Docs page.

[Unreleased]: https://github.com/henriquealho/henriquealho.github.io/compare/v2026.11.05...HEAD
[2026.11.05]: https://github.com/henriquealho/henriquealho.github.io/releases/tag/v2026.11.05
[2026.03.24]: https://github.com/henriquealho/henriquealho.github.io/releases/tag/v2026.03.24
