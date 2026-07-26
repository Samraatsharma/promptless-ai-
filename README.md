# Promptless AI ⚡️

> **AI that understands your intent before you ask.**  
> *A premium, venture-backed-grade Chrome Extension combined with a Next.js 15 SaaS application.*

---

## 1. Project Overview

**Promptless AI** removes the traditional copy-paste-prompt-wait AI chatbot workflow. Instead of providing an empty chat box, the browser itself becomes intelligent—understanding user intent on supported websites (**LinkedIn** and **YouTube** in MVP) and surfacing instant, zero-click AI action cards that complete complex tasks in seconds.

- **No Chatbox**: Zero prompt textboxes, zero chat history, zero AI avatars. Everything is high-signal and action-based.
- **Chrome Extension Side Panel**: A handcrafted, dark glassmorphic 420px Manifest V3 Side Panel that displays live page analysis, intent confidence badges, and actionable cards.
- **Next.js 15 App Router SaaS**: An Apple/Linear-inspired web application featuring an animated browser demo loop, user authentication, and a dashboard for managing saved results and usage history.

---

## 2. Folder Structure

```
promptless-ai/
├── app/                      # Next.js 15 App Router (Landing, Dashboard, Auth, API routes)
│   ├── (auth)/login/         # Supabase Authentication screen
│   ├── (dashboard)/          # Authenticated User Dashboard
│   ├── api/ai/               # Secure Gemini AI API routes (/intent, /action)
│   ├── layout.tsx            # Root layout with Inter typography and Aurora background
│   └── page.tsx              # High-converting Landing Page with Animated Browser Demo
├── components/               # Reusable Glassmorphism UI & Page Components
│   ├── landing/              # Hero, AnimatedBrowserDemo, Features, HowItWorks, Footer
│   ├── dashboard/            # OutputCards, SavedResults, Profile, Usage, Skeletons
│   └── ui/                   # Premium Glass Cards, Gradient Badges, Buttons, Modals
├── chrome-extension/         # Chrome Extension Manifest V3 Side Panel
│   ├── src/
│   │   ├── sidepanel/        # 420px React Side Panel UI (Analyzing -> Actions -> Markdown)
│   │   ├── background/       # Background service worker (Auth & cookie synchronization)
│   │   └── content/          # Content Scripts (LinkedIn & YouTube DOM extractors)
│   └── manifest.json
├── hooks/                    # Custom React hooks (useAuth, useExtensionSync, useAIAction)
├── lib/                      # Core helpers (Supabase client, Gemini SDK wrapper, error handling)
├── services/                 # Domain logic (LinkedInParser, YouTubeParser, PromptlessEngine)
├── styles/                   # Custom Tailwind design tokens (#09090B, Aurora, Noise)
├── supabase/                 # Database migrations (users, generated_content, preferences)
├── types/                    # Shared TypeScript interfaces
└── README.md                 # Complete setup & development documentation
```

---

## 3. Environment Variables

Create a `.env.local` file in the root of the project with the following keys:

```env
# Supabase Authentication & Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini AI SDK
GEMINI_API_KEY=your-google-gemini-api-key

# Next.js Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Navigate to the SQL Editor in your Supabase dashboard and execute the migration script located in `/supabase/migrations/001_initial_schema.sql`:
   - Creates `users` profile table linked to `auth.users`.
   - Creates `generated_content` table to store AI outputs.
   - Creates `activity_history` table for tracking action usage.
   - Creates `preferences` table for user settings.
   - Configures Row Level Security (RLS) policies so users can only access their own data.
3. Enable **Google OAuth** and **Email Auth** in Supabase Authentication settings.

---

## 5. Gemini Setup

1. Obtain a Gemini API Key from [Google AI Studio](https://aistudio.google.com).
2. Add the key as `GEMINI_API_KEY` in your `.env.local` file.
3. Promptless AI uses `@google/genai` on the server-side Next.js API routes (`/api/ai/intent` and `/api/ai/action`) to prevent API keys from ever being exposed to browser extensions.

---

## 6. Chrome Extension Setup

1. Build the Chrome Extension bundle:
   ```bash
   npm run build:extension
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** in the top right corner.
4. Click **Load Unpacked** and select the `/chrome-extension/dist` directory inside the project folder.
5. Click the Promptless AI icon in the Chrome toolbar to open the **420px Side Panel**.

---

## 7. Running Locally

1. Install all dependencies:
   ```bash
   npm install
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000) to view the Landing Page and Animated Browser Demo.
4. Visit [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view the Authenticated Dashboard.

---

## 8. Deployment

- **Next.js SaaS Application**: Connect your GitHub repository to [Vercel](https://vercel.com) and add the environment variables in the project settings. Deploy with zero configuration.
- **Chrome Extension**: Run `npm run build:extension`, zip the resulting `dist/` folder, and upload it to the Google Chrome Web Store developer dashboard.

---

## 9. Contributing

1. Follow the **SOLID** principles and strict TypeScript guidelines outlined in `PROJECT_CONTEXT.md`.
2. Ensure every component matches the premium design aesthetic (Apple/Linear glassmorphism, `#09090B` background, smooth 60 FPS Framer Motion animations).
3. Document all architectural changes in `DECISIONS.md` and update `CHANGELOG.md` upon feature completion.
