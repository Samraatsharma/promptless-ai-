# CONTRIBUTING.md — Venture-Backed Engineering Standards & Open Source Guide

First off, thank you for considering contributing to **Promptless AI**!  
We treat this repository as a production-grade, venture-backed startup codebase. Whether you are fixing a bug, adding support for a new platform, or enhancing UI animations, we value clean, scalable, secure, and beautiful engineering.

---

## 1. Our Core Engineering Principles

1. **Never optimize for the easiest implementation**. Always optimize for **Scalability**, **Maintainability**, **Beautiful UI**, **Security**, **Performance**, and **Developer Experience (DX)**.
2. **SOLID Architecture**: Keep UI components decoupled from AI inference and domain parsing logic.
3. **Strict Type Safety**: Every function, component, and API route must have explicit TypeScript types. Zero `any` casts.
4. **Apple / Arc / Linear Aesthetic**: All UI components must use `#09090B` deep obsidian backgrounds, subtle glassmorphism borders (`white/10`), vibrant HSL primary/accent glows (`#4F8DFF` and `#8B5CF6`), and smooth 60 FPS Framer Motion animations.
5. **WAI-ARIA Accessibility**: All clickable Action Cards or interactive widgets must include `role="button"`, `tabIndex={0}`, and keyboard Enter/Space handlers.

---

## 2. Setting Up Your Development Environment

You can get the entire monorepo running locally in under **10 minutes** using our automated scripts or manual setup:

```bash
# 1. Clone your fork of the repository
git clone https://github.com/<your-username>/promptless-ai.git
cd promptless-ai

# 2. Automated setup shortcut (macOS/Linux)
./setup.command

# Or manually install dependencies
npm install
npm --prefix chrome-extension install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Run the diagnostic health check CLI
node health-check.js
```

---

## 3. Creating a Branch & Committing

Please follow the **Conventional Commits** specification for all git commit messages:
- `feat: add GitHub pull request zero-click summary card`
- `fix: resolve SPA observer race condition on LinkedIn job switch`
- `refactor: optimize Zod payload schema validation performance`
- `docs: update COMPLETE_SETUP_GUIDE with Upstash Redis setup instructions`

---

## 4. Submitting a Pull Request (PR)

Before submitting a PR, run the following verification commands to ensure zero regressions:

```bash
# 1. Run ESLint audit across the entire monorepo
npm exec eslint .

# 2. Check TypeScript types
npx tsc --noEmit

# 3. Test Chrome Extension Manifest V3 production bundle
npm --prefix chrome-extension run build

# 4. Test Next.js 16 production web application build
npm run build

# 5. Execute final health check
node health-check.js
```

Once all tests pass, open a PR and fill out the `.github/pull_request_template.md` checklist!
