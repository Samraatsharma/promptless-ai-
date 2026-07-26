# 🤖 Promptless AI — Demo Automation Framework

A cinematic, one-click product demonstration system built with **Playwright**.  
Completely separate from the production application — safe to delete without breaking anything.

---

## 📋 Prerequisites

- Node.js 18+
- Chrome installed  
- Promptless AI extension built: `npm --prefix ../chrome-extension run build`

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd demo && npm install

# 2. Run the full product tour (one command)
npm run demo
```

---

## 🎬 Available Scenarios

| Command | Description |
|---|---|
| `npm run demo` | Full product tour (LinkedIn → YouTube → GitHub → Landing) |
| `npm run linkedin-demo` | LinkedIn Feed + Job scenario only |
| `npm run youtube-demo` | YouTube Watch + Summarize scenario only |
| `npm run github-demo` | GitHub Repository scenario only |
| `npm run gmail-demo` | Gmail draft scenario only |
| `npm run full-demo` | Alias for full product tour |

---

## ⚙️ Configuration

Edit `config.ts` to customize everything **without touching source code**:

```typescript
// Change URLs
urls: {
  linkedinFeed: 'https://www.linkedin.com/feed/',
  linkedinJob: 'https://www.linkedin.com/jobs/view/YOUR_JOB_ID/',
  youtube: 'https://www.youtube.com/watch?v=YOUR_VIDEO',
  github: 'https://github.com/YOUR_ORG/YOUR_REPO',
}

// Change timing
timing: {
  mouseSpeed: 800,      // Faster = lower value
  naturalPause: 1200,   // Pause between actions (ms)
  longPause: 2500,      // Pause for reading moments
}
```

---

## 🎥 Recording Tips

1. Start **QuickTime** or **OBS** screen recording first
2. Run `npm run demo` — Chrome will auto-launch maximized
3. The demo paces itself cinematically with natural delays
4. The mouse moves in smooth bezier curves, never teleporting
5. Browser stays open 5 seconds then auto-closes

---

## 🏗️ Architecture

```
demo/
├── config.ts           # All configurable settings
├── runner.ts           # Entry point — launch Chrome + route scenario
├── package.json        # Dependencies (Playwright only)
├── tsconfig.json       # TypeScript config
├── scenarios/
│   ├── linkedin.ts     # LinkedIn Feed + Job demo
│   ├── youtube.ts      # YouTube Watch demo
│   ├── github.ts       # GitHub Repository demo
│   ├── gmail.ts        # Gmail Draft demo
│   └── full-demo.ts    # Complete product tour
└── utils/
    ├── mouse.ts        # Bezier curve mouse movement
    └── extension.ts    # Extension helpers
```

---

*Designed to look like an Apple Keynote or Vercel product launch.*
