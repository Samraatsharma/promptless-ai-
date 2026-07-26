# MANUAL_INPUTS.md — Required User Manual Actions & Configuration Checklist

This file contains **ONLY** the information that requires manual action from the user or project owner. Everything else in Promptless AI is automated via scripts (`setup.command`, `run.command`, `health-check.js`, `npm run dev`, and `vite build`).

---

## 1. Google Gemini API Key

- **What it is**: The authentication token for Google Gemini 2.5 Flash (`GEMINI_API_KEY`).
- **Why it is required**: Powering zero-click intent classification and structured Markdown generation for LinkedIn and YouTube.
- **Where to obtain it**: Google AI Studio.
- **Exact website**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Step-by-step instructions**:
  1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and sign in with your Google Workspace or personal account.
  2. Click **Create API Key**.
  3. Select an existing Google Cloud project or create a new project named `"Promptless AI SaaS"`.
  4. Copy the generated alphanumeric API key string.
- **Expected format**: Starts with `AIzaSy...` (~39 characters).
- **Where to paste it**:
  - Locally: In `.env.local` as `GEMINI_API_KEY=AIzaSy...`
  - In Vercel: Under **Project Settings > Environment Variables** as `GEMINI_API_KEY`.
- **How to verify it is working**:
  - Run `node health-check.js` locally and observe `[✔ PASS] GEMINI_API_KEY is defined in .env.local`.
  - In Chrome Extension, open a YouTube video and verify intent classification returns real-time confidence scores instead of `"Mock Intent Result"`.

---

## 2. Supabase Project URL (`NEXT_PUBLIC_SUPABASE_URL`)

- **What it is**: The base REST and GraphQL endpoint for your Supabase backend database and Auth instance.
- **Why it is required**: Connecting the Next.js SaaS app and backend API routes to PostgreSQL tables (`users`, `generated_content`, `activity_history`, `preferences`).
- **Where to obtain it**: Supabase Dashboard.
- **Exact website**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Step-by-step instructions**:
  1. Log into your Supabase account and click **New Project**.
  2. Choose your organization, set project name to `"promptless-ai-prod"`, and pick a secure database password.
  3. Once provisioned, go to **Project Settings > API**.
  4. Copy the **Project URL** under "Project URL".
- **Expected format**: `https://<random-id>.supabase.co`
- **Where to paste it**: In `.env.local` and Vercel Environment Variables as `NEXT_PUBLIC_SUPABASE_URL`.
- **How to verify it is working**: Visit `/dashboard` in your browser; if Supabase is connected, auth session queries will execute without console network errors.

---

## 3. Supabase Anonymous Public Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

- **What it is**: The public client-side JWT key for Supabase Auth and Row-Level Security (RLS) queries.
- **Why it is required**: Allows browser clients to authenticate users and read/write their own records safely under RLS policies.
- **Where to obtain it**: Supabase Dashboard under **Project Settings > API > Project API keys (anon / public)**.
- **Exact website**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Step-by-step instructions**:
  1. In your Supabase Project Settings, navigate to **API**.
  2. Locate the key labeled **`anon` `public`**.
  3. Click **Copy**.
- **Expected format**: Long JWT starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to paste it**: In `.env.local` and Vercel Environment Variables as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **How to verify it is working**: Perform user login/signup on `/login`; a valid JWT token will be stored in your browser cookies (`sb-access-token`).

---

## 4. Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`) *(Optional / Admin Only)*

- **What it is**: The admin-level secret JWT key that bypasses all Row-Level Security (RLS) rules.
- **Why it is required**: Used exclusively by backend cron jobs or server-side migration scripts that require full database access.
- **Where to obtain it**: Supabase Dashboard under **Project Settings > API > Project API keys (service_role / secret)**.
- **Exact website**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Step-by-step instructions**:
  1. In **Project Settings > API**, locate **`service_role` `secret`**.
  2. Click **Reveal** and copy the secret token.
- **Expected format**: Long JWT starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to paste it**: In `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`. **NEVER** expose this key with a `NEXT_PUBLIC_` prefix!
- **How to verify it is working**: Run backend administrative scripts or test API routes requiring service role overrides.

---

## 5. Google OAuth Client ID & Secret (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`)

- **What it is**: OAuth 2.0 credentials for "Continue with Google" single sign-on (SSO).
- **Why it is required**: Enables one-click onboarding without requiring password creation.
- **Where to obtain it**: Google Cloud Console (APIs & Services > Credentials).
- **Exact website**: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- **Step-by-step instructions**:
  1. Go to Google Cloud Console and create an **OAuth 2.0 Client ID** of type **Web application**.
  2. Add Authorized Redirect URIs:
     - Local: `http://localhost:3000/auth/callback`
     - Supabase Auth: `https://<your-project-id>.supabase.co/auth/v1/callback`
  3. Copy the **Client ID** and **Client Secret**.
  4. Paste them into **Supabase Dashboard > Authentication > Providers > Google** and enable Google Auth.
- **Expected format**:
  - ID: `<numeric-id>-<hash>.apps.googleusercontent.com`
  - Secret: `GOCSPX-<random-characters>`
- **Where to paste it**: Inside Supabase Dashboard > Authentication > Providers > Google.
- **How to verify it is working**: Click "Continue with Google" on `/login`; you should be redirected to the Google consent screen and back to `/dashboard`.

---

## 6. Upstash Redis URL & Token (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) *(Production Serverless Only)*

- **What it is**: Serverless REST connection credentials for Upstash Redis.
- **Why it is required**: Enforces distributed rate limiting (20 requests/minute) across multi-region Vercel Edge / Serverless functions without per-instance memory resets.
- **Where to obtain it**: Upstash Console.
- **Exact website**: [https://console.upstash.com/](https://console.upstash.com/)
- **Step-by-step instructions**:
  1. Sign in to Upstash and click **Create Database** (type: Redis).
  2. Select region matching your Vercel deployment (e.g., `us-east-1`).
  3. Under **REST API**, copy **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**.
- **Expected format**:
  - URL: `https://<project-id>.upstash.io`
  - Token: `<alphanumeric-token>`
- **Where to paste it**: In Vercel Environment Variables as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- **How to verify it is working**: Check API response headers on `/api/ai/intent`; when Upstash is active, `rateLimitSource` in metadata will read `"upstash-redis"`.

---

## 7. Chrome Extension ID & Web Store Publishing Configuration

- **What it is**: The unique cryptographic ID assigned to your Chrome Extension when loaded unpacked or published.
- **Why it is required**: Authorizing Chrome Extension origin requests in CORS policies and Supabase auth redirects.
- **Where to obtain it**: Chrome Extensions Developer Page (`chrome://extensions`) or Chrome Web Store Developer Dashboard.
- **Exact website**: [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
- **Step-by-step instructions**:
  1. Open Chrome and navigate to `chrome://extensions`.
  2. Enable **Developer mode** (top right toggle).
  3. Click **Load unpacked** and select `/chrome-extension/dist`.
  4. Copy the 32-character lowercase ID displayed under the Promptless AI card (e.g., `aflkbkfncplndlgbnflhbfidhpilnjpf`).
- **Expected format**: 32 lowercase alphabetic characters.
- **Where to paste it**: In Next.js `next.config.mjs` allowed CORS origins or Supabase Auth redirect URLs if using extension auth.
- **How to verify it is working**: Ensure extension content scripts can send `POST` requests to `http://localhost:3000/api/ai/intent` without CORS rejection.
