# CHROME_EXTENSION_GUIDE.md — Manifest V3 Chrome Extension Architecture & Developer Guide

Promptless AI features a **Manifest V3 Chrome Extension** designed to eliminate chatbot prompt textboxes and provide zero-click AI actions directly inside a **420px Side Panel**.

---

## 1. Folder Structure (`/chrome-extension`)

```text
chrome-extension/
├── manifest.json              # Manifest V3 configuration (sidePanel, host_permissions, scripts)
├── sidepanel.html             # HTML entry point for the Side Panel UI
├── tsconfig.json              # TypeScript workspace config (excluded from root Next.js tsconfig)
├── vite.config.ts             # Vite bundler config with multiple Rollup entry points
├── src/
│   ├── background.ts          # Service Worker: manages side panel behavior and tab updates
│   ├── content.ts             # Content Script: extracts DOM context & monitors SPA navigation
│   ├── main.tsx               # Side Panel React 19 bootstrap
│   ├── App.tsx                # Main Side Panel UI container (Intent detection & action routing)
│   ├── index.css              # Custom Apple/Arc dark glassmorphism styling
│   └── components/
│       ├── ActionCards.tsx    # 4 high-signal action cards with Raycast keyboard shortcuts
│       ├── UnsupportedScreen.tsx # Domain verification screen preventing mock/stale data on invalid URLs
│       └── OutputScreen.tsx   # Executive Markdown modal with instant Copy & Download .MD
└── dist/                      # Compiled production extension bundle (load this unpacked)
```

---

## 2. Supported Website Domain Detection & Zero Mock Data Guarantee

Promptless AI enforces **Strict Domain Verification** (`App.tsx` & `UnsupportedScreen.tsx`):
1. **Never Display Stale/Mock Data on Unsupported URLs**: If an end user opens the extension on `chrome://extensions`, `google.com`, or any website that is not `linkedin.com` or `youtube.com`, the extension **never** displays fake job titles, confidence scores, or action cards.
2. **Unsupported Screen UI**: Surfaces an amber alert badge showing the `Current Website` domain, active supported platform buttons (`[Open LinkedIn Jobs]` / `[Open YouTube Lectures]`), and clear pipeline instructions.
3. **Explicit Synthetic Demo Mode**: Synthetic preview cards can only be inspected if the user explicitly clicks **`[✨ Preview in synthetic Demo Mode]`** at the bottom of the unsupported screen, which renders a persistent gold warning header: `⚠️ DEMO MODE — SYNTHETIC PREVIEW DATA`.

---

## 2. Manifest V3 Architecture Explanation

1. **`sidePanel` API**: Unlike legacy popup extensions that close when the user clicks away, Promptless AI uses Chrome's `sidePanel` API (`sidepanel.html`). It remains docked on the right side of the browser window while the user browses jobs or videos.
2. **Service Worker (`src/background.ts`)**: Replaces Manifest V2 background pages. It listens for toolbar icon clicks (`chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })`) and coordinates communication between the active tab and the side panel.
3. **Content Script (`src/content.ts`)**: Injected into matching domains (`*://*.linkedin.com/*`, `*://*.youtube.com/*`). It extracts page titles, descriptions, and metadata without polluting the page DOM, and uses **Single-Page Application (SPA) MutationObservers** and `yt-navigate-finish` listeners to notify the side panel when the user navigates without reloading.

---

## 3. Loading the Extension in Developer Mode

1. Open Google Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the folder `/chrome-extension/dist` inside your project directory.
5. Pin the **Promptless AI** icon to your Chrome toolbar for 1-click access.

---

## 4. Side Panel Usage & Live Testing

### Testing on LinkedIn Jobs
1. Go to any LinkedIn Job posting (e.g., `https://www.linkedin.com/jobs/view/...`).
2. Click the Promptless AI toolbar icon. The Side Panel opens at 420px width.
3. Observe the header badge switch to `"Job Detected"` with 98% confidence.
4. Click **Generate Cover Letter** (<kbd>⌘1</kbd>) or **Tailor Resume** (<kbd>⌘2</kbd>).
5. Watch the shimmer loading skeleton transition into structured Markdown.

### Testing on YouTube Videos
1. Go to any YouTube watch page (`https://www.youtube.com/watch?v=...`).
2. Open the Promptless AI Side Panel.
3. Observe the badge switch to `"Video Detected"` with 96% confidence.
4. Click **Smart Notes** (<kbd>⌘1</kbd>) or **Generate Quiz** (<kbd>⌘2</kbd>).
5. Download the `.md` file directly to your desktop.

---

## 5. Debugging & Inspection

- **Side Panel DevTools**: Right-click anywhere inside the Promptless AI Side Panel and select **Inspect**. This opens a dedicated Chrome DevTools window for `sidepanel.html` where you can view React logs and network calls to `/api/ai/action`.
- **Content Script Logs**: Open Chrome DevTools (<kbd>F12</kbd> / <kbd>⌘ + Option + I</kbd>) on the LinkedIn or YouTube page itself. Look for `"Promptless AI Content Script with SPA Observers Loaded."` in the Console tab.
- **Service Worker Logs**: In `chrome://extensions`, click the **service worker** link under Promptless AI to inspect `background.ts` background event loops.

---

## 6. Updating the Extension Code

When modifying files inside `chrome-extension/src/`:
1. Re-bundle the extension:
   ```bash
   npm --prefix chrome-extension run build
   ```
2. In `chrome://extensions`, click the **Reload (refresh arrow)** icon on the Promptless AI extension card.
3. Close and re-open the Side Panel to see your changes immediately.

---

## 7. Common Errors & Troubleshooting

| Error Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| **`CANNOT_DETECT_DOM` Badge Shown** | The current URL is not a supported LinkedIn job or YouTube watch page, or the DOM selector is missing. | Navigate to a valid LinkedIn job posting (`/jobs/view`) or YouTube watch page (`/watch?v=`). |
| **`ERR_CONNECTION_REFUSED` on AI Actions** | The Next.js backend server (`http://localhost:3000`) is not running. | Run `npm run dev` in the project root directory. |
| **`429 Too Many Requests`** | Token-bucket rate limit exceeded (max 20 actions/minute). | Wait 60 seconds for token bucket refill; check `X-RateLimit-Reset` header. |
| **`400 Invalid Payload Schema`** | Zod schema rejection on `/api/ai/intent` or `/api/ai/action`. | Verify that `content.ts` is sending both `platform` and `data` objects matching Zod schemas in `lib/security/schemas.ts`. |
