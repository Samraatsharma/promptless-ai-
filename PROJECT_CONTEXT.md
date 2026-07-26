# Project Context - Promptless AI

## 1. Product Vision
Promptless AI is a premium, venture-backed-grade Chrome Extension combined with a Next.js 15 SaaS web application. It transforms the browser into an intelligent, proactive agent that anticipates user intent on supported pages and presents instant, high-confidence AI action cards—eliminating manual prompt engineering, copy-pasting, and chatbot textboxes entirely.

## 2. Mission
The traditional AI workflow forces users to copy text, paste it into a separate tab, write an explicit prompt, wait, copy the result, and paste it back into their work. Promptless AI removes this workflow. By intelligently observing the user's active page, Promptless AI surfaces zero-click suggestions and completes complex tasks instantly.

## 3. Supported Platforms (MVP Version 1)
- **LinkedIn**: Helping users apply for jobs faster and more effectively.
  - Features: `Tailor Resume`, `Generate Cover Letter`, `Company Research`, `Interview Questions`, `ATS Suggestions`.
- **YouTube**: Helping users learn from educational video content faster.
  - Features: `Smart Notes`, `Smart Summary`, `Flashcards`, `Quiz`, `Key Takeaways`.

## 4. Out of Scope (MVP)
- GitHub, Notion, Docs websites
- Voice AI, Mobile App, PDF Upload, OCR
- Multi-language support, Offline Mode, Team Collaboration
- **No Chat Interface**: Absolutely no chat textboxes, ask-AI inputs, avatars, or conversation history. Everything is action-based.

## 5. Architecture Summary
- **Monorepo Architecture**: Co-locates Next.js 15 App Router (`app/`), Chrome Extension Manifest V3 Side Panel (`chrome-extension/`), database migrations (`supabase/`), shared types (`types/`), and UI components (`components/`).
- **Secure AI Pipeline**: The extension side panel sends DOM metadata to Next.js API Routes (`/api/ai/intent`, `/api/ai/action`). The backend authenticates via Supabase session JWT and invokes Google Gemini API with strict structured JSON schemas.
- **Chrome Side Panel**: Built with Vite + React + Tailwind CSS + Framer Motion inside `/chrome-extension`, providing a sleek 420px dark glassmorphic UI.

## 6. Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v3.4, Framer Motion, shadcn/ui primitives, Lucide Icons.
- **Backend**: Next.js API Routes, Google Gemini (`@google/genai` - Gemini 3.1 Pro / 1.5 Flash).
- **Database & Auth**: Supabase (Postgres, Row Level Security, Google & Email Login).
- **Extension**: Manifest V3, Side Panel API, Content Scripts.
- **Hosting**: Vercel.

## 7. Design & UI Standards
- **Inspiration**: Apple, Linear, Arc Browser, Raycast, Stripe, Vercel, Perplexity.
- **Aesthetic**: Deep `#09090B` background, Glassmorphism cards with backdrop-blur, Aurora animated gradient blobs, subtle Noise texture overlay, and animated borders.
- **Typography**: Inter (with carefully tuned font-weights and letter spacing).
- **Animations**: 60 FPS Framer Motion micro-interactions, spring animations, and smooth page transitions.

## 8. Coding Standards
- Strict TypeScript (`noImplicitAny`, strict null checks).
- Reusable, atomized React components following SOLID principles.
- Clean Architecture with separation of concerns (`services/`, `lib/`, `components/`, `types/`).
- Comprehensive error handling with structured Problem/Reason/Fix/Verification payloads.

## 9. Folder Structure
```
promptless-ai/
├── app/                  # Next.js 15 App Router (Landing, Dashboard, Auth, API routes)
├── components/           # Reusable UI & Layout Components (landing, dashboard, ui, icons)
├── chrome-extension/     # Manifest V3 Side Panel React app & Content Scripts
├── hooks/                # Shared React custom hooks
├── lib/                  # Core utilities (Supabase, Gemini, errors)
├── services/             # Domain logic (LinkedInParser, YouTubeParser, IntentEngine)
├── styles/               # Design tokens & Aurora/Noise effects
├── supabase/             # SQL schemas & migrations
├── types/                # Shared TypeScript definitions
└── [Documentation Files] # README, PROJECT_CONTEXT, PROJECT_PROGRESS, DECISIONS, TODO, CHANGELOG
```
