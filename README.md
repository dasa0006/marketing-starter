# Marketing Starter

A production-ready Next.js template for client marketing websites. Clone it, configure your brand, build your own UI, and ship. Zero boilerplate setup for the parts every marketing site needs.

## Reading Guide

This project ships with several documentation files. Which one you need depends on what you're doing:

| If you want to...                                       | Read this                    |
| ------------------------------------------------------- | ---------------------------- |
| Get a quick overview of the project (you're here)       | **README.md** ← you are here |
| Understand the project's glossary and domain language   | `CONTEXT.md`                 |
| Learn the architecture (providers, consent, i18n, ADRs) | `docs/architecture.md`       |
| Contribute — conventions, how-tos, decision trees       | `docs/contributing.md`       |
| Review architectural decisions and their rationale      | `docs/adr/`                  |
| Understand the quality-gate pipeline and tooling layers | `docs/quality-gates.md`      |

> **Note:** `CONTEXT.md` is a reference file designed to aid AI agents with the project's glossary. It is not a human-facing onboarding doc — if you are setting up the project for the first time, this README is where you should start.

## Philosophy

This template exists to eliminate the 1–2 days of boilerplate required to start a new marketing website. Every decision in this project serves three goals:

1. **Consistency over cleverness.** Conventions are strict and enforced by config (ESLint, Husky, TypeScript strict). There should be one obvious way to do something, not three.
2. **AI-friendly by design.** The manifest + context files, explicit file conventions, and a small, well-documented surface mean an AI can understand the project in one read — without re-deriving architecture from scratch each time.
3. **Scaffold over opinions.** The template ships the cross-cutting infrastructure every marketing site needs (i18n, consent, security, SEO, analytics plumbing) and leaves the visual layer — components, blocks, layout, and theme — for the end-user to build in their own project instance.

### What this template is for

Marketing websites for clients. No heavy backend, no e-commerce, no authentication, no database.

### What this template explicitly avoids

- Over-engineering (auto-CSP-hash generators, custom image loaders)
- Premature abstraction (generating features before seeing the pattern twice)
- Framework coupling beyond Next.js + React (no CMS, no analytics provider by default)
- Barrel exports and index.js files (imports are explicit so tools can trace dependencies)
- A shipped component library or design system — the visual layer is left to the project

## Stack

| Layer           | Choice                                                              |
| --------------- | ------------------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack)                                  |
| Language        | TypeScript strict                                                   |
| Styling         | Tailwind CSS v4                                                     |
| i18n            | next-intl (en + da, as-needed prefix)                               |
| Consent         | Cookie-consent provider with storage seam                           |
| Security        | CSP + security headers via `next.config.ts`                         |
| SEO             | JSON-LD, canonical/hreflang metadata, sitemap, robots.txt, OG image |
| Testing         | Vitest (unit + coverage) + Playwright (E2E)                         |
| Package manager | pnpm                                                                |
| Git hooks       | Husky + commitlint (conventional commits)                           |

## TL;DR Conventions

- All source in `src/`
- No barrel exports — imports are explicit so tools can trace dependencies
- Server/Client component boundaries marked with `"use client"` only where needed
- Per-project brand config lives in `src/lib/config/site.ts` (override seam — see `CONTEXT.md`)

## Quick-Start

```bash
# 1. Clone for a client project
git clone <url> my-client-site && cd my-client-site

# 2. Set your brand
cp .env.example .env.local    # edit NEXT_PUBLIC_SITE_URL
edit src/lib/config/site.ts   # name, description, social links (override seam — see CONTEXT.md)

# 3. Start building
pnpm install && pnpm dev
```

## What's Included?

| Category      | What ships                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------- |
| **i18n**      | next-intl with `en` + `da`, `as-needed` URL prefix, base/custom message split                   |
| **Consent**   | Cookie-consent provider with an injectable storage seam + event-gating                          |
| **Security**  | CSP (dev vs prod), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, HSTS         |
| **SEO**       | JSON-LD (Organization, WebSite), canonical/hreflang metadata, dynamic OG image, sitemap, robots |
| **Analytics** | Typed event system with `track.event()`, consent-gated, vendor-agnostic adapter                 |
| **Hooks**     | `useButtonTracking`, `useScrollLock`, `useFocusTrap`                                            |
