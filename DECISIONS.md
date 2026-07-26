# DECISIONS.md — Architecture & Engineering Decision Log (ADR)

This file documents all major architectural, design, and implementation decisions made in **Promptless AI**.

---

## ADR-001: Zero-Click Intent Architecture over Chatbot Textboxes

- **Date**: July 26, 2026
- **Context**: Most AI assistants force users into conversational chat interfaces, requiring manual URL copy-pasting and prompt engineering.
- **Decision**: We eliminated chat textboxes entirely. The browser extension and web app automatically analyze DOM context (`ExtractedPageContext`) and classify intent into structured JSON (`IntentResult`), presenting 4 high-signal Action Cards.
- **Consequences**:
  - **Positive**: Reduces time-to-value from ~3 minutes to < 3 seconds; eliminates user prompt anxiety.
  - **Negative**: Requires custom DOM extraction scripts for each supported website (LinkedIn, YouTube).

---

## ADR-002: Manifest V3 Side Panel API (`sidePanel`)

- **Date**: July 26, 2026
- **Context**: Traditional Chrome extensions use popup bubbles (`default_popup`) that close whenever the user clicks away on the web page.
- **Decision**: We built a **420px docked Side Panel** (`sidepanel.html`) using Chrome Manifest V3's `sidePanel` API.
- **Consequences**:
  - **Positive**: The AI workspace stays permanently open while the user browses job listings or watches lectures.
  - **Negative**: Requires Chrome 114+ (not compatible with legacy MV2 browsers).

---

## ADR-003: Hybrid Serverless Rate Limiting (`@upstash/ratelimit`)

- **Date**: July 27, 2026
- **Context**: In Vercel serverless environments, in-memory rate limiting variables are reset on every cold start and are not shared across edge regions.
- **Decision**: We integrated `@upstash/ratelimit` with `@upstash/redis` in `lib/security/rate-limiter.ts`. In production (`UPSTASH_REDIS_REST_URL` set), rate limits synchronize across distributed Redis clusters; in local development, it falls back seamlessly to an in-memory token bucket.
- **Consequences**:
  - **Positive**: Protects Gemini AI API quota from DDOS or abuse across serverless regions without requiring local Redis installation for developers.
  - **Negative**: Requires Upstash REST URL and Token in production Vercel environment variables.

---

## ADR-004: Runtime Payload Validation with Zod (`schemas.ts`)

- **Date**: July 27, 2026
- **Context**: TypeScript types are erased at compile time, leaving API endpoints vulnerable to malformed or malicious client POST requests.
- **Decision**: We created `lib/security/schemas.ts` using **Zod** (`IntentRequestSchema`, `ActionRequestSchema`) and wrap `/api/ai/intent` and `/api/ai/action` payloads in `safeParse()`.
- **Consequences**:
  - **Positive**: Rejects invalid payloads with clean `400 Bad Request` messages before consuming Gemini token quota or database queries.
  - **Negative**: Adds ~12 KB to server-side bundle size (negligible).

---

## ADR-005: Chrome Extension SPA MutationObservers (`content.ts`)

- **Date**: July 27, 2026
- **Context**: LinkedIn Jobs and YouTube are Single-Page Applications (SPAs) that update DOM content without full page reloads.
- **Decision**: We upgraded `chrome-extension/src/content.ts` with a **MutationObserver** for LinkedIn job list selections and a `yt-navigate-finish` listener for YouTube video navigations.
- **Consequences**:
  - **Positive**: Automatically re-extracts page metadata and refreshes Side Panel Action Cards when the user clicks a new job or video without manual refresh.
  - **Negative**: Requires careful debouncing (`250ms`) to prevent observer flood during rapid clicks.

---

## ADR-006: Apple / Arc / Linear Dark Glassmorphism Design System

- **Date**: July 26, 2026
- **Context**: Enterprise B2B software often suffers from flat, generic dashboards.
- **Decision**: We built a custom Tailwind CSS 4 design token hierarchy centered on deep obsidian `#09090B`, ambient aurora gradient glow blobs, glassmorphic card borders (`white/10`), and 60 FPS Framer Motion micro-interactions.
- **Consequences**:
  - **Positive**: Delivers an immediate "WOW" factor that feels like software crafted by Apple, Arc Browser, Linear, or Raycast.
  - **Negative**: Requires GPU-accelerated backdrop filters (`backdrop-blur-xl`) in stylesheets.
