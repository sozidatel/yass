# Roadmap

Yass has been extracted from a working Horošo component as a standalone `0.1.0` release dated 2026-07-19. It is not a feature-complete replacement for large combobox frameworks.

Checkboxes below describe verified release status and the work intentionally deferred beyond `0.1.0`.

## Evidence already obtained in Horošo

- [x] Progressive enhancement of native single selects.
- [x] Pseudo-link trigger and focus-to-open workflow.
- [x] Search field receives focus on open.
- [x] Case-insensitive substring search.
- [x] EN↔RU wrong-keyboard-layout variants (`цшту` → `wine`).
- [x] Arrow, `Home`/`End`, `Enter`, `Escape`, `Tab`, and `Shift+Tab` behavior on the proving page.
- [x] Native form submission and bubbling `input`/`change` integration.
- [x] Option hierarchy/context without a matching child losing `Enter` to its ancestor.
- [x] Dynamic disabled/options synchronization and form reset.
- [x] Dark/light, responsive-table, mobile, and tiny-viewport browser checks.
- [x] Warehouse, account, supplier, category, product, banking-rule, and staff use cases exercised in one application.

These checks validate the original behavior, not `1.0` API stability or assistive-technology conformance.

## Public `0.1.0` status

### Code boundary

- [x] Remove `Horoso` names, Bootstrap-specific behavior, and application color variables from the reusable source.
- [x] Use Yass as the project/global name, `@sozidatel/yass` as the npm package, and `yass-select` as the repository name.
- [x] Prefix the documented `0.1.0` data-attribute contract with `data-yass-*`.
- [x] Keep the native select as the sole form-state source.
- [x] Define the minimal lifecycle API: global enhancement/configuration/style helpers and instance open/close/refresh/sync/destroy.
- [x] Keep search helpers outside the supported API under an explicitly internal `__test` ESM namespace.
- [x] Provide `enhanceAll(scope)` for dynamic insertion without a permanent global document mutation observer.

### Distribution

- [x] Browser-ready unminified JS with base CSS embedded.
- [x] Minified browser JS.
- [x] ESM/module artifact for npm and bundlers.
- [x] Separate CSS identical to the embedded functional base.
- [ ] Source maps if they remain small and useful.
- [x] Deterministic build producing all documented artifacts.
- [x] Zero-build copy/paste demo served as static files.
- [x] Publish as `@sozidatel/yass`, after npm rejected the otherwise-free unscoped name as too similar to an existing package.
- [x] Ship TypeScript declarations for the supported lifecycle API.

### Styling

- [x] Neutral system-color light/dark defaults.
- [x] Low-specificity base selectors using `:where()`.
- [x] Documented `.yass*` anatomy and a small `--yass-*` token set for `0.1.0`.
- [x] No Shadow DOM.
- [ ] Verify that body-level popup styling works when application variables are scoped.
- [x] Remove all Horošo and Bootstrap assumptions.

### Configuration

- [x] Localizable search, empty, result-count, search-label, and fallback-label messages.
- [x] `openOnFocus` option, enabled by default for the original workflow.
- [x] EN/RU layout correction toggle.
- [x] Base-style injection toggle.
- [x] Optional nonce for the injected style element.
- [x] Clearly state that strict `style-src-attr 'none'` remains unsupported while geometry/depth use style properties.

### Quality

