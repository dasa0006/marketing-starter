# Architecture

This document describes the provider chain, consent system, security headers, i18n architecture, analytics strategy, and architectural decision records. It is the reference for how the template is wired together.

For the phased build plan explaining _why_ things are structured this way, see [`implementation.md`](./implementation.md).

## Provider Hierarchy

```
<html class="h-full" lang={locale} suppressHydrationWarning>
  <body className={`${fontVariables} antialiased`}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone={SITE_CONFIG.timezone}
      >
        <ConsentProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CookieBanner />  ← renders conditionally based on consent status
        </ConsentProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  </body>
</html>
```

**Order rationale:**

- `ThemeProvider` outermost — prevents dark mode flicker on page load
- `NextIntlClientProvider` — provides i18n messages to everything below, including the consent system
- `ConsentProvider` — manages cookie consent state; the CookieBanner reads from this context

---

## Consent System

The cookie consent system uses a **storage seam** to decouple consent persistence from the provider, making all consumer tests independent of `document.cookie` and eliminating `vi.mock()`.

### Module layout

```
src/lib/consent/
├── storage.types.ts       ← ConsentStatus type, ConsentStorage interface
├── storage.ts             ← createCookieStorage() and createFakeStorage() factories
└── storage.test.ts        ← Unit tests for both adapters

src/components/providers/
├── ConsentProvider.tsx      ← React context, accepts optional storage prop
└── ConsentProvider.test.tsx ← Tests with injectable fake storage
```

### Interface

The `ConsentStorage` interface (`src/lib/consent/storage.types.ts`) defines three methods:

| Method                        | Purpose                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| `getConsent(): ConsentStatus` | Read current consent — never throws, returns `"undecided"` on error |
| `setConsent(status): void`    | Persist a decision (accept or decline)                              |
| `clearConsent(): void`        | Revert to undecided (reset / manage cookies)                        |

`ConsentStatus` is a union: `"undecided" | "accepted" | "declined"`.

### Adapters

| Factory                 | Backing store                                        | Use case                                                  |
| ----------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| `createCookieStorage()` | `document.cookie` with `SameSite=Lax`, 1-year expiry | Production — the default when no `storage` prop is passed |
| `createFakeStorage()`   | In-memory, optional initial status                   | Tests — no DOM, no mocking, direct injection              |

### Wiring

The `ConsentProvider` (in `src/components/providers/ConsentProvider.tsx`) accepts an optional `storage: ConsentStorage` prop:

```tsx
<ConsentProvider>                            // ← default: createCookieStorage()
<ConsentProvider storage={fakeStorage}>      // ← tests: injected fake
```

Production code renders `<ConsentProvider>` with no prop and gets cookies automatically. Tests import `createFakeStorage()` and pass it directly — no `vi.mock()`, no `document.cookie` manipulation in consumer tests.

The cookie name is `consent-status`, stored as the constant `CONSENT_COOKIE_NAME` in `storage.types.ts`.

### Reactive state

`ConsentProvider` is the sole source of reactive consent state for the component tree. There is no standalone reactive consent module. The provider wraps the storage seam in React context and exposes `status`, `accept()`, `decline()`, and `reset()` to children (e.g., `CookieBanner`).

When the user acts, `ConsentProvider` calls `storage.setConsent()` and updates its internal React state — one action, one state machine. The event dispatch layer (see ADR-0002) reads consent synchronously from the storage seam on every event dispatch, eliminating a second module and the bridging logic that would be needed to keep two modules in sync.

---

## Security

### The rule

**All HTTP security headers live in `next.config.ts` `headers()`. `src/proxy.ts` never applies security headers.**

This is a single canonical home for one concern (HTTP security headers). The Next.js execution order — `next.config.ts` headers → middleware → response — means a single `next.config.ts` source covers every response, including `_next/static`, images, and other static assets, which is what you want for security headers. Splitting this concern across `proxy.ts` and `next.config.ts` would require the next developer to guess which file a new header belongs in. The rule above eliminates the guess.

### Generators vs. application point

- **Generators** (in `security/`, plain TypeScript, unit-testable, no Next.js dependency):
  - `security/csp.ts` — CSP policy string generator; `'unsafe-inline'` allowed in dev (Turbopack HMR), stricter in prod
  - `security/headers.ts` — `createSecurityHeaders()` returns the full header array (CSP + the rest)
- **Application point** (in `next.config.ts`):
  - The `headers()` function imports `createSecurityHeaders()` and attaches the result to every response

### Headers applied

- `Content-Security-Policy` — generated by `security/csp.ts` (dev vs prod)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security` (production only)

---

## i18n

- Two locales shipped: `en` (default), `da`
- URL prefix strategy: `as-needed` (`/about` for English, `/da/about` for Danish)
- Messages split into two namespaces by **translation workflow**:

  ### Rationale

  Every project this template ships always includes English and Danish. Base Messages
  are the subset that can be pre-translated by the template author for these two locales
  before the project starts, eliminating recurring translation cost. For additional locales
  (e.g., Spanish, German), Base Messages are translated by the template author before
  project handoff — not by the project's translator.
  - `messages/base/{locale}.json` — strings whose translation cost is borne by the
    template author. Pre-translated for all shipped locales before the project receives
    them.
  - `messages/custom/{locale}.json` — strings whose translation cost is borne by the
    project. Extracted and sent to the project's translators on every project.

- Server-side loader in `src/i18n/request.ts` merges both namespaces at request time
- Adding a locale: add to `locales` array in `src/i18n/routing.ts` + create message files (see [`contributing.md`](./contributing.md) → How to add a locale for the full walkthrough)
- `src/i18n/routing.ts` is also the single source of `generateStaticParamsForLocales()`, re-exported by every locale-aware route (home, about, privacy, cookie-policy, the `[locale]` layout). One edit to `routing.ts` flows a new locale through every page's static generation; see [implementation.md → Phase 11](./implementation.md#phase-11-pages--composition).

---

## Analytics

- The `useButtonTracking` hook (`src/hooks/useButtonTracking.ts`) provides analytics decoupled from any specific vendor.
- The full event tracking architecture is defined in [ADR-0002](./adr/0002-event-tracking-system.md): typed discriminated union (`TypedEvent`), generic `track.event()` dispatch, consent-gated adapter pattern, and five hooks.
- Default: `console.debug` in development.
- Per-project: call `configureTracking()` once at app startup to wire to PostHog, GA4, Segment, or any other provider.
- Vercel Analytics + Speed Insights are documented as an optional add-on (not shipped).

---

## Architecture Decision Records

Substantial architectural decisions — including accepted candidates, rejected alternatives, and their rationale — are recorded in `docs/adr/`. ADRs are the durable record for decisions that would otherwise be re-litigated or rediscovered.

| ID     | Title                                                        |
| ------ | ------------------------------------------------------------ |
| `0002` | [Event tracking system](./adr/0002-event-tracking-system.md) |
