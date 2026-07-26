/**
 * Promptless AI — Demo Automation Framework
 * Scenario: Full Demo (Product Tour)
 *
 * Orchestrates the complete Promptless AI product demo by running all
 * individual scenarios in sequence, with transition pauses between each.
 * Ends by showcasing the Promptless AI landing page.
 */

import { Page, BrowserContext } from 'playwright';
import { runLinkedInDemo } from './linkedin';
import { runYouTubeDemo } from './youtube';
import { runGitHubDemo } from './github';
import { sleep } from '../utils/mouse';
import { waitForPageLoad } from '../utils/extension';
import { DEMO_CONFIG } from '../config';

// ─── Divider Helper ───────────────────────────────────────────────────────────

function printDivider(label: string): void {
  const line = '─'.repeat(58);
  console.log(`\n┌${line}┐`);
  console.log(`│  ${label.padEnd(56)}│`);
  console.log(`└${line}┘`);
}

// ─── Full Demo Orchestrator ───────────────────────────────────────────────────

/**
 * Runs the complete Promptless AI product tour in sequence:
 *  1. LinkedIn feed + job posting
 *  2. YouTube video
 *  3. GitHub repository
 *  4. Promptless AI landing page (finale)
 *
 * @param page    - Active Playwright page
 * @param context - Browser context (passed to scenarios that need side panel)
 */
export async function runFullDemo(
  page: Page,
  context: BrowserContext
): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('  🚀  PROMPTLESS AI — COMPLETE PRODUCT TOUR');
  console.log('='.repeat(60));

  // ── 1. LinkedIn ────────────────────────────────────────────────────────────
  printDivider('CHAPTER 1 / 3 — LinkedIn');
  await runLinkedInDemo(page, context);
  await sleep(DEMO_CONFIG.timing.transitionPause);

  // ── 2. YouTube ────────────────────────────────────────────────────────────
  printDivider('CHAPTER 2 / 3 — YouTube');
  await runYouTubeDemo(page);
  await sleep(DEMO_CONFIG.timing.transitionPause);

  // ── 3. GitHub ─────────────────────────────────────────────────────────────
  printDivider('CHAPTER 3 / 3 — GitHub');
  await runGitHubDemo(page);
  await sleep(DEMO_CONFIG.timing.transitionPause);

  // ── Finale: Promptless AI Landing Page ───────────────────────────────────
  printDivider('FINALE — Promptless AI Website');
  console.log('\n🏁 [FULL DEMO] Navigating to Promptless AI landing page...');
  await page.goto(DEMO_CONFIG.urls.promptlessWebsite, { waitUntil: 'domcontentloaded' });
  await waitForPageLoad(page);

  // Linger on the landing page so viewers can absorb it
  await sleep(DEMO_CONFIG.timing.longPause);

  console.log('\n' + '='.repeat(60));
  console.log('  ✅  PROMPTLESS AI PRODUCT TOUR — COMPLETE');
  console.log('      Your Promptless AI demo has been successfully showcased.');
  console.log('='.repeat(60) + '\n');
}
