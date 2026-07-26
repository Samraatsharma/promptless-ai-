# CHANGELOG.md — Release History & Version Tracking

All notable changes to **Promptless AI** will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-27 — *Production Release (Venture-Backed SaaS & MV3 Extension)*

### Added
- **Complete Developer Documentation Suite**:
  - `COMPLETE_SETUP_GUIDE.md`: 10-minute beginner developer onboarding guide.
  - `MANUAL_INPUTS.md`: Exhaustive production user checklist for API keys, OAuth, Supabase, and Upstash.
  - `CHROME_EXTENSION_GUIDE.md`: Manifest V3 architecture reference, side panel usage, and debugging.
  - `PROJECT_VERIFICATION.md`: 21-gate verification matrix confirming 100% compliance across all production quality gates.
  - `FINAL_DEPLOYMENT_GUIDE.md`: Step-by-step Vercel deployment, Supabase production SQL migrations, and Chrome Web Store packaging.
  - `RELEASE_NOTES.md`: Executive release notes with project summary, features, architecture, and roadmap.
  - `health-check.js`: Automated diagnostic CLI script verifying Node.js, monorepo integrity, environment variables, and build artifacts.
- **Chrome Extension SPA Support (`src/content.ts`)**:
  - Integrated `MutationObserver` for LinkedIn job selection changes (`.jobs-search__job-details`).
  - Added native event listener for YouTube in-page video navigations (`yt-navigate-finish`).
- **Security & Rate Limiting Hardening**:
  - `lib/security/schemas.ts`: Zod runtime validation schemas (`IntentRequestSchema`, `ActionRequestSchema`).
  - `lib/security/rate-limiter.ts`: Hybrid `@upstash/ratelimit` distributed serverless rate limiting with in-memory fallback.
  - `lib/gemini/client.ts`: Exponential backoff retry with jitter (`withExponentialBackoff`) for Google Gemini API resilience.
- **Accessibility & WAI-ARIA Semantics**:
  - Attached `role="button"`, `tabIndex={0}`, and keyboard Enter/Space handlers across all clickable Action Cards in `AnimatedBrowserDemo.tsx` and Landing Page features.
  - Created reusable client-side `.MD` Markdown download utility (`lib/utils/download-markdown.ts`).

### Changed
- Refactored `app/api/ai/intent/route.ts` and `app/api/ai/action/route.ts` to enforce Zod schema validation and standard response headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`).
- Upgraded `RecentOutputs.tsx` and `OutputScreen.tsx` to use unified `downloadMarkdownFile()` helper.
- Removed static title fallbacks from extension `content.ts` to ensure strict DOM parsing and accurate diagnostic reporting.

### Fixed
- Fixed rate-limit memory reset on serverless cold starts by enabling Upstash Redis synchronization.
- Fixed extension content script stale state during Single-Page Application (SPA) URL changes.
- Fixed keyboard accessibility on custom Action Cards.

---

## [0.2.0] - 2026-07-26 — *UI/UX Elevation & Dashboard Integration*

### Added
- **Apple / Arc / Linear Dark Glassmorphism Design System**:
  - Deep obsidian `#09090B` background with ambient aurora glow blobs and subtle noise textures.
  - Interactive **Animated Browser Demo** (`AnimatedBrowserDemo.tsx`) with real-time Step Inspector and Raycast keyboard shortcut badges (<kbd>⌘K</kbd> / <kbd>⌘1</kbd>–<kbd>⌘4</kbd>).
- **5-Tab SaaS Dashboard (`/dashboard`)**:
  - Tabs: Recent Outputs, Saved Results, Analytics & Activity, Profile & Preferences, System Health.
  - Instant client-side search filtering by title and markdown content.
- **Supabase Performance Indexes**:
  - `/supabase/migrations/002_performance_indexes.sql`: Compound B-tree indexes for lightning-fast dashboard queries.
- **One-Click Local Development Scripts**:
  - `setup.command` & `run.command` for macOS/Linux; `setup.bat` & `run.bat` for Windows.

---

## [0.1.0] - 2026-07-25 — *MVP Foundation & Manifest V3 Architecture*

### Added
- Initial Next.js 16 App Router SaaS application (`app/`).
- Chrome Extension Manifest V3 420px Side Panel (`chrome-extension/`).
- Google Gemini 2.5 Flash (`@google/genai` Flash SDK) intent classification engine.
- Supabase Authentication SSR and Row-Level Security database migration (`001_initial_schema.sql`).
