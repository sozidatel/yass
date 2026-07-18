# Styling

Yass should work immediately, remain neutral, and still be easy to make native to a project's design language.

This document describes the `0.1.0` styling contract. The CSS in `src/yass.css`, the embedded browser CSS, and `dist/yass.css` use the same hooks.

## Two delivery modes

### Embedded base CSS

The normal browser artifacts contain the minimum CSS needed to function and inject it once per document. This protects the zero-build, one-file use case and prevents a broken intermediate state in which the native select is hidden but the custom control has no layout.

The embedded layer includes:

- safe box sizing;
- visually hidden native-select rules;
- trigger, popup, search, list, option, group, separator, empty, and status layout;
- fixed/top-layer positioning assumptions;
- keyboard focus visibility;
- scrolling and viewport constraints;
- neutral light/dark defaults based on system colors;
- no animated transitions that require a reduced-motion override.

It should not attempt to reproduce Bootstrap, Horošo, or any other application theme.

### Separate CSS

The release also ships the same base rules as `yass.css`. Projects can load that file and disable injection. This is useful for:

- strict asset pipelines;
- Content Security Policy management;
- combining/minifying styles in an existing system;
- inspecting and overriding the base layer explicitly.

The separate file is an alternative delivery of the base layer, not a second mandatory theme.

The browser bundle installs embedded styles before exposing the API, so select external-CSS mode before it loads:

```html
<link rel="stylesheet" href="/vendor/yass/yass.css">
<script>
    window.YassConfig = { injectStyles: false };
</script>
<script defer src="/vendor/yass/yass.js"></script>
```

For a nonced injected style, set `window.YassConfig = { nonce: currentNonce }` before the bundle. The configuration assignment itself must also comply with the site's `script-src` policy—for example, place it in an allowed external script or use the same permitted nonce. Calling `Yass.configure()` after load does not remove a style element that has already been installed.

## DOM and class hooks

The `0.1.0` anatomy is:

```text
.yass
├── select.yass__native
└── button.yass__trigger
    └── .yass__value

body
└── .yass__panel
    ├── input.yass__search
    ├── .yass__list
    │   ├── .yass__group
    │   ├── .yass__option.is-selected.is-active
    │   ├── .yass__separator
    │   └── .yass__empty
    └── .yass__status
```

An optional `.yass__icon` may contain text/emoji supplied as text. State classes such as `.is-active` and `.is-selected` should be treated as styling hooks, not queried by application business logic.

The current body-level panel is shared between instances. Project CSS must not assume that the panel is a descendant of the select's local form container.

### Wrapping labels

When markup uses `<label>Text <select>…</select></label>`, `0.1.0` moves the select into its enhancement wrapper and places that wrapper after the complete label. The label is temporarily connected to the trigger with `for`. This avoids an interactive button nested inside a label, but it can slightly change an inline/flex/grid layout that depended on the select being a label child. Style the adjacent `.yass` when necessary. `destroy()` restores the exact original select position and label attributes.

## Custom properties

The library reads namespaced variables instead of Horošo's `--horoso-*` tokens. Base CSS deliberately does **not** declare them globally: every use has a system-color or neutral fallback. This means a project's earlier `:root` declarations are not overwritten when embedded CSS is injected later.

| Variable | Base fallback |
| --- | --- |
| `--yass-color` | `CanvasText` |
| `--yass-muted-color` | `GrayText` |
| `--yass-background` | `Canvas` |
| `--yass-border-color` | `GrayText` |
| `--yass-accent` | `Highlight` |
| `--yass-accent-color` | `HighlightText` |
| `--yass-radius` | `0.5rem` |
| `--yass-shadow` | `0 0.8rem 2rem rgb(0 0 0 / 18%)` |

The set stays intentionally short. A project can target documented classes for more specific changes. As a `0.x` project, additions or refinements may still occur in minor releases and must be recorded in the changelog.

`--yass-depth` is an internal per-row value written by the component for hierarchy indentation. It is not a consumer theme token.

## Example project theme

```css
:root {
    --yass-background: #fff;
    --yass-color: #202124;
    --yass-muted-color: #6b7280;
    --yass-border-color: #a8adb5;
    --yass-accent: #d8e9ff;
    --yass-accent-color: #102a43;
    --yass-radius: 0.25rem;
}

@media (prefers-color-scheme: dark) {
    :root {
        --yass-background: #151412;
        --yass-color: #f5f2eb;
        --yass-muted-color: #b9b09f;
        --yass-border-color: #66625c;
        --yass-accent: #b9a66a;
        --yass-accent-color: #10100f;
    }
}
```

The trigger may be styled as the original dotted pseudo-link while the popup follows the project's form controls:

```css
:where(.yass__trigger) {
    color: inherit;
    border-bottom: 1px dotted currentColor;
}

:where(.yass__panel, .yass__search, .yass__list) {
    font: inherit;
}
```

Base selectors should use `:where()` where practical to keep specificity low. A consumer should not need `!important` merely to change color, radius, or spacing.

## Dark mode

The neutral theme sets `color-scheme: light dark` on the panel and uses system-color fallbacks so it remains legible before any project override. The shipped demo verifies that consumer tokens change the actual popup background between its light and dark themes. A project with explicit theme classes should define `--yass-*` variables on a scope visible to the shared panel.

Because the current panel lives under `body`, variables defined only on a nested form container will not reach it. Until the architecture becomes local or the library copies relevant tokens, place popup variables on `:root`, `body`, or the panel itself.

## Icons and rich content

`0.1.0` does not bundle an icon library or accept arbitrary HTML. A plain-text icon/emoji hook is sufficient for compatibility with the Horošo proof of concept. Projects that need complex icons can style labels externally after a future safe rendering contract is designed.

## No Shadow DOM

Shadow DOM would isolate base styles, but it would also make ordinary project theming, inherited typography, CSS variables, automated testing, and debugging harder. This component intentionally chooses stable ordinary DOM over encapsulation. The CSS prefix and low-specificity base layer provide the boundary.

## Content Security Policy

There are two independent CSP concerns.

### Injected `<style>`

The one-file build creates a style element. A nonce option can authorize that element where the site's CSP uses nonces. Alternatively, use the separate CSS and disable style injection.

### Style attributes

The proven implementation calculates popup geometry and hierarchy indentation at runtime and writes properties such as `left`, `top`, `width`, maximum height, and depth. Browsers expose those writes as inline styles. A nonce on the `<style>` element does **not** authorize them under a strict `style-src-attr 'none'` policy.

Therefore:

- separate CSS plus disabled injection supports CSPs that reject injected style elements but still permit these runtime style attributes;
- full support for `style-src-attr 'none'` is not yet implemented;
- before claiming strict-CSP compatibility, move dynamic values into an allowed stylesheet/CSSOM strategy or redesign positioning around Popover/anchoring with tested fallbacks.

This limitation must remain visible in release notes until a browser-tested solution exists.

## Compatibility promise

For `0.x`, class names and custom properties may still be refined between minor releases, with changes recorded in the changelog. Before `1.0`, select a documented stable subset and treat the rest of the generated DOM as internal.
