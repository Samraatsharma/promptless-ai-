/**
 * Promptless AI — Demo Automation Framework
 * Scenario: LinkedIn
 *
 * Demonstrates Promptless AI on the LinkedIn feed and a job posting,
 * showcasing context-aware AI assistance for professional networking.
 */

import { BrowserContext, Page } from 'playwright';
import { sleep, smoothScroll, smoothMouseMove } from '../utils/mouse';
import { waitForPageLoad } from '../utils/extension';
import { DEMO_CONFIG } from '../config';

/**
 * Runs the full LinkedIn demo scenario.
 *
 * Steps:
 *  1. Navigate to LinkedIn feed and scroll naturally
 *  2. Navigate to a specific job posting
 *  3. Scroll the job description to show content
 *
 * @param page    - Active Playwright page
 * @param context - Browser context (for side panel access if needed)
 */
export async function runLinkedInDemo(
  page: Page,
  context?: BrowserContext
): Promise<void> {
  console.log('\n🔵 [LINKEDIN DEMO] Starting LinkedIn Feed scenario...');

  // ── Step 1: Navigate to LinkedIn Feed ──────────────────────────────────────
  console.log('   → Navigating to LinkedIn Feed...');
  await page.goto(DEMO_CONFIG.urls.linkedinFeed, { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);

  // ── Step 2: Scroll Feed Naturally ──────────────────────────────────────────
  console.log('   → Scrolling feed naturally...');
  await smoothScroll(page, 'down', 500);
  await sleep(DEMO_CONFIG.timing.naturalPause);
  await smoothScroll(page, 'down', 400);
  await sleep(DEMO_CONFIG.timing.longPause);

  // ── Step 3: Highlight a post (move mouse over feed area) ──────────────────
  console.log('   → Hovering over feed content...');
  const viewport = page.viewportSize();
  if (viewport) {
    // Move mouse to approx center-left where feed posts appear
    await smoothMouseMove(page, viewport.width * 0.45, viewport.height * 0.4, 800);
    await sleep(DEMO_CONFIG.timing.naturalPause);
  }

  // ── Step 4: Navigate to a LinkedIn Job Posting ────────────────────────────
  console.log('   → Opening LinkedIn Job Posting...');
  await page.goto(DEMO_CONFIG.urls.linkedinJob, { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);

  // Scroll through job description
  console.log('   → Scrolling through job description...');
  await smoothScroll(page, 'down', 300);
  await sleep(DEMO_CONFIG.timing.naturalPause);
  await smoothScroll(page, 'down', 200);
  await sleep(DEMO_CONFIG.timing.longPause);

  console.log('   ✅ LinkedIn demo scenario complete.');
}
