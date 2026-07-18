# Origin and product context

## The interaction that was wanted

The starting point was a control used by DrebedeNgi for long lists of accounts and categories.

Collapsed, it reads as an ordinary selected value with a dotted underline and link-like pointer. It does not consume the visual space of a conventional form field. Focusing it through normal tab navigation opens the list immediately and places the cursor in a search field.

Once open:

- typing filters by case-insensitive substring;
- `ArrowUp` and `ArrowDown` move the active choice;
- `Enter` chooses it;
- `Escape` closes the popup;
- `Tab` and `Shift+Tab` continue normal form navigation;
- typing under the wrong keyboard layout still works in the common EN/RU case, so `цшту` can find `wine`.

The goal was not a fashionable custom dropdown. It was a compact, fast keyboard tool that could replace unwieldy native dropdowns on otherwise conventional server-rendered pages.

There was also a deployment constraint: Horošo is intentionally easy to publish by uploading ready files. It already has an occasional build step for Font Awesome assets, but this component should not turn every consumer deployment into a Node/build workflow. That is why the extracted project may use tooling to produce releases while its browser consumers receive a finished, self-contained file.

## Why Horošo was a useful proving ground

Horošo initially needed the control most on receipt entry. That screen combines several independent data sources and interaction rules:

- a DrebedeNgi account;
- a Syrve supplier;
- a Syrve warehouse;
- one DrebedeNgi category per receipt item;
- one Syrve product and multiplier per receipt item.

Some lists are short, some contain dozens or hundreds of entries, and categories have hierarchy. Options may be disabled because they are headings or because another selection makes a field temporarily unavailable. Existing page code listens for native `change` events to reveal fields, disable related controls, and recalculate mappings.

The component therefore had to coexist with the page rather than take ownership of it. The native select had to remain the submitted control and the existing JavaScript had to keep receiving the same events.

The first integration was then reused for other long internal Horošo lists, including banking rules and MyFin staff selection. Adding the warehouse control, even though its list was short, also demonstrated a visual benefit: all related values align and behave consistently.

## Real edge cases discovered there

The Horošo implementation and browser checks exposed several issues that are easy to miss in a demo:

### Selectable ancestors

A category ancestor may itself be selectable while also providing context for a child. Searching for the child should show both rows but make only the direct match navigable. Otherwise `Enter` can choose the parent merely because it was rendered first.

### Responsive clipping

The receipt items live inside responsive table structures. A popup placed as a normal descendant can be clipped by overflow. The extracted `0.1.0` avoids that by using one shared, fixed-position panel attached to `body` and clamping it to the visual viewport.

### Tiny viewports

It is not enough for the popup to fit a desktop dark theme. Search and at least a usable part of the result list must remain visible on narrow and short screens, including when the mobile visual viewport differs from `window.innerHeight`.

### Dynamic form state

Supplier choices can disable the warehouse, products, and multipliers. Option lists and labels can also change. The enhanced presentation must resynchronize without becoming a second source of state.

### Reset and submission

A browser form reset changes the native select after the reset event. Synchronization must happen after the native reset completes. Form submission must contain the native option value, not text scraped from the custom UI.

### Keyboard continuity

Opening on focus moves focus from a local trigger to a shared search input in `body`. Continuing `Tab` in document order is no longer automatic, so the current implementation calculates the next focusable element. That works for the proven page but is architectural debt for a general library.

## What belongs to the library—and what does not

The reusable part is:

- enhancement and restoration of a native single select;
- search, hierarchy, selection, keyboard, pointer, layout, state synchronization, and styling hooks.

Application policy remains outside:

- which account, supplier, or warehouse should be selected initially;
- remembering the last warehouse;
- fetching DrebedeNgi or Syrve data;
- category mapping and receipt processing;
- authorization, persistence, and validation beyond native select constraints.

Horošo's “remember the last warehouse” behavior is deliberately not part of Yass. The application selects an option; the component reflects it.

## Why extract it now

The implementation is small and dependency-free, but it already contains knowledge earned from a real workflow: native compatibility, layout conversion, hierarchy, dynamic state, responsive positioning, dark mode, and keyboard behavior. Leaving it embedded in Horošo would make that knowledge difficult to reuse and easy to regress.

Yass now carries that reusable knowledge in its own repository and release artifacts. Horošo should return as a consumer of a versioned external artifact after parity has been demonstrated; the application should not depend on an unversioned development build.
