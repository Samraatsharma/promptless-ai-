# FINAL_DEPLOYMENT_GUIDE.md — Production Deployment & Web Store Publishing Guide

This guide covers deploying the **Next.js 16 SaaS application** to **Vercel**, configuring **Supabase** in production, packaging the **Chrome Extension**, and preparing for **Google Chrome Web Store** submission.

---

## 1. Deploying to Vercel

1. **Push Repository to GitHub**:
   Ensure all changes are committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: promptless ai v1.0.0 production release"
   git push origin main
   ```
2. **Import Project in Vercel**:
   - Go to [https://vercel.com/new](https://vercel.com/new) and select your repository (`Samraatsharma/promptless-ai`).
   - Framework Preset: **Next.js** (auto-detected).
   - Root Directory: `./`
3. **Configure Build Settings**:
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

---

## 2. Adding Environment Variables in Vercel

Under **Project Settings > Environment Variables**, add the following production keys:

| Variable Name | Production Value |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-production-id.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsIn...` (Supabase Anon Key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsIn...` (Supabase Admin Key) |
| `GEMINI_API_KEY` | `AIzaSy...` (Google AI Studio Key) |
| `NEXT_PUBLIC_APP_URL` | `https://promptless-ai.vercel.app` (Your custom domain) |
| `UPSTASH_REDIS_REST_URL` | `https://your-redis-instance.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | `AYxxxxxxxxxxxxxxx` |

Click **Deploy**. Your SaaS application will build and deploy cleanly in ~45 seconds.

---

## 3. Deploying Supabase Production Migrations

To apply the database schema, RLS policies, and compound performance indexes to your production Supabase database:

1. Open **Supabase Dashboard > SQL Editor > New Query**.
2. Copy the contents of `/supabase/migrations/001_initial_schema.sql` and click **Run**.
3. Copy the contents of `/supabase/migrations/002_performance_indexes.sql` and click **Run**.
4. Verify that tables (`users`, `generated_content`, `activity_history`, `preferences`) appear under the **Table Editor**.

---

## 4. Building & Packaging the Chrome Extension

To create a production-optimized Manifest V3 bundle:

```bash
# 1. Build extension bundle
npm --prefix chrome-extension run build

# 2. Package into a clean .zip archive for Chrome Web Store upload
cd chrome-extension/dist
zip -r ../../promptless-ai-extension-v1.0.0.zip ./*
cd ../..
```

Your production archive is now ready at `promptless-ai-extension-v1.0.0.zip`.

---

## 5. Publishing to the Google Chrome Web Store

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Pay the one-time $5 developer registration fee (if not already registered).
3. Click **New Item** and upload `promptless-ai-extension-v1.0.0.zip`.
4. Fill in Store Listing Details:
   - **Name**: `Promptless AI — Intent-Based Zero-Click Assistant`
   - **Summary**: `Turns your browser into an intelligent agent. Automatically suggests relevant AI actions on LinkedIn and YouTube without chatbots.`
   - **Category**: `Productivity`
   - **Screenshots**: Upload 1280x800px screenshots of the 420px Side Panel active on LinkedIn and YouTube.
5. In **Privacy Practices**:
   - Justify `sidePanel`, `activeTab`, and `host_permissions` for `linkedin.com` and `youtube.com`.
   - Confirm that user data is never sold or used for unrelated advertising.
6. Click **Submit for Review**.

---

## 6. Production Checklist & Post-Deployment Verification

Before announcing your launch, verify:
- [x] Vercel deployment returns HTTP `200 OK` on `https://your-domain.com`.
- [x] SSL certificate is active (`https://`).
- [x] Custom domain is linked to Next.js production.
- [x] Supabase Auth Google SSO redirect URL is updated to `https://your-domain.com/auth/callback`.
- [x] Extension Side Panel successfully communicates with your production `/api/ai/intent` endpoint.
- [x] Rate limiting headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`) appear in production responses.
