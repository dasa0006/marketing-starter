# Script Tag Error Investigation

> **Topic**: `Encountered a script tag while rendering React component` — fires on client-side locale switch in Next.js 16.2.9 / React 19.2.4 with `next-themes@0.4.6`
>
> **Date**: 2026-07-18
>
> **Method**: Every claim here is traced to its primary source (source code, official docs, first-party APIs). No secondary summaries.

---

## Q1: What exactly does the error mean?

### Exact source of the error

The error is **not** in the upstream React 19.2.4 package. It was added by **Next.js** in their forked/compiled version of React DOM (`react-dom-client.development.js`).

**File (Next.js-compiled)**: `node_modules/.pnpm/next@16.2.9_.../node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js`

**Line 12957–12969**:

```js
case "script":
  nextResource = nextResource.createElement("div");
  didWarnScriptTags ||
    isScriptDataBlock(newProps) ||
    (console.error(
      "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)."
    ),
    (didWarnScriptTags = !0));
  nextResource.innerHTML = "<script>\x3c/script>";
  nextResource = nextResource.removeChild(
    nextResource.firstChild
  );
  break;
```

**File (upstream React 19.2.4)**: `node_modules/.pnpm/react-dom@19.2.4_react@19.2.4/node_modules/react-dom/cjs/react-dom-client.development.js`

**Line 12586–12592** — same `case "script":` but **without** the warning:

```js
case "script":
  nextResource = nextResource.createElement("div");
  nextResource.innerHTML = "<script>\x3c/script>";
  nextResource = nextResource.removeChild(
    nextResource.firstChild
  );
  break;
```

**Conclusion**: The warning is a Next.js-specific addition to their compiled React DOM, not present in upstream React 19.2.4.

### The triggering condition

