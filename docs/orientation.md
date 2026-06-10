## Directory Map

```
marketing-starter/
├── .github/workflows/       — CI: lint → test → build (GitHub Actions)
├── .husky/                  — Git hooks (pre-commit: lint, pre-push: build, commit-msg: commitlint)
├── .storybook/              — Storybook config (main.ts, preview.tsx, vitest.setup.ts)
├── .vscode/                 — Editor settings (format on save, organize imports)
├── docs/                    — Specs, design documents, and ADRs (docs/adr/)
├── messages/
│   ├── base/                — Strings pre-translated by template author (cookie banner, error, not-found)
│   └── custom/              — Strings translated per project (header, footer, homepage, about, metadata)
├── public/                  — Static assets (favicon, OG image, logo placeholder)
├── scripts/                 — Utility scripts
├── security/                — CSP policy generator
├── src/
│   ├── app/                 — Next.js App Router pages and layouts
│   │   ├── [locale]/        — Locale-scoped routes (dynamic segment)
│   │   ├── globals.css      — Import orchestrator (@import of all style files)
│   │   ├── layout.tsx       — Root layout (bare pass-through)
│   │   ├── opengraph-image.tsx — Dynamic OG image generation
│   │   ├── robots.ts        — Dynamic robots.txt
│   │   └── sitemap.ts       — Dynamic sitemap with hreflang
│   ├── styles/
│   │   ├── tokens.css       — :root, .dark, surface contexts (semantic tokens; @theme in globals.css)
│   │   ├── utilities.css    — @utility definitions
│   │   └── base.css         — @layer base (resets, body, etc.)
│   ├── components/
│   │   ├── blocks/          — Page-level content composers (Hero, FeatureGrid, CTA, TextBlock)
│   │   ├── layout/          — Structural shell (SiteHeader, SiteFooter, Section, etc.)
│   │   ├── pages/           — Page assemblies (Index, About, PrivacyPolicy, CookiePolicy)
│   │   ├── project-components/ — Client-specific components (empty, use this, don't edit src/components/)
│   │   ├── providers/       — React context providers (ConsentProvider)
│   │   ├── seo/             — JSON-LD structured data components
│   │   └── ui/              — Primitives (Button, Heading, Text, LinkButton, Brand, etc.)
│   ├── hooks/               — Custom React hooks (useButtonTracking, useScrollLock, useFocusTrap)
│   ├── i18n/                — next-intl routing, locale-aware navigation wrappers, request handler
│   ├── lib/
│   │   ├── actions/         — Server Actions (empty, ready for per-project additions)
│   │   ├── config/          — Typed config objects (site, routes, navigation)
│   │   ├── consent/         — Consent storage seam (ConsentStorage interface, createCookieStorage, createFakeStorage)
│   │   ├── hooks/           — Internal lib hooks
│   │   ├── seo/             — SEO helpers (metadata builder, schema builders)
│   │   ├── server/          — Server-only utilities
│   │   ├── styles/          — fonts.ts (Geist font configuration)
│   │   ├── env.ts           — Zod environment variable validation
│   │   ├── events.ts        — Type-safe analytics event descriptors
│   │   └── utils.ts         — cn() class merging utility
│   └── proxy.ts             — Middleware (i18n routing only — security headers applied via next.config.ts)
├── tests/                   — Playwright E2E smoke tests
├── CONTEXT.md               — This file (exhaustive reference)
├── README.md                — Quick orient (stack, conventions, quick-start)
└── [config files]           — eslint, prettier, commitlint, vitest, playwright, postcss, tailwind, next, tsconfig
```

**Key rule:** Never put client-specific code in `src/components/`. Add it to `project-components/` instead, inside a subdirectory named after the client or feature.
