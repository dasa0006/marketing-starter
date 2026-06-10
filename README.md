# Marketing Starter

A production-ready Next.js template for client marketing websites. Clone it, configure your brand, compose pages from blocks, and ship. Zero boilerplate setup.

## Reading Guide

This project ships with several documentation files. Which one you need depends on what you're doing:

| If you want to...                                       | Read this                    |
| ------------------------------------------------------- | ---------------------------- |
| Get a quick overview of the project (you're here)       | **README.md** ← you are here |
| Understand the project's glossary and domain language   | `CONTEXT.md`                 |
| Learn the architecture (providers, consent, i18n, ADRs) | `docs/architecture.md`       |
| Contribute — conventions, how-tos, decision trees       | `docs/contributing.md`       |
| Navigate the directory structure                        | `docs/orientation.md`        |
| Review architectural decisions and their rationale      | `docs/adr/`                  |
| Understand the quality-gate pipeline and tooling layers | `docs/quality-gates.md`      |

> **Note:** `CONTEXT.md` is a reference file designed to aid AI agents with the project's glossary. It is not a human-facing onboarding doc — if you are setting up the project for the first time, this README is where you should start.

## Philosophy

This template exists to eliminate the 1–2 days of boilerplate required to start a new marketing website. Every decision in this project serves three goals:

1. **Consistency over cleverness.** Conventions are strict and enforced by config (ESLint, Husky, TypeScript strict). There should be one obvious way to do something, not three.
2. **AI-friendly by design.** The manifest + context files, explicit file conventions, and data-driven page composition mean an AI can understand the project in one read — without re-deriving architecture from scratch each time.
3. **Patterns over projects.** Components ship in the template only if they solve a pattern seen across 2+ client projects. Everything else goes in `project-components/`.

### What this template is for

Marketing websites for clients. No heavy backend, no e-commerce, no authentication, no database.

### What this template explicitly avoids

- Over-engineering (auto-CSP-hash generators, custom image loaders)
- Premature abstraction (generating features before seeing the pattern twice)
- Framework coupling beyond Next.js + React (no CMS, no analytics provider by default)
- Barrel exports and index.js files (imports are explicit so tools can trace dependencies)

## Stack

| Layer           | Choice                                                       |
| --------------- | ------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router, Turbopack)                           |
| Language        | TypeScript strict                                            |
| Styling         | Tailwind CSS v4                                              |
| i18n            | next-intl (en + da, as-needed prefix)                        |
| Dark mode       | next-themes (system + user toggle)                           |
| Testing         | Vitest (unit) + Playwright (E2E) + Storybook (visual + a11y) |
| Package manager | pnpm                                                         |
| Git hooks       | Husky + commitlint (conventional commits)                    |

## TL;DR Conventions

- All source in `src/`
- Components split into: `ui/` (primitives) → `blocks/` (patterns) → `layout/` (chrome) → `pages/` (assemblies)
- **Never** put client code in `src/components/` — use `project-components/`
- Pages compose blocks directly: each block is wrapped in a `Section` that owns its surface, size, and full-bleed behaviour
- Components follow tier-based file conventions: Tier 0 (flat file, no story), Tier 1 (story + mock), Tier 2 (+ unit test)

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

| Category   | Components                                                                               |
| ---------- | ---------------------------------------------------------------------------------------- |
| **UI**     | Button, LinkButton, Heading, Text, Image, Brand, LocaleSwitcher, ToggleMode              |
| **Blocks** | Hero, FeatureGrid, CTA, TextBlock                                                        |
| **Layout** | SiteHeader, SiteFooter, Section, MobileDrawer, CookieBanner                              |
| **Pages**  | Index (home), About, Privacy Policy, Cookie Policy                                       |
| **Hooks**  | useButtonTracking, useScrollLock, useFocusTrap                                           |
| **SEO**    | JSON-LD (Organization, WebSite, BreadcrumbList), dynamic OG image, sitemap, robots.txt   |

## What's NOT Included (add per-project)

Contact forms, pricing tables, testimonials, blog listings, CMS integrations, analytics vendor code, custom image loaders.
