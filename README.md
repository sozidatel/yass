# Yass

**Yet Another Searchable Select.**

Small, dependency-free progressive enhancement for a native single `<select>`.
It is intended for long account, category, product, contact, warehouse, and similar lists where a conventional dropdown is difficult to scan.

The control is collapsed as a compact pseudo-link. When opened, it focuses a search field and lets the user filter and choose with either the keyboard or pointer. The native `<select>` remains the source of truth for form submission and application events.

> **Release:** `0.1.1`, dated 2026-07-19 and tagged `v0.1.1`. The source, browser and ESM distributions, type declarations, [live demo](https://sozidatel.github.io/yass/), documentation, and automated tests are versioned together.

## Why it exists

The original interaction came from DrebedeNgi: a selected value looks like a dotted-underlined link, focusing it opens an immediately searchable list, and the whole flow works comfortably without reaching for the mouse. Horošo then became the proving ground on its receipt-entry page, with real lists of DrebedeNgi accounts and categories and Syrve suppliers, warehouses, and products.

That integration forced the component to handle more than a pretty dropdown:

- case-insensitive substring search;
- an EN/RU keyboard-layout mistake, such as `цшту` finding `wine`;
- keyboard navigation with arrows, `Home`, `End`, `Enter`, `Escape`, `Tab`, and `Shift+Tab`;
- nested categories, context rows, separators, and disabled choices;
- native form values plus bubbling `input` and `change` events;
- changes to `disabled`, options, labels, and selection after enhancement;
- form reset;
- responsive tables, dark mode, mobile screens, and very small viewports.

The result is useful outside Horošo. This subproject records both the code and the reasoning needed to continue it independently instead of leaving that knowledge hidden in one application template.

See [Origin](docs/ORIGIN.md) for the full history and [Design](docs/DESIGN.md) for the architectural contract.

## Install from npm

```sh
npm install @sozidatel/yass
```

Importing the package installs the embedded functional CSS and automatically enhances marked selects once the document is ready:

```js
import Yass from '@sozidatel/yass';

Yass.enhance(document.querySelector('#account'));
```

The npm entry point is ESM-only; CommonJS applications can use dynamic `import()`. TypeScript declarations ship with the package. Applications that manage CSS separately can import `@sozidatel/yass/style.css` and set `window.YassConfig = { injectStyles: false }` before loading the module.

## Build-free use

The consumer experience is deliberately build-free:

```html
<label for="account">Account</label>
<select id="account" name="account" data-yass>
    <option value="">— no value —</option>
    <option value="cash">Cash</option>
    <option value="wine">Wine</option>
</select>

<script defer src="/vendor/yass/yass.js"></script>
```

The browser-ready script discovers `select[data-yass]`, injects the minimum required CSS once, and enhances eligible single selects. A project can download and serve the release file directly, without npm and without running a build.

This is the `0.1.0` contract. Compatibility remains pre-`1.0`; the documented known limitations and open assistive-technology validation still apply.

## Progressive enhancement

The original `<select>` is never replaced as form data. The enhanced control reads and writes it.

- With JavaScript, the searchable presentation is shown.
- Without JavaScript, the native select remains usable.
- Existing `name`, `value`, `required`, `disabled`, labels, validation, form submission, and reset semantics continue to belong to the select.
- Choosing a different option dispatches bubbling `input` and `change` events on the select, so existing application code does not need a second integration path.

This scope is limited to ordinary single selects. A multiple select or `size > 1` is left untouched.

The enhanced accessible name follows authored HTML in this order: `aria-labelledby`, `aria-label`, associated explicit or implicit `<label>`, select `name`, then the configured fallback. The trigger and active search mirror relevant `aria-describedby`, `aria-errormessage`, invalid, and required state. A select disabled by an ancestor `<fieldset>` is treated as disabled even when its own `disabled` attribute is absent.

Form reset also works for a select associated through `form="…"` outside the form subtree. Hiding or detaching an active control closes the shared popup.

> **Known `0.1` layout nuance:** when a `<label>` wraps its `<select>`, enhancement places the generated trigger after the complete label to avoid nesting an interactive button inside it. This can slightly change inline layout compared with the unenhanced wrapping label. `destroy()` restores the select to its exact original parent/sibling position and restores the label relationship.

## Public API

The `0.1.x` contract is intentionally small:

```js
Yass.version; // "0.1.1"
Yass.enhance(select, options);
Yass.enhanceAll(scope, options);
Yass.get(select);
Yass.configure(options);
Yass.injectStyles(options);
```

An enhanced instance exposes:

```js
instance.open();
instance.close(returnFocus);
instance.refresh();
instance.sync();
instance.destroy();
```

Automatic enhancement through `data-yass` remains the default zero-configuration path. The explicit API is for dynamically inserted fields, application-controlled lifecycle, and tests.

Configuration is intentionally narrow:

- `messages`: `searchPlaceholder`, `noResults`, `results`, `searchLabel`, and `fallbackLabel`;
- `openOnFocus`;
- `keyboardLayout` for EN/RU wrong-layout correction;
- `injectStyles`;
- `nonce` for the injected `<style>` element.

The first four message fields may be strings or callbacks. `searchPlaceholder` and `searchLabel` receive `{ label }`, `results` receives `{ count }`, and `noResults` receives an empty object. String messages can use the corresponding `{label}` or `{count}` placeholder. `configure()` changes defaults for controls enhanced after the call; existing instances retain their resolved options. Per-select options passed to `enhance()`/`enhanceAll()` override the defaults. `injectStyles()` exists for applications that initialize styles explicitly.

The English defaults are `Search`, `No results`, `{count} results`, `{label}: search`, and `Select`. Applications can replace all five messages globally or per enhancement.

HTML configuration uses namespaced attributes:

```html
<select
    data-yass
    data-yass-placeholder="Find an account"
    data-yass-empty="No matching account"
    data-yass-open-on-focus="true"
    data-yass-keyboard-layout="true"
>
    <option
        value="wine"
        data-yass-search="natural cellar"
        data-yass-depth="1"
        data-yass-icon="🍷"
        data-yass-kind="option"
    >Wine</option>
</select>
```

An `<optgroup>` supports `data-yass-search`, `data-yass-depth`, and `data-yass-icon`. Its native role is always a group, so `data-yass-kind` is an option-only override. JavaScript options are preferable for application-wide defaults; data attributes are useful in server-rendered markup.

For Boolean data attributes, an absent/empty value uses the configured default; `0`, `false`, `no`, and `off` disable the behavior. Option `data-yass-kind` accepts `option`, `group`, or `separator`.

The ESM artifact exposes an explicitly internal `__test` namespace for focused tests. It is not supported public API and is not covered by semantic-versioning guarantees.

## Search and hierarchy

Search is intentionally predictable rather than fuzzy:

- Unicode-compatible, whitespace-normalized, case-insensitive substring matching;
- optional EN↔RU keyboard-layout variants;
- an option may provide extra searchable text without changing its visible label;
- a matching child may bring its ancestors into view as non-navigable context;
- disabled options, groups, and separators are not selectable and must not steal `Enter` from a matching child.

The component can infer hierarchy from leading non-breaking spaces and can also accept explicit `data-yass-depth` metadata. The namespaced `data-yass-search`, `data-yass-icon`, and `data-yass-kind` attributes carry optional extra metadata without exposing the Horošo prototype's generic attribute names.

Visible and searchable option text follows the native `option.label` property, including an authored `<option label="…">`; it does not assume that `textContent` is the final browser label.

## Styling and CSP

The default browser files contain the functional base CSS, so omitting a stylesheet cannot leave a half-visible native and custom control. The release also includes `yass.css` with the same base rules for projects that manage CSS themselves or use a restrictive Content Security Policy.

Because the browser bundle installs its embedded CSS as it loads, external-CSS mode must be selected before that script:

```html
<link rel="stylesheet" href="/vendor/yass/yass.css">
<script>
    window.YassConfig = { injectStyles: false };
</script>
<script defer src="/vendor/yass/yass.js"></script>
```

Under a CSP, put that configuration in an allowed external script or authorize it with the site's normal nonce/hash policy. `Yass.configure()` is still useful for interaction defaults, but calling it after the browser bundle loads cannot retroactively prevent the initial style injection.

Projects can restyle the component with documented classes and `--yass-*` custom properties. Shadow DOM is intentionally not used: ordinary DOM is easier to theme, debug, and integrate with an existing design system.

The strict-CSP story has two parts:

1. Pre-load `YassConfig.injectStyles: false` plus the standalone CSS avoids injecting a `<style>` element.
2. The current positioning and indentation implementation also writes element style properties. Therefore a policy with `style-src-attr 'none'` is a known limitation until those writes are removed or moved to an allowed stylesheet mechanism.

See [Styling](docs/STYLING.md) for the hooks and honest CSP boundary.

## Accessibility status

The component aims at the ARIA combobox/listbox interaction model, preserves an accessible name from the select's label, tracks the active option, announces result state, and supports full keyboard selection. The current shared search field and body-level popup still require a focused assistive-technology audit before `1.0`.

Read [Accessibility](docs/ACCESSIBILITY.md) for the keyboard contract, current implementation notes, and test matrix still required.

## Distribution

The release contains artifacts for both build-free and package-managed consumers:

```text
dist/
  yass.js       # browser file, base CSS embedded
  yass.min.js
  yass.mjs      # module/bundler entry
  yass.css      # separate/CSP-managed styling
  yass.d.ts     # TypeScript declarations
  style.d.ts    # CSS import declaration
```

Creating those artifacts may use a development build. **Using them must not require a build.** A project such as Horošo should keep a versioned local release file under its own public assets rather than depending on a third-party CDN at runtime.

## Development in this repository

Development tooling requires Node.js 20 or newer. It is not a consumer requirement.

```sh
npm ci
npm run build
npm run test:unit
npx playwright install chromium firefox webkit
npm run test:browser
npm run demo
```

`npm test` builds the distribution and runs the Node/unit/package suite plus the same browser behavior suite in Chromium, Firefox, and WebKit. The demo server opens the static project at `http://127.0.0.1:4173/`. No application framework or backend is involved.

## Deliberate non-goals for `0.1.0`

- asynchronous or remote data sources;
- multiple selection, tags, or token entry;
- fuzzy ranking or typo correction beyond EN/RU keyboard-layout conversion;
- virtualization for enormous datasets;
- arbitrary HTML render callbacks;
- framework-specific React, Vue, or similar wrappers;
- a bundled icon system;
- persistence of application choices.

The last point is important: Horošo remembers the last Syrve warehouse because the application owns that preference. Yass only presents and changes a select value.

## Documents

- [ORIGIN.md](docs/ORIGIN.md) — what prompted the component and what Horošo proved.
- [DESIGN.md](docs/DESIGN.md) — principles, data flow, public API, and known architectural debt.
- [STYLING.md](docs/STYLING.md) — CSS layers, hooks, dark mode, portal implications, and CSP.
- [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) — semantics, keyboard behavior, and validation still required.
- [ROADMAP.md](docs/ROADMAP.md) — verified `0.1.0` status, a second real integration, `1.0`, and migration back into Horošo.
- [RELEASING.md](docs/RELEASING.md) — release checks, tagging, and build-free consumer handoff.
- [CHANGELOG.md](CHANGELOG.md) — release history.

## License

[MIT](LICENSE), copyright 2026 Soz Nov.
