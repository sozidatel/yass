# Design

This document describes the implemented `0.1.0` contract and distinguishes it from architectural work that remains open. Automated cross-browser coverage is present, while hands-on browser and assistive-technology validation is not complete.

## Principles

### Preserve the platform

The native single `<select>` is the model and form control. Yass is a view and interaction layer around it.

- The select retains its `name`, selected option, validation constraints, and submission behavior.
- Application code may continue to read or write `select.value`.
- A user selection updates the native select and emits bubbling `input` and `change` events when the value changes.
- Programmatic mutations and form reset are reflected back into the enhanced presentation.
- `destroy()` should return the page to a usable native select and restore attributes/labels changed during enhancement.

This is progressive enhancement, not a parallel form-state system.

### Build-free for consumers

The release includes a browser-ready script that can be copied to a server and loaded with `<script defer>`. Development uses a build to test, minify, and create module artifacts; the consuming website does not need it.

### One purpose, few options

The component searches and selects from an existing local list. Features that turn it into a remote autocomplete, token editor, rendering framework, or data store are outside `0.1.0`.

### Safe text rendering

Labels, extra search text, and icons supplied as text must be rendered with text nodes/`textContent`, not interpolated with `innerHTML`. A future arbitrary HTML renderer would enlarge the security contract and is not planned for `0.1.0`.

### Styleable without Shadow DOM

The component uses ordinary DOM, stable classes, and custom properties. This allows a project to inherit typography, override visual tokens, inspect the result, and integrate it with existing design systems. Avoiding Shadow DOM is a deliberate product decision, not an implementation omission.

## Eligibility

The `0.1.0` implementation accepts a native `<select>` that:

- is not `multiple`;
- does not use `size > 1`;
- contains local `<option>` and optionally `<optgroup>` children.

Ineligible selects remain untouched and usable.

## Enhancement lifecycle

The implemented lifecycle is:

1. Find an eligible select explicitly passed to `enhance()` or marked with `data-yass` during `enhanceAll()`/automatic startup.
2. Build searchable entries from options, groups, and hierarchy metadata.
3. Insert a compact trigger next to the visually hidden native select.
4. Resolve the accessible name from `aria-labelledby`, `aria-label`, explicit/implicit labels, `name`, or fallback, in that priority order; redirect associated labels to the trigger while enhanced.
5. Synchronize selection, effective disabled state (including ancestor fieldsets), required/invalid state, authored description/error relationships, hidden state, and option mutations.
6. Open the searchable popup on click or, by default, focus.
7. On choice, update the native select, synchronize the trigger, close, and emit native events if the value changed.
8. On `destroy()`, disconnect observers/listeners and restore the original select and label state.

Dynamic callers should invoke `enhanceAll(container)` after inserting new marked selects. A permanent document-wide mutation observer is not required for `0.1.0`; avoiding one keeps ownership and cleanup predictable.

For an implicit wrapping label, the wrapper/trigger is placed after the complete label rather than putting an interactive button inside it. This can alter inline layout while enhanced. The original parent and next sibling are retained, so `destroy()` restores the select's exact position and the label's original `for` state.

## Search model

The search algorithm is intentionally simple:

1. Normalize strings with Unicode compatibility normalization when available.
2. Convert non-breaking whitespace to ordinary spaces, collapse whitespace, trim, and lowercase.
3. Build query variants from the literal input and, when enabled, EN↔RU keyboard-layout conversion.
4. Match when any non-empty variant is a substring of the normalized searchable text.

It is not fuzzy search. `wine` may match `Natural Wine`; `whine` does not match `Wine` merely because it is close.

Searchable text may include an option's native `label` property (including `<option label="…">`), optional extra keywords, and ancestor labels. Ancestors of a direct match may be rendered for context but are not part of that match's keyboard-navigation set.

## Hierarchy and entry kinds

The Horošo prototype encountered four useful entry kinds:

- **option** — a selectable value;
- **group/context** — a non-navigable label that explains child options;
- **separator** — visual structure only;
- **disabled option** — visible context when appropriate, never selectable.

Native `<optgroup>` is the preferred portable representation for one level. Existing server-rendered data may also encode deeper hierarchy with leading non-breaking spaces or explicit `data-yass-depth` metadata. The standalone contract uses namespaced attributes rather than exposing Horošo's unprefixed prototype attributes.

## Popup architecture: current state

The proven implementation uses one shared popup attached to `document.body`:

- one search input;
- one listbox;
- one polite live status region;
- fixed positioning relative to the active trigger;
- visual-viewport clamping above or below the trigger;
- one open instance at a time.

