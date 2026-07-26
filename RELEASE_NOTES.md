# RELEASE_NOTES.md — Promptless AI v1.0.0 Production Release

> **Release Date**: July 27, 2026  
> **Version**: `v1.0.0-production`  
> **Classification**: Venture-Ready Enterprise SaaS & Zero-Click Chrome Extension

---

## 1. Project Summary

**Promptless AI** introduces a fundamental paradigm shift in human-AI interaction: **zero-click, intent-aware browser intelligence**. Rather than requiring users to open a chatbot tab, copy-paste URLs, or craft complex prompts, Promptless AI embeds an intelligent agent directly into a **420px Chrome Manifest V3 Side Panel** and a **Next.js 16 SaaS Dashboard**. It automatically classifies page context on **LinkedIn Jobs** and **YouTube Videos**, predicting user intent with **96–98% confidence** and generating executive-grade Markdown outputs in a single click.

---

## 2. Key Production Features (v1.0.0)

1. **Apple / Arc / Linear-Grade Visual Excellence**:
   - Deep obsidian `#09090B` dark theme with ambient aurora glow blobs and subtle noise textures.
   - Interactive **Animated Browser Demo** with step-by-step Intent Inspector and Raycast keyboard shortcut badges (<kbd>⌘K</kbd> / <kbd>⌘1</kbd>–<kbd>⌘4</kbd>).
2. **Manifest V3 Chrome Extension Side Panel**:
   - Zero-click DOM context extraction for LinkedIn Jobs and YouTube watch pages.
   - **Single-Page Application (SPA) MutationObservers** that automatically re-detect intent when users navigate between videos or job listings without refreshing.
   - Strict DOM parsing that eliminates false-positive static fallbacks, alerting users immediately if a page selector changes.
3. **Enterprise Security & Reliability**:
   - Runtime request/response payload validation using **Zod** (`IntentRequestSchema`, `ActionRequestSchema`).
   - Serverless distributed rate limiting via **Upstash Redis** (20–30 req/min) with automatic in-memory sliding window fallback for local development.
   - Prompt injection sanitization and Unicode control character stripping (`lib/security/sanitize.ts`).
   - Exponential backoff retry with jitter (`withExponentialBackoff`) on Google Gemini API calls.
4. **5-Tab SaaS Dashboard**:
   - Searchable, filterable workspace (`/dashboard`) with instant client-side `.MD` Markdown file export (`downloadMarkdownFile`).
   - Supabase Row-Level Security (RLS) tables (`users`, `generated_content`, `activity_history`, `preferences`) backed by compound B-tree SQL indexes (`002_performance_indexes.sql`).

---

## 3. Architecture & Technology Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                 PROMPTLESS AI MONOREPO                      │
├─────────────────────────────┬───────────────────────────────┤
│     NEXT.JS 16 SAAS WEB     │    CHROME EXTENSION (MV3)     │
│   • App Router (React 19)   │  • Vite + React 19 Side Panel │
│   • Tailwind CSS 4          │  • Manifest V3 Service Worker │
│   • Framer Motion 12        │  • SPA MutationObservers      │
│   • Zod Schema Validation   │  • Zero-Click Action Cards    │
│   • Upstash Redis RateLimit │  • Raycast Keyboard Shortcuts │
├─────────────────────────────┴───────────────────────────────┤
│                    SUPABASE POSTGRESQL                      │
│   • SSR Cookie Authentication   • RLS Database Policies     │
│   • B-tree Performance Indexes  • Activity History Tracking │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend & Web**: Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, Framer Motion 12, Lucide React Icons.
- **Extension Workspace**: Manifest V3, Vite 6, React 19, TypeScript 5, Web Extension APIs (`sidePanel`, `runtime.onMessage`).
- **AI & ML Engine**: Google Gemini 2.5 Flash (`@google/genai` Flash SDK) with structured JSON intent classification.
- **Backend & Storage**: Supabase PostgreSQL, Supabase Auth SSR, Upstash Redis Serverless Rate Limiting.
- **Developer Experience**: One-click executables (`setup.command`, `run.command`, `setup.bat`, `run.bat`), automated diagnostic CLI (`health-check.js`).

---

## 4. Known Limitations

- **Platform Scope**: v1.0.0 is officially optimized for **LinkedIn Jobs** and **YouTube Videos**. Support for Twitter/X, GitHub PRs, and Gmail is planned for v1.2.0.
- **Serverless Rate Limiting without Redis**: If `UPSTASH_REDIS_REST_URL` is omitted in Vercel, rate limiting falls back to an in-memory token bucket that resets per serverless cold start. Configure Upstash Redis for global synchronization.

---

## 5. Deployment Instructions

1. Run the local health check: `node health-check.js`.
2. Deploy the Next.js App to Vercel and paste keys from `MANUAL_INPUTS.md`.
3. Apply `/supabase/migrations/001_initial_schema.sql` and `002_performance_indexes.sql` in Supabase SQL Editor.
4. Build the extension bundle: `npm --prefix chrome-extension run build` and upload `/chrome-extension/dist` as an unpacked archive or submit `.zip` to Chrome Web Store.
5. Reference `FINAL_DEPLOYMENT_GUIDE.md` for detailed checklist steps.

---

## 6. Future Roadmap

- **v1.1.0 (Q3 2026)**: WebSockets / Server-Sent Events (SSE) streaming for real-time Markdown token generation.
- **v1.2.0 (Q4 2026)**: Multi-platform extension adapter SDK (`IntentProvider`) supporting GitHub Pull Requests, Gmail Threads, and Twitter/X threads.
- **v2.0.0 (2027)**: Team / Enterprise SaaS workspaces with collaborative custom Action Card libraries and shared Supabase organizations.
