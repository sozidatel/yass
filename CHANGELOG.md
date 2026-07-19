# Changelog

All notable released changes will be documented in this file.

The format is based on Keep a Changelog, and versions follow Semantic Versioning for the documented API.

## [Unreleased]

No changes yet.

## [0.1.1] - 2026-07-19

### Changed

- Renamed the GitHub repository from `yass-select` to `yass` for consistency with the project and npm package.
- Updated source, issue, and GitHub Pages metadata to the canonical `sozidatel/yass` locations.
- Hardened the release workflow to pin npm, verify the post-pack build, fail closed on registry errors, and publish scoped packages explicitly as public.

### Release status

- This metadata-only patch keeps the public API and behavior of `0.1.0` unchanged.
- The release is published through npm Trusted Publishing so the GitHub Actions identity and provenance are exercised on a real version.

## [0.1.0] - 2026-07-19

### Added

- Dependency-free progressive enhancement for native single selects.
- Pseudo-link trigger, focus-to-open workflow, shared searchable popup, pointer selection, and full keyboard flow.
- Case-insensitive substring matching with optional EN↔RU wrong-layout correction.
- Hierarchical option context, disabled groups/options, separators, explicit depth, extra search text, and text icons.
- Native form values, native `option[label]`, internal/external-form reset, hidden/detached state, option mutation synchronization, and bubbling `input`/`change` events.
- Accessible-name priority for `aria-labelledby`, `aria-label`, explicit/implicit labels, `name`, and fallback; dynamic label synchronization; mirrored descriptions, error messages, invalid/required state; and corrected required-validation focus timing.
- Effective disabled-fieldset handling, checked-radio Tab behavior, explicit `tabindex` preservation, exact destroy restoration, and duplicate-bundle initialization protection.
- Automatic `select[data-yass]` enhancement and explicit global/default-module lifecycle API.
- Embedded neutral base CSS, separate CSS mode, styling hooks, dark/light system colors, forced-color focus treatment, and nonce support.
- Browser, minified browser, ESM, standalone CSS, and TypeScript declaration artifacts.
- Static and hosted demo, deterministic build, cross-browser CI, release provenance workflow, automated Chromium, Firefox, and WebKit behavior tests, and a hands-on Safari smoke.
- Documentation of the DrebedeNgi interaction inspiration and Horošo receipt-entry proving ground.
- Design, styling, accessibility, CSP, migration, roadmap, and non-goal documentation.
- MIT license.

### Release status

- Public `0.1.0` release tagged `v0.1.0` under the Yass name and `@sozidatel/yass` package.
- All distribution artifacts build deterministically and the npm package dry-run contains only the intended release files.
- Automated behavior coverage runs in Chromium, Firefox, and WebKit; assistive-technology validation remains open as tracked in [docs/ROADMAP.md](docs/ROADMAP.md).
- Wrapping-label enhancement places the trigger after the complete label and may slightly alter inline layout; `destroy()` restores the original structure exactly.
