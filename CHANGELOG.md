# Changelog - Promptless AI

All notable changes to the Promptless AI venture-backed platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-26
### Added
- **Module 1: Architecture & Permanent Documentation**
  - Designed monorepo folder architecture for Next.js 15 SaaS application and Chrome Extension Manifest V3.
  - Documented core project goals, decisions, progress, and changelog (`PROJECT_CONTEXT.md`, `DECISIONS.md`, `PROJECT_PROGRESS.md`, `TODO.md`, `CHANGELOG.md`, `README.md`).
- **Module 2: Premium Design System & UI Primitives**
  - Handcrafted `#09090B` deep dark theme with custom ambient aurora blobs, noise grain overlays, and glassmorphism styling.
  - Built reusable, accessible UI components in `@/components/ui/` (`Button`, `GlassCard`, `Badge`, `Skeleton`, `CopyButton`, `ChromeIcon`).
- **Module 3: Database & Auth Architecture**
  - Created complete Supabase SQL migration (`001_initial_schema.sql`) for `users`, `generated_content`, `activity_history`, and `preferences` with Row Level Security (RLS) policies and trigger-based user initialization.
  - Engineered Supabase SSR client utilities (`@/lib/supabase/client.ts`, `@/lib/supabase/server.ts`) and `useAuth` hook.
- **Module 4: High-Converting Landing Page & Animated Browser Demo**
  - Created marketing landing page with navigation bar, hero section, interactive zero-click demo, architecture breakdown, privacy badges, and CTA banner.
  - Built `AnimatedBrowserDemo` component showing a live loop of DOM extraction, intent classification, and instant cover-letter / smart-note generation.
- **Module 5: Authenticated SaaS Dashboard**
  - Designed and implemented 5-tab SaaS workspace (`Recent Outputs`, `Saved Results`, `Usage Analytics`, `User Profile`, and `AI Preferences`).
  - Added empty state layouts, shimmer skeletons, and live interactive UI controls.
- **Module 6: Secure Backend API & Google Gemini AI Integration**
  - Created `/api/ai/intent` and `/api/ai/action` endpoints powered by `@google/genai` (Google Gemini 2.5 Flash SDK).
  - Implemented high-signal zero-chat prompt templates (`lib/gemini/prompts.ts`) and structured executive markdown formatting.
  - Integrated Supabase `activity_history` and `generated_content` database persistence.
- **Module 7: Chrome Extension Manifest V3 Side Panel**
  - Implemented separate monorepo workspace in `chrome-extension/` with Manifest V3 configuration, Vite build scripts, and permissions for `sidePanel`, `activeTab`, and `storage`.
  - Created content scripts for LinkedIn Jobs (`linkedin.ts`) and YouTube Videos (`youtube.ts`) that read DOM metadata without user text input.
  - Built 420px glassmorphic React side panel with 5-step animated Intent Analyzer (`Analyzer.tsx`), Ready Action cards (`ActionCards.tsx`), and slide-in Markdown output modal (`OutputScreen.tsx`).
- **Module 8: End-to-End Quality & Build Audit**
  - Configured ESLint flat config to verify 0 errors and 0 warnings across the entire monorepo.
  - Verified 100% production build success for Next.js (`npm run build`) and Chrome Extension bundle (`npm run build` inside `chrome-extension/`).