This solves real overflow clipping in responsive tables and keeps the DOM footprint small. It also has costs:

- focus leaves the trigger's local DOM position;
- `Tab` and `Shift+Tab` require manual continuation logic;
- scoped typography, direction, and CSS variables do not automatically follow the originating subtree;
- multiple documents/iframes and unusual positive `tabindex` arrangements need careful testing;
- position and depth are currently written as style properties.

These are known `0.1` limitations, not hidden implementation details.

## Future architecture investigation

Before a stable `1.0`, investigate a local `input[role="combobox"]` that:

- looks like the pseudo-link when closed;
- becomes the actual search input when open;
- owns a locally defined listbox;
- uses the HTML Popover API/top layer where support and fallback behavior are acceptable.

That design could preserve natural focus order and local style inheritance while avoiding overflow clipping. It must be validated against the existing mobile, responsive-table, keyboard, screen-reader, and fallback behavior before replacing the shared portal. It is an investigation, not a committed `0.1.0` feature.

## Public API

The `0.1.0` browser global/default-module surface is deliberately small:

```js
Yass.version;
Yass.enhance(select, options);
Yass.enhanceAll(scope, options);
Yass.get(select);
Yass.configure(options);
Yass.injectStyles(options);
```

Instance lifecycle:

```js
instance.open();
instance.close(returnFocus);
instance.refresh();
instance.sync();
instance.destroy();
```

Configuration:

| Option | Purpose |
| --- | --- |
| `messages.searchPlaceholder` | Search input placeholder |
| `messages.noResults` | Empty-result text |
| `messages.results` | Result-count announcement; string with `{count}` or callback |
| `messages.searchLabel` | Search accessible label; string with `{label}` or callback |
| `messages.fallbackLabel` | Accessible-name fallback when the select has no usable label/name |
| `openOnFocus` | Preserve the fast tab-to-search workflow or require explicit activation |
| `keyboardLayout` | Enable or disable the EN/RU conversion helper |
| `injectStyles` | Use embedded base CSS or project-managed CSS |
| `nonce` | Attach a project-supplied nonce to the injected `<style>` element |

Global defaults can be changed with `configure()`, while options passed to `enhance()`/`enhanceAll()` apply to that enhancement call. `injectStyles()` supports explicit style setup. Search-normalization helpers remain implementation details unless deliberately promoted in a later release.

The `0.1.0` declarative contract is:

- select: `data-yass`, `data-yass-placeholder`, `data-yass-empty`, `data-yass-open-on-focus`, `data-yass-keyboard-layout`;
- option metadata: `data-yass-search`, `data-yass-depth`, `data-yass-icon`, `data-yass-kind`;
- optgroup metadata: `data-yass-search`, `data-yass-depth`, `data-yass-icon`; its kind is always `group`.

The names are intentionally library-prefixed; the unprefixed metadata used by the first Horošo copy is not part of the standalone contract.

## State synchronization

The enhanced view tracks:

- selected option and visible label;
- effective disabled state from the select or an ancestor disabled fieldset;
- disabled option/optgroup state;
- option insertion, removal, label, value, and relevant metadata;
- `required`/invalid presentation on both trigger and active search;
- `aria-describedby`, `aria-errormessage`, and accessible-label changes when synchronization runs;
- hidden state and active-control connection;
- form reset after native reset behavior completes, including controls associated to an external form through the `form` attribute.

When the application changes `select.value`, it should dispatch `input` or `change`, or call `instance.refresh()`/a documented synchronization method. Observing JavaScript property assignment itself would require invasive property patching and is not planned.

## Error and boundary behavior

- Enhancing the same select twice returns the existing instance rather than duplicating DOM.
- Enhancing an ineligible or missing element fails harmlessly.
- Opening a disabled control does nothing.
- Disabling the active select closes its popup.
- If an active trigger is detached, the shared popup closes when positioning is next evaluated.
- No-result state removes a stale active descendant.
- Choosing the already selected option closes without emitting a fake value-change event.
- Loading the same `0.1.0` browser bundle twice reuses the stored API and does not duplicate the panel, global listeners, enhancement, or styles.
- Manual `Tab` skips effectively disabled fieldset descendants and treats the checked member of a radio group as its tab stop.

## Non-goals

The following are deliberately excluded from `0.1.0`:

- asynchronous fetching and server-side search;
- multiselect, tags, free text, or option creation;
- fuzzy ranking and generic typo correction;
- list virtualization;
- arbitrary HTML rendering;
- framework wrappers;
- bundled icons;
- application persistence or “recent choice” policy.

Keeping these boundaries is central to the component's value: it remains a small, inspectable improvement to the web platform rather than a second form framework.
