/**
 * Promptless AI — Demo Automation Framework
 * Main Runner
 *
 * Entry point for the demo framework. Launches Chrome with the Promptless AI
 * extension loaded via persistent context, then dispatches to the appropriate
 * scenario based on the CLI argument.
 *
 * Usage:
 *   ts-node runner.ts [scenario]
 *
 * Scenarios:
 *   linkedin-demo   — LinkedIn feed + job posting
 *   youtube-demo    — YouTube video
 *   github-demo     — GitHub repository
 *   full-demo       — Complete product tour (default)
 */

import { chromium, BrowserContext, Page } from 'playwright';
import path from 'path';
import { DEMO_CONFIG } from './config';
import { runLinkedInDemo } from './scenarios/linkedin';
import { runYouTubeDemo } from './scenarios/youtube';
import { runGitHubDemo } from './scenarios/github';
import { runFullDemo } from './scenarios/full-demo';
import { sleep } from './utils/mouse';

// ─── CLI ──────────────────────────────────────────────────────────────────────

const SCENARIO = process.argv[2] ?? 'full-demo';

// ─── Banner ───────────────────────────────────────────────────────────────────

function printBanner(): void {
  console.log('\n' + '='.repeat(60));
  console.log('  🤖  PROMPTLESS AI — CINEMATIC DEMO AUTOMATION FRAMEWORK');
  console.log('='.repeat(60));
  console.log(`\n  Scenario : ${SCENARIO}`);
  console.log(`  Extension: ${path.resolve(__dirname, DEMO_CONFIG.extensionPath)}`);
  console.log(`  Viewport : ${DEMO_CONFIG.browser.windowWidth}×${DEMO_CONFIG.browser.windowHeight}`);
  console.log(`  Headless : ${DEMO_CONFIG.browser.headless}`);
  console.log();
}

// ─── Scenario Dispatcher ──────────────────────────────────────────────────────

async function runScenario(page: Page, context: BrowserContext): Promise<void> {
  switch (SCENARIO) {
    case 'linkedin-demo':
      await runLinkedInDemo(page, context);
      break;

    case 'youtube-demo':
      await runYouTubeDemo(page);
      break;

    case 'github-demo':
      await runGitHubDemo(page);
      break;

    case 'full-demo':
      await runFullDemo(page, context);
      break;

    default:
      console.warn(`⚠️  Unknown scenario: "${SCENARIO}". Falling back to full-demo.`);
      await runFullDemo(page, context);
      break;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  printBanner();

  const extensionPath = path.resolve(__dirname, DEMO_CONFIG.extensionPath);

  // Launch Chrome with the Promptless AI extension loaded
  console.log('🚀 Launching Chrome with Promptless AI Extension...\n');

  let context: BrowserContext;
  try {
    context = await chromium.launchPersistentContext('', {
      headless: DEMO_CONFIG.browser.headless,
      args: [
        `--load-extension=${extensionPath}`,
        `--disable-extensions-except=${extensionPath}`,
        '--start-maximized',
        '--no-sandbox',
        '--disable-infobars',
        '--disable-blink-features=AutomationControlled',
      ],
      // viewport: null keeps the window at its maximized size
      viewport: null,
      slowMo: DEMO_CONFIG.browser.slowMo,
      channel: 'chrome',
    });
  } catch (launchErr) {
    console.error('❌ Failed to launch Chrome:', launchErr);
    console.log('\n💡 Tip: Make sure Google Chrome is installed and');
    console.log('        the extension has been built (npm run build in chrome-extension/).');
    process.exit(1);
  }

  // Open a fresh page for the demo
  const page: Page = await context.newPage();

  // Apply configured viewport dimensions
  await page.setViewportSize({
    width: DEMO_CONFIG.browser.windowWidth,
    height: DEMO_CONFIG.browser.windowHeight,
  });

  // Brief startup pause to let the extension initialise
  await sleep(2000);

  try {
    await runScenario(page, context);
  } catch (err) {
    console.error('\n❌ Demo Error:', err);
  } finally {
    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await sleep(5000);
    await context.close();
    console.log('✅ Demo automation complete. Browser closed.\n');
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
