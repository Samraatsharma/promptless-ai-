# Manual Configuration & Credential Guide — Promptless AI

This document contains **ONLY** the credentials and configurations that require manual setup by a developer or system administrator. 

Every automated step is handled by `setup.bat` (Windows) or `setup.command` (macOS). For each manual credential below, follow the exact 6-step verification workflow.

---

## 1. Google Gemini API Key (`GEMINI_API_KEY`)

* **Why it is required**: Powered by `@google/genai`, Google Gemini 2.5 Flash analyzes DOM context (LinkedIn job descriptions & YouTube transcripts) and generates zero-click executive markdown without textboxes.
* **Where to obtain it**: [Google AI Studio](https://aistudio.google.com/app/apikey).
* **Exact steps**:
  1. Visit Google AI Studio and sign in with your Google account.
  2. Click **"Get API key"** in the left sidebar.
  3. Click **"Create API key"** and select a Google Cloud project (or create a new one).
  4. Copy the generated alphanumeric key string.
* **Expected format**: Alphanumeric string starting with `AIzaSy...` (approx. 39 characters).
* **Where to paste it**: In `/Users/samraatsharma/.gemini/antigravity/scratch/promptless-ai/.env.local` as:
  ```env
  GEMINI_API_KEY=AIzaSy...your_key_here
  ```
* **How to verify it works**:
  - Run the dev server (`npm run dev`) and make a POST request to `/api/ai/intent` with sample JSON payload.
  - Or click **"Simulate LinkedIn Job Action"** in the local SaaS Dashboard (`http://localhost:3000/dashboard`); a successful Markdown response confirms valid API authentication.

---

## 2. Supabase Project URL (`NEXT_PUBLIC_SUPABASE_URL`)

* **Why it is required**: Points the Next.js SaaS app and Chrome Extension to your dedicated Postgres database, authentication server, and Row Level Security (RLS) policies.
* **Where to obtain it**: [Supabase Dashboard](https://supabase.com/dashboard).
* **Exact steps**:
  1. Log into Supabase and click **"New Project"** (or open an existing project).
  2. In your Project Dashboard, navigate to **Project Settings** (gear icon in left sidebar) $\to$ **API**.
  3. Under **Project URL**, click **Copy**.
* **Expected format**: HTTPS URL matching `https://<project-ref>.supabase.co`.
* **Where to paste it**: In `.env.local` as:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
  ```
* **How to verify it works**:
  - Visit `http://localhost:3000/login`; if Supabase Auth initializes without connection errors, the URL is reachable.

---

## 3. Supabase Anonymous Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

* **Why it is required**: Authenticates public and user-scoped client-side requests from React components and the Chrome Extension while enforcing Postgres RLS rules.
* **Where to obtain it**: Supabase Dashboard $\to$ **Project Settings** $\to$ **API** $\to$ **Project API keys (`anon` / `public`)**.
* **Exact steps**:
  1. In the **Project API keys** section, locate the row labeled `anon` `public`.
  2. Click the **Copy** button.
* **Expected format**: Long JWT string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`.
* **Where to paste it**: In `.env.local` as:
  ```env
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
  ```
* **How to verify it works**:
  - Open browser DevTools on `http://localhost:3000`; no `401 Unauthorized` or CORS JWT errors in the Network tab when fetching session status.

---

## 4. Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)

* **Why it is required**: Used exclusively by Next.js Server API Routes (`/api/ai/action`, `/api/ai/intent`) to bypass RLS when performing trusted administrative logs or audit trail entries.
* **Where to obtain it**: Supabase Dashboard $\to$ **Project Settings** $\to$ **API** $\to$ **Project API keys (`service_role` / `secret`)**.
* **Exact steps**:
  1. Locate `service_role` `secret` in Project Settings $\to$ API.
  2. Click **Reveal** and copy the secret token.
  3. **CRITICAL SECURITY WARNING**: Never expose this key in client-side code, Chrome Extension scripts, or public GitHub repos.
* **Expected format**: Long JWT secret string starting with `eyJhbGciOi...`.
* **Where to paste it**: In `.env.local` as:
  ```env
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
  ```
* **How to verify it works**:
  - Triggering an AI action from the Chrome Extension creates a record in `generated_content` and `activity_history` inside your Supabase SQL table editor.

---

## 5. Google OAuth Credentials (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)

* **Why it is required**: Enables single-click Google Sign-In for the Next.js SaaS Web Dashboard and synchronizes the session with the Chrome Extension.
* **Where to obtain it**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
* **Exact steps**:
  1. Go to Google Cloud Console $\to$ **APIs & Services** $\to$ **Credentials**.
  2. Click **Create Credentials** $\to$ **OAuth client ID**.
  3. Select **Web application** as the application type.
  4. Under **Authorized redirect URIs**, add:
     - `http://localhost:3000/auth/callback` (Local Development)
     - `https://your-production-app.vercel.app/auth/callback` (Production)
     - `https://<your-supabase-ref>.supabase.co/auth/v1/callback` (Supabase Auth Redirect)
  5. Copy the generated **Client ID** and **Client Secret**.
* **Expected format**:
  - `GOOGLE_CLIENT_ID`: `<digits>-<alphanumeric>.apps.googleusercontent.com`
  - `GOOGLE_CLIENT_SECRET`: `GOCSPX-<alphanumeric>`
* **Where to paste it**:
  - In `.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
  - In your **Supabase Dashboard** $\to$ **Authentication** $\to$ **Providers** $\to$ **Google** (paste both ID and Secret and toggle **Enabled**).
* **How to verify it works**:
  - On `http://localhost:3000/login`, click **"Continue with Google"**; it should redirect to the Google consent screen and return to `/dashboard` authenticated.

---

## 6. Chrome Extension ID (`NEXT_PUBLIC_EXTENSION_ID` — Optional for Production CORS)

* **Why it is required**: Allows production backend API routes to restrict CORS and cookie sharing exclusively to your published Manifest V3 Chrome Extension.
* **Where to obtain it**: Google Chrome Extensions Manager (`chrome://extensions/`).
* **Exact steps**:
  1. Open Chrome and navigate to `chrome://extensions/`.
  2. Ensure **Developer mode** is enabled in the top right.
  3. Locate **Promptless AI — Venture-Grade Side Panel**.
  4. Copy the 32-character lowercase ID string listed under the title (e.g., `ID: aeblfdkhcemg...`).
* **Expected format**: 32 lowercase alphabet characters (e.g., `abcdefghijklmnopabcdefghijklmnop`).
* **Where to paste it**: In `.env.local` as:
  ```env
  NEXT_PUBLIC_EXTENSION_ID=abcdefghijklmnopabcdefghijklmnop
  ```
* **How to verify it works**:
  - Opening the Chrome Extension Side Panel on a LinkedIn job posting successfully connects to the backend without CORS rejections.
