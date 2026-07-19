/*! Yass v0.1.1 */

// src/yass.js
var VERSION = "0.1.1";
var SELECTOR = "select[data-yass]";
var STYLE_SELECTOR = "style[data-yass-styles]";
var ENGLISH_KEYS = "`qwertyuiop[]asdfghjkl;'zxcvbnm,./";
var RUSSIAN_KEYS = "ёйцукенгшщзхъфывапролджэячсмитьбю.";
var host = typeof globalThis === "undefined" ? {} : globalThis;
var documentObject = host.document || null;
var librarySymbol = typeof Symbol === "function" ? /* @__PURE__ */ Symbol.for("yass.library") : null;
var storedApi = librarySymbol ? host[librarySymbol] || null : null;
var existingApi = storedApi?.version === VERSION ? storedApi : null;
var embeddedStyles = true ? ":where(\n    .yass,\n    .yass *,\n    .yass__panel,\n    .yass__panel *\n) {\n    box-sizing: border-box;\n}\n\n:where(.yass) {\n    display: inline-flex;\n    max-width: 100%;\n    color: var(--yass-color, CanvasText);\n    vertical-align: baseline;\n}\n\n:where(.yass[hidden]) {\n    display: none !important;\n}\n\n:where(.yass__native) {\n    position: absolute !important;\n    width: 1px !important;\n    height: 1px !important;\n    padding: 0 !important;\n    margin: -1px !important;\n    overflow: hidden !important;\n    clip: rect(0, 0, 0, 0) !important;\n    clip-path: inset(50%) !important;\n    white-space: nowrap !important;\n    border: 0 !important;\n}\n\n:where(.yass__trigger) {\n    display: inline-flex;\n    align-items: baseline;\n    min-width: 0;\n    max-width: 100%;\n    padding: 0 0.08em 0.08em;\n    color: inherit;\n    font: inherit;\n    line-height: inherit;\n    text-align: start;\n    background: transparent;\n    border: 0;\n    border-bottom: 1px dotted currentColor;\n    border-radius: 0;\n    cursor: pointer;\n}\n\n:where(.yass__trigger:hover) {\n    color: var(--yass-accent, Highlight);\n}\n\n:where(.yass__trigger:focus-visible) {\n    color: var(--yass-color, CanvasText);\n    outline: 2px solid var(--yass-accent, Highlight);\n    outline-offset: 3px;\n}\n\n:where(.yass__trigger:disabled) {\n    color: var(--yass-muted-color, GrayText);\n    border-bottom-color: transparent;\n    cursor: default;\n}\n\n:where(.yass__value) {\n    min-width: 0;\n    max-width: 100%;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n:where(.yass__panel) {\n    position: fixed;\n    z-index: 1000;\n    display: grid;\n    gap: 0.5rem;\n    padding: 0.55rem;\n    overflow: hidden;\n    color: var(--yass-color, CanvasText);\n    color-scheme: light dark;\n    font: inherit;\n    background: var(--yass-background, Canvas);\n    border: 1px solid var(--yass-border-color, GrayText);\n    border-radius: var(--yass-radius, 0.5rem);\n    box-shadow: var(--yass-shadow, 0 0.8rem 2rem rgb(0 0 0 / 18%));\n}\n\n:where(.yass__panel[hidden]) {\n    display: none !important;\n}\n\n:where(.yass__search) {\n    width: 100%;\n    min-height: 2.6rem;\n    padding: 0.45rem 0.65rem;\n    color: var(--yass-color, CanvasText);\n    font: inherit;\n    background: var(--yass-background, Canvas);\n    border: 1px solid var(--yass-border-color, GrayText);\n    border-radius: var(--yass-radius, 0.5rem);\n}\n\n:where(.yass__search::placeholder) {\n    color: var(--yass-muted-color, GrayText);\n    opacity: 1;\n}\n\n:where(.yass__search:focus) {\n    border-color: var(--yass-accent, Highlight);\n    outline: 2px solid var(--yass-accent, Highlight);\n    outline-offset: 1px;\n}\n\n:where(.yass__list) {\n    min-height: 2.3rem;\n    max-height: 20rem;\n    margin: 0;\n    padding: 0.2rem 0;\n    overflow: auto;\n    overscroll-behavior: contain;\n    color: var(--yass-color, CanvasText);\n    background: var(--yass-background, Canvas);\n    border: 1px solid var(--yass-border-color, GrayText);\n    border-radius: var(--yass-radius, 0.5rem);\n}\n\n:where(.yass__option, .yass__group) {\n    min-width: 0;\n    padding: 0.42rem 0.65rem;\n    padding-inline-start: calc(0.65rem + var(--yass-depth, 0) * 1rem);\n    overflow-wrap: anywhere;\n}\n\n:where(.yass__option) {\n    display: flex;\n    align-items: baseline;\n    gap: 0.45rem;\n    cursor: pointer;\n}\n\n:where(.yass__option.is-selected) {\n    font-weight: 650;\n}\n\n:where(.yass__option.is-active) {\n    color: var(--yass-accent-color, HighlightText);\n    background: var(--yass-accent, Highlight);\n}\n\n:where(.yass__group) {\n    color: var(--yass-muted-color, GrayText);\n    font-weight: 650;\n}\n\n:where(.yass__separator) {\n    height: 1px;\n    margin: 0.35rem 0.65rem;\n    background: var(--yass-border-color, GrayText);\n    opacity: 0.6;\n}\n\n:where(.yass__icon) {\n    flex: 0 0 auto;\n}\n\n:where(.yass__option mark, .yass__group mark) {\n    padding: 0;\n    color: MarkText;\n    background: Mark;\n}\n\n:where(.yass__option.is-active mark) {\n    color: inherit;\n    font-weight: 700;\n    background: transparent;\n    text-decoration: underline;\n}\n\n:where(.yass__empty) {\n    padding: 0.75rem;\n    color: var(--yass-muted-color, GrayText);\n}\n\n:where(.yass__status) {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    clip-path: inset(50%);\n    white-space: nowrap;\n    border: 0;\n}\n\n@media (forced-colors: active) {\n    :where(.yass__option.is-active) {\n        outline: 1px solid HighlightText;\n        outline-offset: -1px;\n    }\n}\n" : "";
var builtInDefaults = {
  messages: {
    searchPlaceholder: "Search",
    noResults: "No results",
    results: "{count} results",
    searchLabel: "{label}: search",
    fallbackLabel: "Select"
  },
  openOnFocus: true,
  keyboardLayout: true,
  injectStyles: true,
  nonce: null
};
var registry = /* @__PURE__ */ new WeakMap();
var defaults = mergeOptions(builtInDefaults, host.YassConfig || {});
var serial = 0;
var activeInstance = null;
var panel = null;
var searchInput = null;
var listbox = null;
var status = null;
var optionNodes = /* @__PURE__ */ new Map();
var positionFrame = 0;
var activeConnectionObserver = null;
function mergeOptions(base, overrides) {
  const source = overrides && typeof overrides === "object" ? overrides : {};
  return {
    messages: {
      ...base.messages,
      ...source.messages && typeof source.messages === "object" ? source.messages : {}
    },
    openOnFocus: source.openOnFocus === void 0 ? base.openOnFocus : Boolean(source.openOnFocus),
    keyboardLayout: source.keyboardLayout === void 0 ? base.keyboardLayout : Boolean(source.keyboardLayout),
    injectStyles: source.injectStyles === void 0 ? base.injectStyles : Boolean(source.injectStyles),
    nonce: source.nonce === void 0 ? base.nonce : source.nonce
  };
}
function parseBoolean(value, fallback) {
  if (value === void 0 || value === null || value === "") {
    return fallback;
  }
  return !["0", "false", "no", "off"].includes(String(value).trim().toLowerCase());
}
function optionsFor(select, options) {
  const resolved = mergeOptions(defaults, options || {});
  const dataset = select.dataset;
  if (dataset.yassPlaceholder !== void 0) {
    resolved.messages.searchPlaceholder = dataset.yassPlaceholder;
  }
  if (dataset.yassEmpty !== void 0) {
    resolved.messages.noResults = dataset.yassEmpty;
  }
  resolved.openOnFocus = parseBoolean(dataset.yassOpenOnFocus, resolved.openOnFocus);
  resolved.keyboardLayout = parseBoolean(dataset.yassKeyboardLayout, resolved.keyboardLayout);
  return resolved;
}
function formatMessage(message, parameters) {
  if (typeof message === "function") {
    return String(message(parameters) ?? "");
  }
  return String(message ?? "").replace(/\{(\w+)\}/gu, (_, key) => String(parameters[key] ?? ""));
}
function normalizeSearchText(value) {
  const source = String(value ?? "");
  const compatible = typeof source.normalize === "function" ? source.normalize("NFKC") : source;
  return compatible.replace(/\u00a0/gu, " ").replace(/\s+/gu, " ").trim().toLowerCase();
}
function convertKeyboardLayout(value, from, to) {
  return Array.from(String(value ?? ""), (character) => {
    const index = from.indexOf(character);
    return index === -1 ? character : to[index];
  }).join("");
}
function keyboardLayoutVariants(value, enabled = true) {
  const normalized = normalizeSearchText(value);
  if (!normalized) {
    return [];
  }
  if (!enabled) {
    return [normalized];
  }
  return Array.from(new Set([
    normalized,
    normalizeSearchText(convertKeyboardLayout(normalized, RUSSIAN_KEYS, ENGLISH_KEYS)),
    normalizeSearchText(convertKeyboardLayout(normalized, ENGLISH_KEYS, RUSSIAN_KEYS))
  ].filter(Boolean)));
}
function matchesSearch(text, query, keyboardLayout = true) {
  const variants = keyboardLayoutVariants(query, keyboardLayout);
  const normalizedText = normalizeSearchText(text);
  return variants.length === 0 || variants.some((variant) => normalizedText.includes(variant));
}
function cleanLabel(value) {
  return String(value ?? "").replace(/\u00a0/gu, " ").replace(/^\s+/u, "").replace(/\s+/gu, " ").trim();
}
function optionDepth(option, offset) {
  const explicit = Number.parseInt(option.dataset.yassDepth || "", 10);
  if (Number.isFinite(explicit) && explicit >= 0) {
    return offset + explicit;
  }
  const label = option.label || "";
  const leading = label.match(/^[\u00a0 ]+/u);
  return offset + (leading ? Math.floor(Array.from(leading[0]).length / 4) : 0);
}
function isSeparator(label) {
  return /^[\s\-–—_\u2500-\u257f]+$/u.test(label);
}
function optionEntry(option, depthOffset) {
  const label = cleanLabel(option.label || "");
  const parentDisabled = option.parentElement?.tagName === "OPTGROUP" && option.parentElement.disabled;
  const disabled = option.disabled || parentDisabled;
  let kind = option.dataset.yassKind || "";
  if (!["option", "group", "separator"].includes(kind)) {
    kind = disabled ? isSeparator(label) ? "separator" : "group" : "option";
  }
  return {
    option,
    label,
    value: option.value,
    depth: optionDepth(option, depthOffset),
    kind,
    selectable: kind === "option" && !disabled,
    icon: option.dataset.yassIcon || "",
    extraSearch: option.dataset.yassSearch || "",
    ancestors: [],
    searchText: "",
    normalizedSearchText: ""
  };
}
function groupEntry(group) {
  return {
    option: null,
    label: cleanLabel(group.label),
    value: "",
    depth: Math.max(0, Number.parseInt(group.dataset.yassDepth || "0", 10) || 0),
    kind: "group",
    selectable: false,
    icon: group.dataset.yassIcon || "",
    extraSearch: group.dataset.yassSearch || "",
    ancestors: [],
    searchText: "",
    normalizedSearchText: ""
  };
}
function buildEntries(select) {
  const entries = [];
  Array.from(select.children).forEach((child) => {
    if (child.tagName === "OPTGROUP") {
      const heading = groupEntry(child);
      entries.push(heading);
      Array.from(child.children).forEach((option) => {
        if (option.tagName === "OPTION") {
          entries.push(optionEntry(option, heading.depth + 1));
        }
      });
    } else if (child.tagName === "OPTION") {
      entries.push(optionEntry(child, 0));
    }
  });
  const hierarchy = [];
  entries.forEach((entry, index) => {
    while (hierarchy.length > 0 && hierarchy[hierarchy.length - 1].depth >= entry.depth) {
      hierarchy.pop();
    }
    entry.ancestors = hierarchy.map((ancestor) => ancestor.index);
    const path = entry.ancestors.flatMap((ancestorIndex) => {
      const ancestor = entries[ancestorIndex];
      return [ancestor.label, ancestor.extraSearch];
    });
    entry.searchText = path.concat([entry.label, entry.extraSearch]).join(" ");
    entry.normalizedSearchText = normalizeSearchText(entry.searchText);
    if (entry.kind !== "separator") {
      hierarchy.push({ index, depth: entry.depth });
    }
  });
  return entries;
}
function filterEntries(entries, query, keyboardLayout = true) {
  const variants = keyboardLayoutVariants(query, keyboardLayout);
  if (variants.length === 0) {
    return {
      visibleIndexes: entries.map((_, index) => index),
      matchingIndexes: entries.reduce((indexes, entry, index) => {
        if (entry.selectable) {
          indexes.push(index);
        }
        return indexes;
      }, [])
    };
  }
  const visible = /* @__PURE__ */ new Set();
  const matchingIndexes = [];
  entries.forEach((entry, index) => {
    if (!entry.selectable || !variants.some((variant) => entry.normalizedSearchText.includes(variant))) {
      return;
    }
    matchingIndexes.push(index);
    visible.add(index);
    entry.ancestors.forEach((ancestorIndex) => visible.add(ancestorIndex));
  });
  return {
    visibleIndexes: entries.reduce((indexes, entry, index) => {
      if (visible.has(index) && entry.kind !== "separator") {
        indexes.push(index);
      }
      return indexes;
    }, []),
    matchingIndexes
  };
}
function selectedLabel(select, fallback) {
  const selected = select.options[select.selectedIndex];
  return selected ? cleanLabel(selected.label || "") : fallback;
}
function labelText(label) {
  const copy = label.cloneNode(true);
  copy.querySelectorAll("button, input, output, script, select, style, textarea").forEach((node) => node.remove());
  return cleanLabel(copy.textContent || "");
}
function labelledByElements(select) {
  const ids = (select.getAttribute("aria-labelledby") || "").trim().split(/\s+/u).filter(Boolean);
  return ids.map((id) => select.ownerDocument.getElementById(id)).filter(Boolean);
}
function labelledByText(select) {
  return labelledByElements(select).map((element) => cleanLabel(element.textContent || "")).filter(Boolean).join(" ");
}
function accessibleLabel(select, fallback, associatedLabels = null) {
  const referenced = labelledByText(select);
  if (referenced) {
    return referenced;
  }
  const explicit = select.getAttribute("aria-label");
  if (explicit) {
    return explicit;
  }
  const labels = associatedLabels || (select.labels ? Array.from(select.labels) : []);
  const text = labels.map(labelText).filter(Boolean).join(", ");
  return text || select.name || fallback;
}
function isEffectivelyDisabled(select) {
  return select.disabled || select.matches(":disabled");
}
function invalidState(select) {
  const authored = select.getAttribute("aria-invalid");
  if (authored && authored !== "false") {
    return authored;
  }
  return select.matches(":invalid") ? "true" : "false";
}
function copyAttribute(source, target, name) {
  const value = source.getAttribute(name);
  if (value) {
    target.setAttribute(name, value);
  } else {
    target.removeAttribute(name);
  }
}
function createElement(name, className) {
  const element = documentObject.createElement(name);
  if (className) {
    element.className = className;
  }
  return element;
}
function injectStyles(options = {}) {
  if (!documentObject || !embeddedStyles) {
    return null;
  }
  const existing = documentObject.querySelector(STYLE_SELECTOR);
  if (existing) {
    return existing;
  }
  const style = documentObject.createElement("style");
  style.dataset.yassStyles = "";
  const nonce = options.nonce ?? defaults.nonce;
  if (nonce) {
    style.setAttribute("nonce", String(nonce));
  }
  style.textContent = embeddedStyles;
  (documentObject.head || documentObject.documentElement).append(style);
  return style;
}
function ensurePanel() {
  if (panel || !documentObject?.body) {
    return;
  }
  panel = createElement("div", "yass__panel");
  panel.dataset.yassPanel = "";
  panel.hidden = true;
  searchInput = createElement("input", "yass__search");
  searchInput.type = "search";
  searchInput.autocomplete = "off";
  searchInput.spellcheck = false;
  searchInput.setAttribute("role", "combobox");
  searchInput.setAttribute("aria-autocomplete", "list");
  searchInput.setAttribute("aria-expanded", "false");
  listbox = createElement("div", "yass__list");
  listbox.id = `yass-listbox-${Math.random().toString(36).slice(2, 9)}`;
  listbox.setAttribute("role", "listbox");
  searchInput.setAttribute("aria-controls", listbox.id);
  status = createElement("div", "yass__status");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  panel.append(searchInput, listbox, status);
  documentObject.body.append(panel);
  searchInput.addEventListener("input", () => {
    if (activeInstance) {
      renderActive(normalizeSearchText(searchInput.value) === "");
    }
  });
  searchInput.addEventListener("keydown", onSearchKeydown);
  listbox.addEventListener("pointerdown", (event) => {
    if (event.target.closest?.(".yass__option")) {
      event.preventDefault();
    }
  });
  listbox.addEventListener("click", (event) => {
    const option = event.target.closest?.(".yass__option");
    if (option && activeInstance) {
      activeInstance.choose(Number.parseInt(option.dataset.entryIndex || "", 10));
    }
  });
}
function appendHighlightedText(container, label, query, keyboardLayout) {
  const variants = keyboardLayoutVariants(query, keyboardLayout);
  const normalized = normalizeSearchText(label);
  let match = null;
  variants.some((variant) => {
    const index = normalized.indexOf(variant);
    if (index !== -1) {
      match = { index, length: variant.length };
      return true;
    }
    return false;
  });
  if (!match || match.index + match.length > label.length) {
    container.textContent = label;
    return;
  }
  container.append(documentObject.createTextNode(label.slice(0, match.index)));
  const mark = createElement("mark");
  mark.textContent = label.slice(match.index, match.index + match.length);
  container.append(mark, documentObject.createTextNode(label.slice(match.index + match.length)));
}
function renderEntry(instance, entry, index, query) {
  if (entry.kind === "separator") {
    const separator = createElement("div", "yass__separator");
    separator.setAttribute("role", "presentation");
    return separator;
  }
  const navigable = instance.navigableIndexSet.has(index);
  const item = createElement("div", navigable ? "yass__option" : "yass__group");
  item.style.setProperty("--yass-depth", String(entry.depth));
  if (navigable) {
    item.id = `yass-option-${instance.id}-${index}`;
    item.dataset.entryIndex = String(index);
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", entry.option?.selected ? "true" : "false");
    if (entry.option?.selected) {
      item.classList.add("is-selected");
    }
    optionNodes.set(index, item);
  } else {
    item.setAttribute("role", "presentation");
  }
  if (entry.icon) {
    const icon = createElement("span", "yass__icon");
    icon.textContent = entry.icon;
    icon.setAttribute("aria-hidden", "true");
    item.append(icon);
  }
  const text = createElement("span");
  appendHighlightedText(text, entry.label, query, instance.options.keyboardLayout);
  item.append(text);
  return item;
}
function renderActive(preferSelected) {
  if (!activeInstance) {
    return;
  }
  const instance = activeInstance;
  if (instance.dirty) {
    instance.refresh(false);
  }
  const query = searchInput.value;
  const filtered = filterEntries(instance.entries, query, instance.options.keyboardLayout);
  instance.visibleIndexes = filtered.visibleIndexes;
  instance.navigableIndexes = filtered.matchingIndexes;
  instance.navigableIndexSet = new Set(filtered.matchingIndexes);
  optionNodes = /* @__PURE__ */ new Map();
  listbox.replaceChildren();
  instance.visibleIndexes.forEach((index) => {
    listbox.append(renderEntry(instance, instance.entries[index], index, query));
  });
  if (instance.navigableIndexes.length === 0) {
    const empty = createElement("div", "yass__empty");
    empty.textContent = formatMessage(instance.options.messages.noResults, {});
    empty.setAttribute("role", "presentation");
    listbox.append(empty);
    status.textContent = empty.textContent;
    instance.activeEntryIndex = -1;
    searchInput.removeAttribute("aria-activedescendant");
    return;
  }
  status.textContent = formatMessage(instance.options.messages.results, {
    count: instance.navigableIndexes.length
  });
  let nextActive = instance.navigableIndexes[0];
  if (preferSelected) {
    const selectedIndex = instance.navigableIndexes.find((index) => instance.entries[index].option?.selected);
    if (selectedIndex !== void 0) {
      nextActive = selectedIndex;
    }
  }
  setActive(nextActive, true);
}
function setActive(entryIndex, shouldScroll) {
  if (!activeInstance || !optionNodes.has(entryIndex)) {
    return;
  }
  optionNodes.forEach((node2) => node2.classList.remove("is-active"));
  const node = optionNodes.get(entryIndex);
  node.classList.add("is-active");
  activeInstance.activeEntryIndex = entryIndex;
  searchInput.setAttribute("aria-activedescendant", node.id);
  if (shouldScroll) {
    host.requestAnimationFrame(() => node.scrollIntoView({ block: "nearest" }));
  }
}
function moveActive(direction) {
  if (!activeInstance || activeInstance.navigableIndexes.length === 0) {
    return;
  }
  const indexes = activeInstance.navigableIndexes;
  const current = indexes.indexOf(activeInstance.activeEntryIndex);
  const target = current === -1 ? direction > 0 ? 0 : indexes.length - 1 : Math.max(0, Math.min(indexes.length - 1, current + direction));
  setActive(indexes[target], true);
}
function focusableElements() {
  const candidates = Array.from(documentObject.querySelectorAll(
    'a[href], button, input, select, textarea, summary, iframe, [contenteditable="true"], [tabindex]'
  )).filter((element) => {
    if (panel.contains(element) || element.matches(":disabled") || element.tabIndex < 0) {
      return false;
    }
    const style = host.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && !element.closest("[hidden], [inert]") && element.getClientRects().length > 0;
  });
  return candidates.filter((element) => {
    if (element.tagName !== "INPUT" || element.type !== "radio" || !element.name) {
      return true;
    }
    const group = candidates.filter((candidate) => candidate.tagName === "INPUT" && candidate.type === "radio" && candidate.name === element.name && candidate.form === element.form);
    const checked = group.find((candidate) => candidate.checked);
    return checked ? element === checked : element === group[0];
  }).sort((left, right) => {
    const leftIndex = left.tabIndex > 0 ? left.tabIndex : Number.MAX_SAFE_INTEGER;
    const rightIndex = right.tabIndex > 0 ? right.tabIndex : Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}
function moveFocusFromTrigger(instance, backwards) {
  const focusables = focusableElements();
  const current = focusables.indexOf(instance.trigger);
  const target = focusables[current + (backwards ? -1 : 1)];
  if (target) {
    target.focus();
    return true;
  }
  return false;
}
function onSearchKeydown(event) {
  if (!activeInstance || event.isComposing || event.keyCode === 229) {
    return;
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveActive(1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveActive(-1);
  } else if (event.key === "Home") {
    event.preventDefault();
    const first = activeInstance.navigableIndexes[0];
    if (first !== void 0) {
      setActive(first, true);
    }
  } else if (event.key === "End") {
    event.preventDefault();
    const indexes = activeInstance.navigableIndexes;
    if (indexes.length > 0) {
      setActive(indexes[indexes.length - 1], true);
    }
  } else if (event.key === "Enter") {
    event.preventDefault();
    activeInstance.choose(activeInstance.activeEntryIndex);
  } else if (event.key === "Escape") {
    event.preventDefault();
    closeActive(true);
  } else if (event.key === "Tab") {
    const instance = activeInstance;
    closeActive(false);
    if (moveFocusFromTrigger(instance, event.shiftKey)) {
      event.preventDefault();
    } else {
      instance.suppressNextFocus = true;
      instance.trigger.focus({ preventScroll: true });
    }
  }
}
function schedulePosition() {
  if (!activeInstance || positionFrame) {
    return;
  }
  positionFrame = host.requestAnimationFrame(() => {
    positionFrame = 0;
    positionPanel();
  });
}
function positionPanel() {
  if (!activeInstance || panel.hidden) {
    return;
  }
  if (!activeInstance.trigger.isConnected) {
    closeActive(false);
    return;
  }
  const rect = activeInstance.trigger.getBoundingClientRect();
  const margin = 8;
  const gap = 6;
  const viewport = host.visualViewport;
  const viewportWidth = viewport?.width ?? host.innerWidth;
  const viewportHeight = viewport?.height ?? host.innerHeight;
  const viewportLeft = viewport?.offsetLeft ?? 0;
  const viewportTop = viewport?.offsetTop ?? 0;
  const viewportRight = viewportLeft + viewportWidth;
  const viewportBottom = viewportTop + viewportHeight;
  const availableWidth = Math.max(1, viewportWidth - margin * 2);
  const width = Math.min(560, availableWidth, Math.max(288, rect.width));
  const left = Math.max(viewportLeft + margin, Math.min(rect.left, viewportRight - width - margin));
  const below = viewportBottom - rect.bottom - gap - margin;
  const above = rect.top - gap - margin - viewportTop;
  const availableHeight = Math.max(0, Math.max(below, above));
  panel.style.width = `${width}px`;
  panel.style.left = `${left}px`;
  panel.style.maxHeight = `${Math.max(1, viewportHeight - margin * 2)}px`;
  listbox.style.maxHeight = `${Math.max(40, Math.min(320, availableHeight - 72))}px`;
  panel.style.visibility = "hidden";
  const height = panel.offsetHeight;
  let top = rect.bottom + gap;
  if (below < height && above > below) {
    top = rect.top - gap - height;
  }
  const minimumTop = viewportTop + margin;
  const maximumTop = Math.max(minimumTop, viewportBottom - height - margin);
  panel.style.top = `${Math.max(minimumTop, Math.min(top, maximumTop))}px`;
  panel.style.visibility = "";
}
function syncSearchState(instance) {
  searchInput.setAttribute("aria-invalid", invalidState(instance.select));
  if (instance.select.required) {
    searchInput.setAttribute("aria-required", "true");
  } else {
    searchInput.removeAttribute("aria-required");
  }
  copyAttribute(instance.select, searchInput, "aria-describedby");
  copyAttribute(instance.select, searchInput, "aria-errormessage");
}
function watchActiveConnection() {
  activeConnectionObserver?.disconnect();
  activeConnectionObserver = new host.MutationObserver(() => {
    if (activeInstance && !activeInstance.trigger.isConnected) {
      closeActive(false);
    }
  });
  activeConnectionObserver.observe(documentObject.body, { childList: true, subtree: true });
}
function openInstance(instance) {
  if (isEffectivelyDisabled(instance.select) || instance.select.hidden || !instance.trigger.isConnected || instance.root.getClientRects().length === 0) {
    return;
  }
  ensurePanel();
  if (activeInstance && activeInstance !== instance) {
    activeInstance.trigger.setAttribute("aria-expanded", "false");
  }
  activeInstance = instance;
  instance.trigger.setAttribute("aria-expanded", "true");
  searchInput.placeholder = formatMessage(instance.options.messages.searchPlaceholder, {
    label: instance.labelText
  });
  searchInput.setAttribute("aria-label", formatMessage(instance.options.messages.searchLabel, {
    label: instance.labelText
  }));
  syncSearchState(instance);
  searchInput.value = "";
  searchInput.setAttribute("aria-expanded", "true");
  panel.hidden = false;
  renderActive(true);
  positionPanel();
  watchActiveConnection();
  searchInput.focus({ preventScroll: true });
}
function closeActive(returnFocus) {
  if (!activeInstance) {
    return;
  }
  const instance = activeInstance;
  activeInstance = null;
  activeConnectionObserver?.disconnect();
  instance.trigger.setAttribute("aria-expanded", "false");
  searchInput.setAttribute("aria-expanded", "false");
  searchInput.removeAttribute("aria-activedescendant");
  searchInput.removeAttribute("aria-describedby");
  searchInput.removeAttribute("aria-errormessage");
  searchInput.removeAttribute("aria-invalid");
  searchInput.removeAttribute("aria-required");
  panel.hidden = true;
  panel.style.visibility = "";
  optionNodes = /* @__PURE__ */ new Map();
  if (returnFocus && !isEffectivelyDisabled(instance.select) && instance.trigger.isConnected) {
    instance.suppressNextFocus = true;
    instance.trigger.focus({ preventScroll: true });
  }
}
var YassInstance = class {
  constructor(select, options) {
    this.select = select;
    this.options = options;
    this.id = ++serial;
    this.entries = [];
    this.visibleIndexes = [];
    this.navigableIndexes = [];
    this.navigableIndexSet = /* @__PURE__ */ new Set();
    this.activeEntryIndex = -1;
    this.dirty = true;
    this.suppressNextFocus = false;
    this.originalParent = select.parentNode;
    this.originalNextSibling = select.nextSibling;
    this.originalTabIndex = select.getAttribute("tabindex");
    this.originalAriaHidden = select.getAttribute("aria-hidden");
    this.labels = select.labels ? Array.from(select.labels) : [];
    this.labelFors = this.labels.map((label) => label.getAttribute("for"));
    this.implicitLabels = this.labels.filter((label) => label.contains(select));
    this.labelText = accessibleLabel(select, options.messages.fallbackLabel, this.labels);
    this.fieldsets = [];
    for (let fieldset = select.closest("fieldset"); fieldset; fieldset = fieldset.parentElement?.closest("fieldset")) {
      this.fieldsets.push(fieldset);
    }
    this.root = createElement("span", "yass");
    this.trigger = createElement("button", "yass__trigger");
    this.trigger.type = "button";
    this.trigger.id = `${select.id || "yass"}-trigger-${this.id}`;
    this.trigger.setAttribute("aria-haspopup", "listbox");
    this.trigger.setAttribute("aria-controls", listbox.id);
    this.trigger.setAttribute("aria-expanded", "false");
    if (this.originalTabIndex !== null) {
      this.trigger.tabIndex = select.tabIndex;
    }
    this.valueNode = createElement("span", "yass__value");
    this.trigger.append(this.valueNode);
    const implicitLabel = this.implicitLabels[0];
    if (implicitLabel?.parentNode) {
      implicitLabel.parentNode.insertBefore(this.root, implicitLabel.nextSibling);
    } else {
      select.parentNode.insertBefore(this.root, select);
    }
    this.root.append(select, this.trigger);
    select.classList.add("yass__native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    this.labels.forEach((label) => {
      if (this.implicitLabels.includes(label) || select.id && label.getAttribute("for") === select.id) {
        label.setAttribute("for", this.trigger.id);
      }
    });
    this.onTriggerFocus = () => {
      if (this.suppressNextFocus) {
        this.suppressNextFocus = false;
        return;
      }
      if (this.options.openOnFocus) {
        openInstance(this);
      }
    };
    this.onTriggerClick = () => openInstance(this);
    this.onSelectChange = () => this.sync();
    this.onInvalid = () => {
      this.trigger.setAttribute("aria-invalid", "true");
      openInstance(this);
      host.setTimeout(() => {
        if (activeInstance === this && !isEffectivelyDisabled(this.select)) {
          searchInput.focus({ preventScroll: true });
        }
      }, 0);
    };
    this.trigger.addEventListener("focus", this.onTriggerFocus);
    this.trigger.addEventListener("click", this.onTriggerClick);
    select.addEventListener("change", this.onSelectChange);
    select.addEventListener("input", this.onSelectChange);
    select.addEventListener("invalid", this.onInvalid);
    this.observer = new host.MutationObserver(() => {
      this.dirty = true;
      this.observeNameSources?.();
      this.sync();
    });
    this.observer.observe(select, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
    this.fieldsetObserver = new host.MutationObserver(() => this.sync());
    this.fieldsets.forEach((fieldset) => {
      this.fieldsetObserver.observe(fieldset, { attributes: true, attributeFilter: ["disabled"] });
    });
    this.nameObserver = new host.MutationObserver(() => this.sync());
    this.observeNameSources = () => {
      this.nameObserver.disconnect();
      [...this.labels, ...labelledByElements(this.select)].forEach((element) => {
        this.nameObserver.observe(element, { childList: true, subtree: true, characterData: true });
      });
    };
    this.observeNameSources();
    this.refresh(false);
    this.sync();
  }
  open() {
    openInstance(this);
    return this;
  }
  close(returnFocus = false) {
    if (activeInstance === this) {
      closeActive(Boolean(returnFocus));
    }
    return this;
  }
  refresh(render = true) {
    this.entries = buildEntries(this.select);
    this.dirty = false;
    this.syncPresentation();
    if (render && activeInstance === this) {
      renderActive(true);
      schedulePosition();
    }
    return this;
  }
  syncPresentation() {
    const label = selectedLabel(this.select, this.options.messages.fallbackLabel);
    const disabled = isEffectivelyDisabled(this.select);
    this.labelText = accessibleLabel(this.select, this.options.messages.fallbackLabel, this.labels);
    this.root.hidden = this.select.hidden;
    this.valueNode.textContent = label;
    this.trigger.title = label;
    this.trigger.disabled = disabled;
    this.trigger.setAttribute("aria-label", `${this.labelText}: ${label}`);
    this.trigger.setAttribute("aria-disabled", disabled ? "true" : "false");
    this.trigger.setAttribute("aria-invalid", invalidState(this.select));
    if (this.select.required) {
      this.trigger.setAttribute("aria-required", "true");
    } else {
      this.trigger.removeAttribute("aria-required");
    }
    copyAttribute(this.select, this.trigger, "aria-describedby");
    copyAttribute(this.select, this.trigger, "aria-errormessage");
    if (activeInstance === this) {
      syncSearchState(this);
    }
  }
  sync() {
    if (this.dirty) {
      this.refresh(false);
    } else {
      this.syncPresentation();
    }
    if ((isEffectivelyDisabled(this.select) || this.select.hidden) && activeInstance === this) {
      closeActive(false);
    } else if (activeInstance === this) {
      renderActive(true);
      schedulePosition();
    }
    return this;
  }
  choose(entryIndex) {
    const entry = this.entries[entryIndex];
    if (!entry?.selectable || !entry.option) {
      return this;
    }
    const changed = this.select.selectedIndex !== entry.option.index;
    this.select.selectedIndex = entry.option.index;
    this.sync();
    closeActive(true);
    if (changed) {
      const EventConstructor = this.select.ownerDocument.defaultView.Event;
      this.select.dispatchEvent(new EventConstructor("input", { bubbles: true }));
      this.select.dispatchEvent(new EventConstructor("change", { bubbles: true }));
    }
    return this;
  }
  destroy() {
    if (activeInstance === this) {
      closeActive(false);
    }
    this.observer.disconnect();
    this.fieldsetObserver.disconnect();
    this.nameObserver.disconnect();
    this.trigger.removeEventListener("focus", this.onTriggerFocus);
    this.trigger.removeEventListener("click", this.onTriggerClick);
    this.select.removeEventListener("change", this.onSelectChange);
    this.select.removeEventListener("input", this.onSelectChange);
    this.select.removeEventListener("invalid", this.onInvalid);
    this.labels.forEach((label, index) => {
      const original = this.labelFors[index];
      if (original === null) {
        label.removeAttribute("for");
      } else {
        label.setAttribute("for", original);
      }
    });
    this.select.classList.remove("yass__native");
    if (this.originalTabIndex === null) {
      this.select.removeAttribute("tabindex");
    } else {
      this.select.setAttribute("tabindex", this.originalTabIndex);
    }
    if (this.originalAriaHidden === null) {
      this.select.removeAttribute("aria-hidden");
    } else {
      this.select.setAttribute("aria-hidden", this.originalAriaHidden);
    }
    if (this.originalNextSibling?.parentNode === this.originalParent) {
      this.originalParent.insertBefore(this.select, this.originalNextSibling);
    } else {
      this.originalParent.append(this.select);
    }
    this.root.remove();
    registry.delete(this.select);
    return null;
  }
};
function enhance(select, options = {}) {
  if (!select || select.tagName !== "SELECT" || select.multiple || select.size > 1 || !select.parentNode) {
    return null;
  }
  if (registry.has(select)) {
    return registry.get(select);
  }
  if (select.classList.contains("yass__native")) {
    return null;
  }
  const resolved = optionsFor(select, options);
  if (resolved.injectStyles) {
    injectStyles({ nonce: resolved.nonce });
  }
  ensurePanel();
  if (!panel) {
    return null;
  }
  const instance = new YassInstance(select, resolved);
  registry.set(select, instance);
  return instance;
}
function enhanceAll(scope = documentObject, options = {}) {
  if (!documentObject || !scope) {
    return [];
  }
  const selects = [];
  if (scope.matches?.(SELECTOR)) {
    selects.push(scope);
  }
  if (scope.querySelectorAll) {
    selects.push(...scope.querySelectorAll(SELECTOR));
  }
  return selects.map((select) => enhance(select, options)).filter(Boolean);
}
function get(select) {
  return registry.get(select) || null;
}
function configure(options = {}) {
  defaults = mergeOptions(defaults, options);
  return mergeOptions(defaults, {});
}
function start() {
  if (!documentObject) {
    return;
  }
  if (defaults.injectStyles) {
    injectStyles({ nonce: defaults.nonce });
  }
  enhanceAll(documentObject);
}
if (documentObject && !existingApi) {
  documentObject.addEventListener("pointerdown", (event) => {
    if (activeInstance && !activeInstance.root.contains(event.target) && !panel.contains(event.target)) {
      closeActive(false);
    }
  });
  documentObject.addEventListener("focusin", (event) => {
    if (activeInstance && !activeInstance.root.contains(event.target) && !panel.contains(event.target)) {
      closeActive(false);
    }
  });
  documentObject.addEventListener("reset", (event) => {
    host.setTimeout(() => {
      documentObject.querySelectorAll("select").forEach((select) => {
        const instance = registry.get(select);
        if (instance && select.form === event.target) {
          instance.dirty = true;
          instance.sync();
        }
      });
    }, 0);
  }, true);
  host.addEventListener("resize", schedulePosition);
  documentObject.addEventListener("scroll", schedulePosition, true);
  host.visualViewport?.addEventListener("resize", schedulePosition);
  host.visualViewport?.addEventListener("scroll", schedulePosition);
  if (documentObject.readyState === "loading") {
    documentObject.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
var localApi = {
  version: VERSION,
  enhance,
  enhanceAll,
  get,
  configure,
  injectStyles
};
var api = existingApi || localApi;
if (!existingApi && librarySymbol) {
  Object.defineProperty(host, librarySymbol, {
    value: api,
    configurable: true,
    writable: true
  });
}
var publicEnhance = api.enhance;
var publicEnhanceAll = api.enhanceAll;
var publicGet = api.get;
var publicConfigure = api.configure;
var publicInjectStyles = api.injectStyles;
var __test = {
  normalizeSearchText,
  keyboardLayoutVariants,
  matchesSearch,
  buildEntries,
  filterEntries
};
var yass_default = api;
export {
  __test,
  publicConfigure as configure,
  yass_default as default,
  publicEnhance as enhance,
  publicEnhanceAll as enhanceAll,
  publicGet as get,
  publicInjectStyles as injectStyles,
  VERSION as version
};
