# COMPLETE_SETUP_GUIDE.md — Complete Beginner-Friendly Developer Onboarding

Welcome to **Promptless AI**! This guide is written for engineers who have never seen this codebase before. Following these instructions will get both the Next.js SaaS web application and the Manifest V3 Chrome Extension running locally on your machine in under **10 minutes**.

---

## Prerequisites

1. **Node.js v18+ or v20+**
   - Download: [https://nodejs.org](https://nodejs.org)
   - Verify: `node -v` (Must be `>= v18.0.0`)
2. **npm v9+**
   - Verify: `npm -v`
3. **Google Chrome Browser**
   - Required for testing the Manifest V3 Chrome Extension Side Panel.

---

## Step 1: Clone Repository & Install Monorepo Dependencies

Open your terminal and execute:

```bash
# Clone the repository
git clone https://github.com/Samraatsharma/promptless-ai.git
cd promptless-ai

# Install root Next.js dependencies (includes Tailwind CSS 4, Framer Motion, Zod, Upstash, Google GenAI)
npm install

# Install Chrome Extension workspace dependencies (Vite, TypeScript, React 19)
npm --prefix chrome-extension install
```

> **Automated Setup Shortcut (macOS / Linux)**:
> You can also simply run `./setup.command` in your terminal to automate the dependency installation above!  
> **Windows**: Double-click `setup.bat`.

---

## Step 2: Configure Environment Variables

Create your `.env.local` file from the provided `.env.example` template:

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and configure the following:

```env
# 1. Supabase Connection (Required for real database persistence and RLS)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 2. Google Gemini API Key (Required for live AI generation; fallback mocks used if unset)
GEMINI_API_KEY=AIzaSyYourGoogleGeminiApiKeyHere

# 3. Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Optional Upstash Redis (Serverless Distributed Rate Limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Step 3: Run the Automated Diagnostic Health Check

Before starting dev servers, run the health check CLI script to verify your setup:

```bash
node health-check.js
```

**Expected Output**:
```text
====================================================
    PROMPTLESS AI — DIAGNOSTIC HEALTH CHECK CLI      
====================================================

[✔ PASS] Node.js version v24.14.1 is compatible (>= 18.x)
[✔ PASS] All core monorepo directories are present and intact
[✔ PASS] .env.local file found
...
[SUCCESS] Promptless AI is healthy and ready for local development / production deployment!
```

---

## Step 4: Build & Load the Chrome Extension

1. Build the Chrome Extension bundle using Vite:
   ```bash
   npm --prefix chrome-extension run build
   ```
   *This outputs the extension to `/chrome-extension/dist`.*
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** via the toggle in the top-right corner.
4. Click the **Load unpacked** button in the top-left toolbar.
5. Select the `/chrome-extension/dist` directory inside your cloned project.
6. The Promptless AI card will appear in your extension list!

---

## Step 5: Start Local Development Servers

In your terminal, start the Next.js SaaS development server:

```bash
npm run dev
```

Your web application is now running at:
- **Landing Page & Step Inspector**: [http://localhost:3000](http://localhost:3000)
- **Dashboard Workspace**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **API Endpoints**:
  - `POST http://localhost:3000/api/ai/intent`
  - `POST http://localhost:3000/api/ai/action`

> **Automated Run Shortcut**:
> On macOS/Linux, run `./run.command`. On Windows, double-click `run.bat`.

---

## Step 6: Verify End-to-End Functionality

### 1. Verify Frontend (Apple / Arc Glassmorphism UI)
- Visit [http://localhost:3000](http://localhost:3000) in Chrome.
- Scroll through the landing page and interact with the **Animated Browser Demo**.
- Click the macOS traffic lights or toggle between **LinkedIn Jobs** and **YouTube Video** scenarios.
- Click any **Action Card** (e.g., *Generate Cover Letter* or *Smart Notes*) and observe the animated modal slide up with formatted Markdown and a working **Download .MD** button.

### 2. Verify Chrome Extension Side Panel on LinkedIn & YouTube
- Open a YouTube video tab (e.g., any tech lecture or interview).
- Click the Promptless AI extension icon in your Chrome toolbar or open the Side Panel (<kbd>Alt + P</kbd> / Chrome Side Panel menu).
- Verify that the extension automatically extracts the **Video Title** and **Channel Name**, displays a `"Video Detected"` badge, and renders 4 Action Cards.
- Click **Smart Notes** or **AI Summary**; verify the generated Markdown displays cleanly and can be copied or downloaded instantly.
- Repeat the test on a LinkedIn Job posting tab.