The `case "script":` block sits inside a `switch (type)` that handles element creation for `HostComponent` (tag 5 in React's Fiber). It is reached when:

1. A new Fiber is being **mounted** (not updated): `case 5:` where `null !== current && null != workInProgress.stateNode` is **false** (i.e., no existing DOM node).
2. We are in the **non-hydration** path: `popHydrationState(workInProgress)` returned false.
3. The element type is `"script"`.

The warning condition is:

```js
didWarnScriptTags || isScriptDataBlock(newProps) || console.error(...)
```

This fires when:

- `didWarnScriptTags` is `false` (first time)
- AND `isScriptDataBlock(newProps)` returns `false` (the script is NOT a data-block)

### The `didWarnScriptTags` one-shot mechanism

**File**: `node_modules/.pnpm/next@16.2.9_.../node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.development.js`

**Line 29843** (initialization):

```js
didWarnScriptTags = !1,
```

After the first warning fires, `didWarnScriptTags` is set to `true` (line 12964), suppressing **all subsequent** warnings. This means you only see the error once per page load, even if multiple script elements are created.

### Dev-only vs production

**Production build**: `node_modules/.pnpm/next@16.2.9_.../node_modules/next/dist/compiled/react-dom/cjs/react-dom-client.production.js`

**Line 8415–8421** — no warning, no `didWarnScriptTags`:

```js
case "script":
  nextResource = ownerDocument.createElement("div");
  nextResource.innerHTML = "<script>\x3c/script>";
  nextResource = nextResource.removeChild(
    nextResource.firstChild
  );
  break;
```

The `didWarnScriptTags` variable does **not exist** in the production build. The warning is **dev-only**.

### The `<template>` suggestion

MDN [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) is the suggested replacement. The `<template>` element holds HTML that is not rendered immediately — it can be cloned later via `content.cloneNode(true)`. However, this is **not** applicable for an inline script that must execute synchronously before hydration (which is what `next-themes` needs). The MDN suggestion is a general workaround for "I want HTML that shouldn't execute" — the opposite of what `next-themes` needs.

---

## Q2: How does React 19 handle `<script>` elements?

### The "hoistable" vs "non-hoistable" distinction

In React 19, `<script>` elements with a `src` attribute are treated as **hoistable resources** — they are moved to `<head>` during rendering and deduplicated by `src`.

**File**: `react-dom-client.development.js`, `acquireResource` function, line 22958–22979:

```js
case "script":
  _instance = getScriptKey(props.src);
  if (styleProps = hoistableRoot.querySelector(
    getScriptSelectorFromKey(_instance)
  ))
    return (
      resource.instance = styleProps,
      markNodeAsHoistable(styleProps),
      styleProps
    );
  // ...
  styleProps = hoistableRoot.createElement("script");
  markNodeAsHoistable(styleProps);
  setInitialProperties(styleProps, "link", instance);
  hoistableRoot.head.appendChild(styleProps);
  return resource.instance;
```

Scripts with `src` are:

- Looked up in `<head>` via `querySelector`
- Deduplicated by key (src)
- Appended to `<head>`
- Marked with `internalHoistableMarker`

**Inline scripts** (without `src`, with `dangerouslySetInnerHTML`) are **NOT** hoistable. They go through the regular HostComponent creation path (`case 5:`), which hits the `case "script":` block in `createElement`.

### `enableTrustedTypesIntegration`

This feature flag (`__VARIANT__`) controls whether React integrates with the [Trusted Types API](https://w3c.github.io/trusted-types/dist/spec/). When enabled, strings passed to `dangerouslySetInnerHTML` or `innerHTML` are wrapped in `trustedTypes.createPolicy(...)`. It does **not** affect the script-tag warning.

### `isScriptDataBlock` — the suppression mechanism

**File**: `react-dom-client.development.js` (Next.js-compiled version), line 23647–23677:

```js
function isScriptDataBlock(props) {
  props = props.type;
  if ("string" !== typeof props || "" === props) return !1;
  props = props.toLowerCase();
  if (
    "module" === props ||
    "importmap" === props ||
    "speculationrules" === props
  )
    return !1;
  switch (props) {
    case "application/ecmascript":
    case "application/javascript":
    case "application/x-ecmascript":
    case "application/x-javascript":
    case "text/ecmascript":
    case "text/javascript":
    case "text/javascript1.0":
    case "text/javascript1.1":
    case "text/javascript1.2":
    case "text/javascript1.3":
    case "text/javascript1.4":
    case "text/javascript1.5":
    case "text/jscript":
    case "text/livescript":
    case "text/x-ecmascript":
    case "text/x-javascript":
      return !1;
  }
  return !0;
}
```

A script element is considered a **"data block"** (suppressing the warning) when its `type` is:

- `undefined` / empty string → **NOT** a data block → warning fires
- `"module"`, `"importmap"`, `"speculationrules"` → **NOT** a data block → warning fires
- Any JavaScript MIME type → **NOT** a data block → warning fires
- Any other type string (e.g. `"application/json"`) → **IS** a data block → warning suppressed

The built-in next-themes script has **no `type` prop**, so `isScriptDataBlock` returns `false` → warning fires.

---

## Q3: Why does the error fire on locale switch but not same-locale navigation?

### Root cause: The `LocaleLayout` is an async Server Component

**File**: `src/app/[locale]/layout.tsx`

```tsx
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* ... */}
    </ThemeProvider>
  );
}
```

When the locale changes (e.g. `/en` → `/da`):

1. The URL segment changes → Next.js fetches a new RSC (React Server Components) payload from the server
2. The layout re-executes on the server (it's `async`)
3. The server sends a new RSC payload for the entire layout tree
4. On the client, the RSC payload is reconciled with the existing React tree

### Why this causes a remount (not just an update)

The critical behavior is documented in the Next.js 16 docs:

> **File**: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, lines 127–133:
>
> **Subsequent Navigations**: On subsequent navigations, the **RSC Payload** is prefetched and cached for instant navigation. **Client Components are rendered entirely on the client**, without the server-rendered HTML.

During RSC reconciliation:

- The entire RSC tree for the locale segment is replaced
- Client components referenced by module reference **do** get reused when the module reference ID matches
- However, the **`<script>` element** created inside the ThemeProvider is a DOM host element, not a React component

The `ThemeProvider` renders a `<script>` with `dangerouslySetInnerHTML`. In React's reconciliation:

- **Same-locale navigation** (e.g. `/en` → `/en/about`): Only the `page.tsx` segment changes. The `[locale]/layout.tsx` is **preserved** — Next.js docs confirm this: "On navigation, layouts preserve state, remain interactive, and do not rerender" (layouts-and-pages.md, line 43). The ThemeProvider's script element is never re-created.

- **Cross-locale navigation** (e.g. `/en` → `/da`): The `[locale]` param changes. The RSC payload for the layout is **replaced**. Since the layout is an `async` Server Component, a completely new RSC tree segment is produced. During reconciliation on the client, the new RSC output causes the client component boundary to be **re-mounted** (not just updated), because the RSC payload represents a new tree segment at the `[locale]` level. The async layout function produces a **new module reference** for the ThemeProvider in the fresh RSC output.

When the ThemeProvider mounts fresh, React creates a new `<script>` DOM element via `document.createElement`, triggering the `case "script":` handler in `completeWork` — and thus the warning.

### Why the script DOM element must be created via the `div.innerHTML` trick

`document.createElement("script")` creates a script element that, when inserted into the DOM, **executes**. React avoids this by creating the script inside a `<div>` via `innerHTML` (which doesn't execute inline scripts when set via innerHTML), then extracting the child node. This is the standard browser-safe pattern for creating script elements without execution.

---

## Q4: What are the known fixes/patches?

### Fix 1: PR #386 — "Don't render ThemeScript on client"

**PR**: https://github.com/pacocoursey/next-themes/pull/386 (jakubwarkusz, open since Mar 20, 2026)

**Approach**: Return `null` from the `ThemeScript` component when `typeof window !== 'undefined'` (i.e., on the client). The script only needs to be in the SSR HTML where the browser executes it before hydration.

**Core change** (from the PR diff):

```tsx
// Before:
const ThemeScript = React.memo(({ ... }) => {
  return React.createElement("script", {
    suppressHydrationWarning: true,
    nonce: typeof window === "undefined" ? nonce : "",
    dangerouslySetInnerHTML: { __html: `(${script})(${data})` }
  });
});

// After:
const ThemeScript = React.memo(({ ... }) => {
  if (typeof window !== "undefined") return null; // NEW
  return React.createElement("script", {
    suppressHydrationWarning: true,
    nonce,
    dangerouslySetInnerHTML: { __html: `(${script})(${data})` }
  });
});
```

**Why it works**: The inline script only needs to execute _once_ — before hydration — to set the theme class on `<html>` and prevent the flash of unstyled content (FOUC). After hydration, the ThemeProvider handles theme changes via React state. Rendering the `<script>` on client-side navigation is unnecessary and triggers the Next.js warning.

### Fix 2: `@teispace/next-themes` (drop-in replacement)

**Package**: https://www.npmjs.com/package/@teispace/next-themes (v2.0.4, 10.7k weekly downloads)

**Source**: https://github.com/teispace/npm-packages/tree/main/packages/next-themes

This is a full fork that rebuilds the internals with React 19 / Next.js 16 compatibility, typed themes, hybrid cookie+localStorage storage, and zero-FOUC guarantees. The script injection approach is redesigned to avoid the React 19 warning.

### Upstream status

- **Issue #385** (https://github.com/pacocoursey/next-themes/issues/385): Reported Mar 19, 2026 — `next-themes@0.4.6` with Next.js 16.2.0
- **Issue #387** (https://github.com/pacocoursey/next-themes/issues/387): Reported Mar 24, 2026 — same error, Next.js 16.2.1
- **PR #386** (https://github.com/pacocoursey/next-themes/pull/386): Open, unmerged (no activity from maintainer since submission)
- **PR #391** (https://github.com/pacocoursey/next-themes/pull/391): Unrelated fix for `__name` ReferenceError, closed by author

The upstream `next-themes` repo appears **unmaintained** — PR #386 has no merge activity since March 2026.

### `scriptProps={{ type: "application/json" }}` (NOT a real fix)

Setting `type="application/json"` would cause `isScriptDataBlock` to return `true`, suppressing the warning. **However**, this also makes the browser **not execute** the script (valid JSON type scripts are data blocks, not executable). The theme initialization inline script would never run, breaking the theme flash prevention. This is a **false fix** and should not be used.

### `next/script` (not applicable)

Next.js's `<Script>` component (`next/script`) is for loading external scripts with `src` and supports `strategy` props (`beforeInteractive`, `afterInteractive`, `lazyOnload`). It does **not** support inline scripts with `dangerouslySetInnerHTML`. It is not a viable alternative for this use case.

---

## Q5: Hypothesis evaluation

### H1: next-themes 0.4.6 uses inline `<script>` → React 19 forbids it on client render

**Verdict: PARTIALLY SUPPORTED**

The inline `<script>` is indeed what triggers the error. However, the "forbidding" is not from React 19 itself — it's from **Next.js's compiled version** of React DOM. The upstream React 19.2.4 does not have this warning. Next.js added it in their fork.

The error condition matches exactly:

- next-themes renders `React.createElement("script", { dangerouslySetInnerHTML: {...}, suppressHydrationWarning: true })` → confirmed from `node_modules/next-themes/dist/index.mjs`
- When this element is created during a non-hydration client render, the `case "script":` block fires the warning
- The script has no `type` prop → `isScriptDataBlock` returns `false` → warning is not suppressed

### H2: Locale switch causes ThemeProvider to unmount/remount

**Verdict: SUPPORTED**

This is the reason the error is **conditional**:

- Same-locale navigation: Layout is preserved (Next.js docs confirm) → ThemeProvider is updated, not remounted → DOM element is reused → no warning
- Cross-locale navigation: The async Server Component layout is re-rendered on the server → fresh RSC payload → client reconciles by remounting the client component boundary → `<script>` DOM element is created anew → warning fires

### H3: Error is cosmetic (dev-only)

**Verdict: VERIFIED TRUE**

- The `didWarnScriptTags` flag is initialized to `false` (line 29843) and set to `true` after the first warning (line 12964)
- The code path exists in the `.production.js` build (line 8415-8421) but **without** the `console.error` call
- The `didWarnScriptTags` variable does not exist in the production build at all
- The functionality of `next-themes` is **not affected** — the theme still works correctly

### H4: `scriptProps={{ type: "application/json" }}` workaround

**Verdict: FALSE FIX**

While `type="application/json"` would cause `isScriptDataBlock` to return `true` (suppressing the warning), it also:

- Prevents the browser from executing the script (valid JSON data blocks are not executed)
- Breaks the theme initialization that prevents FOUC

The correct fix is PR #386's approach: **don't render the `<script>` element on the client at all**.

### Summary

| Hypothesis                                     | Verdict                                     | Confidence |
| ---------------------------------------------- | ------------------------------------------- | ---------- |
| H1: Inline `<script>` triggers Next.js warning | Partially supported (Next.js, not React 19) | High       |
| H2: Locale switch causes remount               | Supported                                   | High       |
| H3: Error is cosmetic (dev-only)               | Verified true                               | Certain    |
| H4: `type="application/json"` fix              | False fix                                   | Certain    |

### Recommended fix approach

1. **Immediate fix**: Apply the PR #386 patch locally — don't render the script element on the client. The theme initialization only needs to run once (before hydration), not on every client navigation.
2. **Drop-in replacement**: Switch to `@teispace/next-themes` (actively maintained, React 19 / Next.js 16 compatible).
3. **Long-term**: If sticking with `next-themes@0.4.6`, apply the patch via `patch-package` or a fork.
4. **File an issue**: The Next.js warning is overly broad — all inline `<script>` elements are not "forbidden", they just don't execute after creation. The Next.js team should consider narrowing the warning to cases where the developer intends the script to execute.
