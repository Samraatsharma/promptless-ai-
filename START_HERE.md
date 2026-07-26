# ⚡️ START HERE — 10-Minute Developer Quickstart Guide

Welcome to **Promptless AI**! This document is designed to get you from a fresh `git clone` to a fully working, venture-backed production stack (Next.js 15 SaaS App + Chrome Extension Manifest V3 Side Panel + Supabase + Google Gemini 2.5 Flash) in **under 10 minutes**—with one command.

---

## The 10-Step Setup Checklist

### 1. Install Node.js (if missing)
- Ensure you have **Node.js 20.x or higher** installed.
- Check your terminal: `node -v`
- If missing, download from [nodejs.org](https://nodejs.org/) or use nvm (`nvm install 20`).

---

### 2. Run `setup.bat` (Windows Developers)
- Open your terminal or double-click `setup.bat` in the project root:
  ```cmd
  setup.bat
  ```
- What this script automatically does:
  - Verifies Node.js and npm installations.
  - Installs root Next.js dependencies (`npm install`).
  - Installs Chrome Extension dependencies (`cd chrome-extension && npm install`).
  - Generates `.env.local` from `.env.example` if it does not already exist.
  - Displays any required manual environment variable instructions.

---

### 3. Run `setup.command` (macOS / Linux Developers)
- Open your terminal in the project root and execute:
  ```bash
  chmod +x setup.command run.command
  ./setup.command
  ```
- Performs the exact same automated checks, dependency installations, and `.env.local` scaffolding as Windows.

---

### 4. Fill in Environment Variables (`.env.local`)
- Open the newly generated `.env.local` file in your editor.
- Refer to **[MANUAL_SETUP.md](MANUAL_SETUP.md)** for exact, step-by-step instructions on where to obtain:
  - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GEMINI_API_KEY` (from Google AI Studio)

---

### 5. Run `run.bat` (Windows) or `run.command` (macOS)
- Launch the development environment with a single command:
  - **Windows**: `run.bat`
  - **macOS / Linux**: `./run.command`
- What happens:
  - Starts the Next.js 15 App Router dev server on `http://localhost:3000`.
  - Builds and watches the Chrome Extension side panel bundle (`chrome-extension/dist`).
  - Automatically opens your default web browser to the local application.

---

### 6. Load the Chrome Extension in Google Chrome
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left).
4. Select the folder:
   ```
   promptless-ai/chrome-extension/dist
   ```
5. Pin the **Promptless AI** icon to your Chrome toolbar.

---

### 7. Verify Supabase Database Connection
1. Visit `http://localhost:3000/login`.
2. If the sign-in modal loads cleanly and allows login (or mock exploration), your Supabase connection and schema are active.

---

### 8. Verify Google Gemini 2.5 Flash AI
1. Go to `http://localhost:3000/dashboard`.
2. Click **"Simulate Extension Activity"** or trigger an action from the Chrome Extension Side Panel.
3. If executive Markdown is generated and displayed in under 3 seconds, Gemini is successfully authenticated.

---

### 9. Open `http://localhost:3000`
- Explore the Apple/Linear-inspired landing page, test the **Animated Browser Demo Loop** (LinkedIn $\to$ YouTube zero-click intent detection), and inspect your SaaS workspace.

---

### 10. Start Building Promptless AI!
- You are ready to contribute. For detailed architectural decisions, schema references, and design system guidelines, check out:
  - [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
  - [DECISIONS.md](DECISIONS.md)
  - [README.md](README.md)
