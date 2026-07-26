# TODO.md — Active Implementation Tasks & Sprint Roadmap

> **Current Sprint**: Phase 3 (Production Hardening & Final Release) — `ALL TASKS COMPLETED (100%)`  
> **Status**: Ready for Production Deployment (`v1.0.0`)

---

## 1. Phase 3: Final Production Release (`v1.0.0`) — [ALL COMPLETED]

- [x] **[CRITICAL] Chrome Extension SPA Navigation Support**
  - [x] Integrate `MutationObserver` into `chrome-extension/src/content.ts` for LinkedIn job selection changes.
  - [x] Bind native `yt-navigate-finish` event listener for YouTube in-page video navigations.
- [x] **[HIGH] Distributed Serverless Rate Limiting**
  - [x] Implement `@upstash/ratelimit` and `@upstash/redis` in `lib/security/rate-limiter.ts`.
  - [x] Add fallback in-memory token bucket for local development when Upstash credentials are unset.
- [x] **[HIGH] Runtime Request Schema Validation**
  - [x] Define Zod schemas (`IntentRequestSchema`, `ActionRequestSchema`) in `lib/security/schemas.ts`.
  - [x] Enforce Zod validation in `app/api/ai/intent/route.ts` and `app/api/ai/action/route.ts`.
- [x] **[MEDIUM] AI Reliability & DOM Strictness**
  - [x] Remove static title fallbacks from `content.ts`; display diagnostic `"CANNOT_DETECT_DOM"` badge when selectors break.
  - [x] Add exponential backoff retry with jitter (`withExponentialBackoff`) in `lib/gemini/client.ts`.
- [x] **[LOW] Accessibility & Developer Handoff Suite**
  - [x] Add WAI-ARIA button semantics (`role="button"`, `tabIndex={0}`, keyboard handlers) to all clickable UI cards.
  - [x] Create 6 developer handoff guides (`COMPLETE_SETUP_GUIDE.md`, `MANUAL_INPUTS.md`, `CHROME_EXTENSION_GUIDE.md`, `PROJECT_VERIFICATION.md`, `FINAL_DEPLOYMENT_GUIDE.md`, `RELEASE_NOTES.md`).
  - [x] Create automated CLI diagnostic check (`health-check.js`) and verify 7/7 checks pass.

---

## 2. Future Sprint: Phase 4 (v1.1.0 – v1.2.0 Roadmap)

- [ ] **[v1.1.0] Real-Time Markdown Token Streaming**
  - [ ] Implement Server-Sent Events (SSE) `/api/ai/stream` endpoint for live character-by-character Markdown rendering.
- [ ] **[v1.2.0] Multi-Platform Extension Adapters**
  - [ ] Add `TwitterParser` for X/Twitter thread summarization and smart reply generation.
  - [ ] Add `GitHubParser` for Pull Request diff analysis and automated review notes.
- [ ] **[v2.0.0] Enterprise Teams & Shared Workspaces**
  - [ ] Create Supabase organization tables (`organizations`, `org_members`) with team-shared Action Cards.
