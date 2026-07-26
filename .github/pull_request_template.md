# Pull Request — Promptless AI ⚡️

## 1. Description of Changes
Please provide a concise summary of the changes introduced in this PR and explain the motivation behind them.

- **What changed?**:
- **Why was this change necessary?**:
- **Related Issue(s)**: Closes `#____`

---

## 2. Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds zero-click capability)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring / Technical debt cleanup
- [ ] Documentation update

---

## 3. Engineering & Quality Verification Checklist
Before submitting this pull request, verify that you have completed the following quality checks:

- [ ] **ESLint Audit**: I ran `npm exec eslint .` and confirmed `0 errors, 0 warnings`.
- [ ] **TypeScript Check**: I ran `tsc --noEmit` and confirmed `0 compilation errors`.
- [ ] **Next.js Production Build**: I ran `npm run build` and confirmed all static/dynamic routes compile cleanly.
- [ ] **Chrome Extension Build**: I ran `npm --prefix chrome-extension run build` and verified the Manifest V3 sidepanel bundle builds to `/chrome-extension/dist`.
- [ ] **Health Check CLI**: I ran `node health-check.js` and confirmed all diagnostic checks pass.
- [ ] **UI/UX Aesthetics**: Any frontend changes adhere to Apple / Linear / Arc dark glassmorphic design tokens (`#09090B` background, subtle `white/10` borders, 60 FPS Framer Motion animations).
- [ ] **WAI-ARIA Accessibility**: Any interactive UI elements include `role="button"`, `tabIndex={0}`, and keyboard navigation event handlers.
- [ ] **Security & Validation**: Any new API endpoints or payload schemas use Zod runtime validation (`safeParse`) and Upstash Redis rate limiting.

---

## 4. Screenshots / Recording (if UI/UX was modified)
| Before Change | After Change |
| :---: | :---: |
| *(Paste screenshot here)* | *(Paste screenshot here)* |
