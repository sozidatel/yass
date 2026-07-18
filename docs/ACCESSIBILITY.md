# Accessibility

Yass is a custom interaction layered over a native select. That creates an obligation to match keyboard and assistive-technology behavior intentionally; visual similarity to a select is not enough.

This document records the implemented `0.1.0` keyboard/ARIA behavior and its current validation boundary. It does not claim formal WCAG conformance or complete screen-reader certification.

## Progressive baseline

Before JavaScript runs, the native select is the accessible control. If enhancement cannot initialize or the select is ineligible, it should remain untouched.

After successful enhancement, the native select remains the form-data source but is removed from the keyboard and accessibility interaction surface. The generated trigger/search/listbox represent it to the user. `destroy()` must restore the select's original attributes and label relationship.

Hiding the native select before the replacement is fully initialized would create an inaccessible failure state and should be avoided.

## Accessible name and description

The enhanced control derives its name in this order:

1. text referenced by `aria-labelledby`;
2. explicit `aria-label` on the select;
3. associated explicit or implicit `<label>` text;
4. select `name` as a last application-derived fallback;
5. configured `messages.fallbackLabel`.

An explicit label's `for` relationship is redirected to the generated trigger while enhanced and restored on destroy. An implicit wrapping label is likewise connected to the trigger, while the wrapper is placed after the whole label to avoid nesting a button inside it. This can slightly change layout; destroy restores the select's exact original position and label attributes.

`aria-describedby`, `aria-errormessage`, `aria-invalid`, and `aria-required` are mirrored to the active search as well as the trigger where relevant. When native required validation fires, focus is reasserted on the search after the browser's validation focus step so the user lands on the useful correction target.

Messages such as “search” or “results” are configurable/localizable. Standalone `0.1.0` defaults are English; Horošo supplies its own Russian interface text when it later migrates.

## Current interaction model

The proven implementation uses:

- a button-like trigger with `aria-haspopup="listbox"` and `aria-expanded`;
- a shared search input with `role="combobox"`, `aria-autocomplete="list"`, and `aria-controls`;
- a result container with `role="listbox"`;
- selectable rows with `role="option"` and `aria-selected`;
- `aria-activedescendant` on the search input for keyboard movement;
- a polite `role="status"` region for empty/result-count updates.

This is close to the ARIA combobox pattern but not yet certified as a complete implementation. In particular, the trigger and the actual combobox are different elements and the shared input is moved away from local document order.

## Keyboard contract

### Closed

| Key/action | `0.1.0` behavior |
| --- | --- |
| `Tab` / `Shift+Tab` focus | Focus the trigger and, by default, open immediately with focus in search |
| Pointer activation | Open and focus search |
| Focus when disabled | Trigger is not operable and popup does not open |

On macOS, Safari follows its keyboard-navigation preference when deciding whether plain `Tab` includes buttons. With “Press Tab to highlight each item on a webpage” disabled, Safari skips the generated button trigger; enabling that preference makes it part of normal Tab order. Yass preserves the native button behavior rather than overriding the user's browser setting.

Opening on focus is a deliberate product requirement inherited from the DrebedeNgi workflow. A future option may disable it for applications that prefer explicit activation.

### Open

| Key | `0.1.0` behavior |
| --- | --- |
| Printable text / editing keys | Edit query and refilter |
| `ArrowDown` / `ArrowUp` | Move active option, skipping context, separators, and disabled options |
| `Home` / `End` | Move to first/last selectable result |
| `Enter` | Choose active option; update native select; close; return focus |
| `Escape` | Cancel query/close without changing value; return focus |
| `Tab` | Close and continue to the next normal focus target |
| `Shift+Tab` | Close and continue to the previous normal focus target |

IME composition must not be interpreted as navigation or selection. Key handling should respect `isComposing` and the relevant browser composition fallback.

## Active, selected, and matching are different

- **Selected** is the native option currently chosen.
- **Active** is the selectable result that arrow keys/Enter currently target.
- **Matching** is an option directly matching the query.
- **Visible context** may be an ancestor shown to explain a matching child.

Context rows must never receive active-option semantics. A selectable ancestor displayed only because its child matches must not steal `Enter` from that child.

## Disabled options and groups

Disabled `<option>` and disabled `<optgroup>` descendants must not be navigable or selectable. Separators are presentation only.

A select that matches `:disabled` because it is inside a disabled `<fieldset>` is also non-operable, even without its own `disabled` attribute. Dynamic fieldset changes resynchronize the trigger and close an active popup.

The current `0.1.0` renders contextual group rows as presentation rather than modeling nested ARIA groups. Before `1.0`, test alternatives with screen readers and decide whether native optgroups should become `role="group"` with an accessible label or remain flattened context. Do not add group roles solely because they sound semantically richer; the resulting ownership and announcement behavior must be verified.

## Dynamic state and reset

- Disabling an enhanced select updates/disables its trigger and closes it if active.
- Effective disabling by an ancestor fieldset behaves the same way.
- Option mutation invalidates and rebuilds the searchable entries.
- External `input`/`change` events resynchronize the visible value.
- Form reset resynchronizes only after the browser applies native defaults, including a select associated to a non-ancestor form with `form="…"`.
- Hiding or detaching the active control closes the popup.
- Native/authored invalid, required, description, and error relationships are exposed on the generated interaction elements and validation opens/focuses a useful correction path.

These behaviors protect users who rely on keyboard focus and state announcements from seeing a stale custom view.

## Shared portal and manual Tab: known limitation

The current popup is appended to `body` to escape clipping containers. Focus moves from the trigger to that shared input, so the browser's natural next-focus calculation no longer starts beside the original select. The implementation reconstructs focus order for `Tab` and `Shift+Tab`.

The automated Chromium, Firefox, and WebKit suite verifies disabled fieldset skipping and the checked-member tab stop for a native radio group. A hands-on Safari smoke also verifies popup opening, EN/RU search, selection, native change output, and light/dark presentation. The approach still requires further testing for:

- positive `tabindex` values;
- elements in shadow roots;
- iframes;
- elements made inert or hidden by ancestors;
- elements whose focusability is implemented by custom widgets;
- browser-chrome boundary navigation.

A local combobox plus Popover/top-layer listbox may remove this workaround, but it is a future investigation.

## Required validation before a stable release

At minimum, exercise the component with:

- keyboard-only navigation in Chrome, Firefox, and Safari;
- VoiceOver with Safari on macOS and iOS;
- NVDA with Firefox and Chrome on Windows;
- high zoom/reflow and narrow/short visual viewports;
- forced colors/high-contrast mode;
- reduced motion;
- light and dark schemes;
- long labels, empty results, one result, disabled selected option, and nested context;
- required selects, form validation, reset, and dynamic disabling;
- pointer/touch interaction without accidental focus loss.

Automated DOM/ARIA assertions are valuable regression tests but do not replace screen-reader checks. Until this matrix is completed, documentation should say that the implementation follows the intended combobox/listbox pattern, not that it is universally accessible or standards-certified.
