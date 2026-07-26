/**
 * Promptless AI — Demo Automation Framework
 * Scenario: GitHub
 *
 * Demonstrates Promptless AI on a GitHub repository page,
 * showcasing code understanding and developer workflow assistance.
 */

import { Page } from 'playwright';
import { sleep, smoothScroll, smoothMouseMove } from '../utils/mouse';
import { waitForPageLoad } from '../utils/extension';
import { DEMO_CONFIG } from '../config';

/**
 * Runs the full GitHub demo scenario.
 *
 * Steps:
 *  1. Navigate to microsoft/vscode repository
 *  2. Scroll through repo overview naturally
 *  3. Hover over the file tree and README
 *
 * @param page - Active Playwright page
 */
export async function runGitHubDemo(page: Page): Promise<void> {
  console.log('\n⚫ [GITHUB DEMO] Starting GitHub Repository scenario...');

  // ── Step 1: Navigate to GitHub Repository ─────────────────────────────────
  console.log('   → Navigating to GitHub repository...');
  await page.goto(DEMO_CONFIG.urls.github, { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);

  // ── Step 2: Hover over the file tree area ─────────────────────────────────
  console.log('   → Hovering over repository file tree...');
  const viewport = page.viewportSize();
  if (viewport) {
    // File tree is typically on the left side of the repo page
    await smoothMouseMove(page, viewport.width * 0.3, viewport.height * 0.4, 700);
    await sleep(600);
  }

  // ── Step 3: Scroll through the repo page ──────────────────────────────────
  console.log('   → Scrolling through repository overview...');
  await smoothScroll(page, 'down', 400);
  await sleep(DEMO_CONFIG.timing.naturalPause);

  // ── Step 4: Browse the README ─────────────────────────────────────────────
  console.log('   → Browsing README section...');
  await smoothScroll(page, 'down', 300);
  await sleep(DEMO_CONFIG.timing.longPause);

  // ── Step 5: Move mouse to README content ──────────────────────────────────
  if (viewport) {
    await smoothMouseMove(page, viewport.width * 0.5, viewport.height * 0.6, 600);
    await sleep(500);
  }

  // ── Step 6: Scroll a bit more and pause ───────────────────────────────────
  await smoothScroll(page, 'down', 200);
  await sleep(DEMO_CONFIG.timing.longPause);

  console.log('   ✅ GitHub demo scenario complete.');
}
