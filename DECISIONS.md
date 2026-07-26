# Architectural & Technical Decisions - Promptless AI

## Decision 001: Monorepo vs. Multi-Repo Structure
- **Problem**: Should the Next.js SaaS Web App and the Chrome Extension be built in separate git repositories or co-located in a monorepo?
- **Options Considered**:
  1. *Monorepo (`promptless-ai/` with `app/`, `chrome-extension/`, `types/`, `supabase/`)*.
  2. *Two Separate Git Repositories (`promptless-ai-web` and `promptless-ai-extension`)*.
- **Chosen Option**: Monorepo.
- **Reason**: Both client applications share TypeScript interfaces (`types/`), design tokens (`styles/`), and authenticate against the same backend API routes and Supabase database. Co-locating them ensures zero drift in API schemas and seamless local development.
- **Trade-offs**: Requires distinct build commands (`npm run build` for web, `npm run build:extension` for Chrome extension).

---

## Decision 002: Chrome Extension Side Panel Bundling & Framework
- **Problem**: How to build the 420px Manifest V3 Side Panel to achieve Apple/Linear-grade glassmorphism, Framer Motion 60 FPS animations, and interactive Markdown rendering?
- **Options Considered**:
  1. *Vite + React 19 + Tailwind CSS + Framer Motion in `/chrome-extension`*.
  2. *Vanilla JavaScript / HTML / CSS without a modern bundler*.
- **Chosen Option**: Vite + React 19 + Tailwind CSS + Framer Motion.
- **Reason**: Vanilla HTML/JS cannot maintain complex UI state (step-by-step analyzer -> animated action cards -> markdown output screen) without spaghetti DOM manipulation. Vite compiles a clean, highly optimized bundle (`/chrome-extension/dist`) for Chrome Side Panel.
- **Trade-offs**: Slightly larger bundle size than vanilla JS, mitigated by tree-shaking and modern Vite optimization.

---

## Decision 003: Secure AI Execution & Promptless Backend Architecture
- **Problem**: How to execute Gemini AI actions securely without exposing API keys or requiring client-side prompt engineering?
- **Options Considered**:
  1. *Next.js API Routes (`/api/ai/intent` & `/api/ai/action`) with strict JSON Schema output parsing and server-side Gemini invocation*.
  2. *Direct client-side Gemini API calls from the Chrome Extension content script / side panel*.
- **Chosen Option**: Next.js API Routes (`/api/ai/...`) with Server-Side Gemini SDK (`@google/genai`).
- **Reason**: Exposing API keys in browser extensions is a critical security vulnerability. Server-side execution allows us to authenticate requests via Supabase session JWTs, rate-limit usage, and enforce structured JSON outputs.
- **Trade-offs**: Extension requires network connectivity to our Next.js backend server.

---

## Decision 004: Shared Authentication Between Web App & Chrome Extension
- **Problem**: How to ensure a user logged into the Next.js SaaS app is seamlessly authenticated inside the Chrome Extension Side Panel?
- **Options Considered**:
  1. *Supabase Auth with Chrome Extension Cookie/Token Bridge (`chrome.cookies` or `/api/auth/session` token exchange)*.
  2. *Separate manual login form inside the Chrome Extension Side Panel*.
- **Chosen Option**: Supabase Auth with Extension Cookie/Token Bridge.
- **Reason**: Eliminates user friction by providing single sign-on (SSO) between the SaaS dashboard and the browser extension.
- **Trade-offs**: Requires configuring cross-origin permissions in `manifest.json` for our SaaS domain.
