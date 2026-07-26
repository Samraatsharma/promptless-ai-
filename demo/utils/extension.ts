/**
 * Promptless AI — Demo Automation Framework
 * Extension utilities: helpers for interacting with the Promptless AI Chrome side panel.
 *
 * The extension renders as a side panel page within the browser context.
 * These helpers provide reliable detection and interaction patterns for it.
 */

import { BrowserContext, Page } from 'playwright';
import { sleep } from './mouse';
import { DEMO_CONFIG } from '../config';

// ─── Page Load ────────────────────────────────────────────────────────────────

/**
 * Waits for a page's DOM to be fully loaded and applies a configurable
 * settling delay before further interactions.
 *
 * @param page - Playwright page instance
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await sleep(DEMO_CONFIG.timing.pageLoad);
}

// ─── Side Panel Detection ─────────────────────────────────────────────────────

/**
 * Attempts to find the Promptless AI side panel page within the browser context.
 * Side panels appear as separate pages whose URL contains 'sidepanel'.
 *
 * Returns the side panel Page if found, or null if not yet open.
 *
 * @param context - The Playwright browser context to search
 */
export async function openSidePanel(context: BrowserContext): Promise<Page | null> {
  const pages = context.pages();
  const sidePanelPage = pages.find(p => p.url().includes('sidepanel'));
  return sidePanelPage ?? null;
}

/**
 * Polls the browser context until the side panel page appears or times out.
 *
 * @param context    - The Playwright browser context
 * @param timeoutMs  - Max time to wait for the side panel (default: 10000ms)
 */
export async function waitForSidePanel(
  context: BrowserContext,
  timeoutMs: number = 10000
): Promise<Page | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const panel = await openSidePanel(context);
    if (panel) return panel;
    await sleep(300);
  }
  console.warn('⚠️  Side panel did not appear within timeout.');
  return null;
}

// ─── AI Output Detection ──────────────────────────────────────────────────────

/**
 * Waits for the AI to finish generating its output in the side panel.
 *
 * Polls for a `[data-generating="false"]` attribute on the panel's root element,
 * which the extension sets when the stream is complete. Falls back to a full
 * `aiGeneration` wait if the attribute never appears.
 *
 * @param page     - The side panel Playwright page
 * @param maxWait  - Maximum polling duration in ms (default: 15000)
 * @returns        - true when output detected or timeout reached
 */
export async function waitForAIOutput(
  page: Page,
  maxWait: number = 15000
): Promise<boolean> {
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    const hasContent = await page
      .evaluate(() => {
        const el = document.querySelector('[data-generating="false"]');
        return !!el;
      })
      .catch(() => false);

    if (hasContent) return true;
    await sleep(500);
  }

  // Fallback: just wait the configured AI generation time
  await sleep(DEMO_CONFIG.timing.aiGeneration);
  return true;
}

// ─── Extension Action Helpers ─────────────────────────────────────────────────

/**
 * Triggers the extension keyboard shortcut to open the side panel.
 * Default Promptless AI shortcut: Cmd+Shift+P (Mac) / Ctrl+Shift+P (Win).
 *
 * @param page     - The active browser page
 * @param isMac    - Whether to use Cmd (Mac) vs Ctrl (Windows/Linux)
 */
export async function triggerExtensionShortcut(
  page: Page,
  isMac: boolean = true
): Promise<void> {
  const modifier = isMac ? 'Meta' : 'Control';
  await page.keyboard.press(`${modifier}+Shift+P`);
  await sleep(DEMO_CONFIG.timing.extensionOpen);
}

/**
 * Sends a message to the Promptless AI side panel input and submits it.
 *
 * @param sidePanelPage - The side panel Playwright page
 * @param message       - The text message to type into the input
 * @param inputSelector - CSS selector for the text input (default: 'textarea')
 */
export async function sendMessageToExtension(
  sidePanelPage: Page,
  message: string,
  inputSelector: string = 'textarea'
): Promise<void> {
  await sidePanelPage.waitForSelector(inputSelector, { timeout: 8000 });
  await sidePanelPage.click(inputSelector);
  await sidePanelPage.type(inputSelector, message, { delay: 40 });
  await sleep(300);
  await sidePanelPage.keyboard.press('Enter');
}