- [x] Unit tests for normalization, layout conversion, direct matches, ancestor context, and disabled rows.
- [x] Chromium, Firefox, and WebKit lifecycle tests for auto-enhancement, exact destroy/label restoration, native events/FormData, internal and external-form reset, option mutation, hidden/detached controls, explicit `tabindex`, duplicate-bundle loading, and one shared popup/API switching.
- [x] Cross-engine accessibility/state tests for explicit and implicit labels, accessible-name priority (`aria-labelledby` before `aria-label`/label/name), description/error/invalid/required mirroring, required-validation focus, effective disabled fieldsets, and radio-group Tab behavior.
- [x] Cross-engine interaction tests for focus-to-open, search/layout correction, native `option[label]`, arrow/Enter navigation, pointer selection, light/dark styling, external CSS/nonce mode, text-only security, and a 320×240 visual viewport.
- [x] Explicit scroll/resize/repositioning browser tests beyond the existing tiny-viewport and Horošo responsive-overflow evidence.
- [x] Hands-on Safari click, search, selection, native event, and light/dark smoke; document its plain-Tab preference boundary.
- [ ] Hands-on Chrome and Firefox desktop smoke tests beyond their automated engine coverage.
- [x] Browser security check that option text and icon metadata cannot inject executable HTML/script.
- [x] Public package metadata, exports, type declarations, license, and dated changelog.
- [x] Document local release checks, annotated tagging, package contents, and build-free handoff in [RELEASING.md](RELEASING.md).
- [x] Exercise the annotated `v0.1.0` tag procedure in the standalone repository.
- [x] `npm test`: Node/unit/package tests plus the complete behavior suite in Chromium, Firefox, and WebKit.
- [x] `npm pack --dry-run`: includes package metadata, README, changelog, license, full `docs/`, and the intended `dist/` artifacts while excluding source, tests, demo, and development tooling.
- [x] GitHub Pages demo and release workflow with npm trusted-publishing support, provenance, release assets, and checksums.
- [ ] Make all documentation examples executable against the final build.

## Known `0.1` limitations to document

- The current architecture uses one shared body-level popup and permits only one open instance.
- `Tab` order is manually continued because focus is inside the shared popup.
- A wrapping-label trigger is placed after the complete label, which can slightly alter inline layout while enhanced; destroy restores the exact original structure.
- Variables scoped only to a local form do not naturally inherit into the portal.
- Deep hierarchy needs explicit metadata or indentation conventions; native optgroup alone supplies one level.
- ARIA group semantics and the split trigger/combobox model need assistive-technology validation.
- Injected CSS can use a nonce or be replaced by a linked file, but runtime style attributes remain incompatible with `style-src-attr 'none'`.
- No async data, multiselect, fuzzy search, virtualization, arbitrary HTML renderer, or framework wrappers.

## After `0.1.0`: prove independence

- [ ] Integrate the release in a second real project with a different CSS system.
- [ ] Record which configuration was genuinely needed; reject speculative options.
- [ ] Test localization outside the original Russian interface.
- [ ] Test strict application CSP and decide whether eliminating style attributes is a release goal.
- [ ] Run the accessibility matrix in [ACCESSIBILITY.md](ACCESSIBILITY.md).
- [ ] Validate performance with realistically large option lists before promising a limit.

## Architecture investigation for a later minor release

- [ ] Prototype a local `input[role="combobox"]` that appears as the pseudo-link when closed.
- [ ] Prototype a listbox using HTML Popover/top layer with fallback.
- [ ] Compare native focus order, overflow escape, viewport placement, inherited styles, directionality, and browser support against the shared portal.
- [ ] Adopt it only if receipt-page and second-project behavior remain equal or better.

This investigation should not delay a useful `0.1.0` if the current portal's limitations are clearly stated and tested.

## Path to `1.0`

A stable `1.0` should wait until:

- two independent production projects have used the component;
- public API, data attributes, CSS hooks, and events have stopped changing;
- browser and assistive-technology support statements are evidence-based;
- the popup/focus architecture is intentionally accepted or replaced;
- CSP support is described precisely;
- upgrade notes exist for every breaking `0.x` change.

## Migration back into Horošo

Horošo should migrate only after the external repository produces a tagged release.

1. Preserve the current Horošo behavior/tests as a parity baseline.
2. Release the standalone package and record an integrity/version identifier.
3. Copy the browser artifact (and separate CSS only if chosen) into a versioned Horošo public vendor path. Do not add a runtime CDN dependency.
4. Update the base template include and data attributes/API calls.
5. Re-run receipt entry first: account, supplier, warehouse, categories, products, dynamic disabled state, warehouse preference, submission, and reset.
6. Re-run banking and MyFin integrations.
7. Test light/dark, desktop/mobile/tiny viewport, keyboard, and no-JS fallback.
8. Remove the Horošo-local implementation only after parity is proven.

Warehouse preference remains application logic throughout this migration. The library must neither read nor write that preference.
