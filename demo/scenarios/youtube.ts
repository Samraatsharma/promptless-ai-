/**
 * Promptless AI — Demo Automation Framework
 * Scenario: YouTube
 *
 * Demonstrates Promptless AI while watching a YouTube video,
 * showcasing real-time context extraction from video content and descriptions.
 */

import { Page } from 'playwright';
import { sleep, smoothScroll, smoothMouseMove } from '../utils/mouse';
import { waitForPageLoad } from '../utils/extension';
import { DEMO_CONFIG } from '../config';

/**
 * Runs the full YouTube demo scenario.
 *
 * Steps:
 *  1. Navigate to YouTube video
 *  2. Pause autoplaying video
 *  3. Scroll to the video description
 *  4. Hover over recommended videos sidebar
 *
 * @param page - Active Playwright page
 */
export async function runYouTubeDemo(page: Page): Promise<void> {
  console.log('\n🔴 [YOUTUBE DEMO] Starting YouTube scenario...');

  // ── Step 1: Navigate to YouTube ───────────────────────────────────────────
  console.log('   → Navigating to YouTube video...');
  await page.goto(DEMO_CONFIG.urls.youtube, { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);

  // ── Step 2: Pause video if it autoplays ───────────────────────────────────
  console.log('   → Pausing video...');
  await page.keyboard.press('k').catch(() => {
    // 'k' is YouTube's pause shortcut — non-critical if it fails
  });
  await sleep(DEMO_CONFIG.timing.naturalPause);

  // ── Step 3: Move mouse to the video player area ───────────────────────────
  console.log('   → Focusing on video player...');
  const viewport = page.viewportSize();
  if (viewport) {
    // YouTube video player is roughly top-center
    await smoothMouseMove(page, viewport.width * 0.5, viewport.height * 0.35, 700);
    await sleep(800);
  }

  // ── Step 4: Scroll to description ─────────────────────────────────────────
  console.log('   → Scrolling to video description...');
  await smoothScroll(page, 'down', 350);
  await sleep(DEMO_CONFIG.timing.naturalPause);
  await smoothScroll(page, 'down', 200);
  await sleep(DEMO_CONFIG.timing.longPause);

  // ── Step 5: Scroll back up slightly ───────────────────────────────────────
  console.log('   → Scrolling back to player...');
  await smoothScroll(page, 'up', 300);
  await sleep(DEMO_CONFIG.timing.naturalPause);

  console.log('   ✅ YouTube demo scenario complete.');
}
