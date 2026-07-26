# SECURITY.md — Security Policy & Responsible Disclosure

Promptless AI is committed to maintaining the highest standards of application security, data privacy, and Chrome Extension isolation.

---

## 1. Supported Versions

| Version | Supported | Security Patch Status |
| :---: | :---: | :--- |
| **`v1.0.x`** | ✔ Yes | Currently supported production release |
| **`< v1.0.0`** | ✖ No | Deprecated development prototypes |

---

## 2. Security Architecture Highlights

1. **Zero-API-Key Exposure in Browser**:
   - The Chrome Extension (`chrome-extension/`) NEVER stores or transmits Google Gemini API keys. All inference is proxied securely through server-side Next.js API routes (`/api/ai/intent` and `/api/ai/action`), where the `GEMINI_API_KEY` is protected by server environment variables.
2. **Strict Zod Runtime Validation (`lib/security/schemas.ts`)**:
   - Every incoming POST request to `/api/ai/intent` and `/api/ai/action` is validated using strict Zod schemas (`IntentRequestSchema`, `ActionRequestSchema`). Any payload containing unexpected keys, malformed URLs, or oversized strings is rejected with `400 Bad Request`.
3. **DOM Input Sanitization (`lib/security/sanitize.ts`)**:
   - All extracted DOM strings from LinkedIn and YouTube are sanitized to strip control characters, null bytes, and potential prompt injection payloads before being passed to Gemini 2.5 Flash.
4. **Distributed Serverless Rate Limiting (`lib/security/rate-limiter.ts`)**:
   - Protected by `@upstash/ratelimit` + `@upstash/redis` (max 20 requests per minute per IP/user token).

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability in Promptless AI, please DO NOT open a public GitHub issue.

Instead, please send an encrypted or private report to:
- **Email**: `security@promptless.ai`
- **GitHub Security Advisory**: Open a private advisory under our GitHub Repository Security tab.

We pledge to acknowledge receipt of vulnerability reports within **24 hours** and provide a remediation timeline within **72 hours**.
