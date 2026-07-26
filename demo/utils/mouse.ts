/**
 * Promptless AI — Demo Automation Framework
 * Mouse utility: Smooth bezier-curve mouse movement and natural interaction helpers.
 *
 * Provides human-like mouse trajectories using cubic bezier curves with
 * easing functions, preventing detection by anti-bot systems during demos.
 */

import { Page } from 'playwright';

// ─── Sleep Helper ─────────────────────────────────────────────────────────────

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Bezier Mouse Movement ────────────────────────────────────────────────────

/**
 * Moves the mouse from the viewport center to the target coordinates using
 * a cubic bezier curve with ease-in-out timing, simulating natural human motion.
 *
 * @param page        - Playwright page instance
 * @param targetX     - Target X coordinate (px)
 * @param targetY     - Target Y coordinate (px)
 * @param durationMs  - Total duration of the movement in ms (default: 800)
 */
export async function smoothMouseMove(
  page: Page,
  targetX: number,
  targetY: number,
  durationMs: number = 800
): Promise<void> {
  const steps = Math.max(20, Math.floor(durationMs / 16)); // ~60fps
  const viewport = page.viewportSize();
  if (!viewport) return;

  // Start approximation: center of viewport
  const startX = viewport.width / 2;
  const startY = viewport.height / 2;

  // Control points for a natural S-shaped bezier curve
  const cp1x = startX + (targetX - startX) * 0.25 + (Math.random() - 0.5) * 80;
  const cp1y = startY + (targetY - startY) * 0.1;
  const cp2x = startX + (targetX - startX) * 0.75;
  const cp2y = targetY + (Math.random() - 0.5) * 60;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    // Ease-in-out cubic (smooth-step feel)
    const ease = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Evaluate cubic bezier: B(ease) using the four control points
    const x =
      Math.pow(1 - ease, 3) * startX +
      3 * Math.pow(1 - ease, 2) * ease * cp1x +
      3 * (1 - ease) * ease * ease * cp2x +
      Math.pow(ease, 3) * targetX;

    const y =
      Math.pow(1 - ease, 3) * startY +
      3 * Math.pow(1 - ease, 2) * ease * cp1y +
      3 * (1 - ease) * ease * ease * cp2y +
      Math.pow(ease, 3) * targetY;

    await page.mouse.move(x, y);
    await sleep(durationMs / steps);
  }
}

// ─── Natural Click ────────────────────────────────────────────────────────────

/**
 * Moves to a selector using bezier motion then clicks it naturally,
 * including a tiny random offset within the element's bounding box.
 *
 * @param page     - Playwright page instance
 * @param selector - CSS selector to click
 * @param options  - Optional timeout override
 */
export async function naturalClick(
  page: Page,
  selector: string,
  options?: { timeout?: number }
): Promise<void> {
  const el = await page.waitForSelector(selector, {
    timeout: options?.timeout ?? 10000,
  });
  if (!el) throw new Error(`Element not found: ${selector}`);

  const box = await el.boundingBox();
  if (!box) throw new Error(`Cannot get bounding box for: ${selector}`);

  // Move to element center with slight random human jitter
  await smoothMouseMove(
    page,
    box.x + box.width / 2 + (Math.random() - 0.5) * 4,
    box.y + box.height / 2 + (Math.random() - 0.5) * 4,
    800
  );

  // Micro-pause before clicking (humans hesitate briefly)
  await sleep(100 + Math.random() * 100);
  await el.click();
}

// ─── Smooth Scroll ────────────────────────────────────────────────────────────

/**
 * Scrolls the page smoothly in incremental wheel steps,
 * simulating natural trackpad or mouse-wheel scrolling.
 *
 * @param page      - Playwright page instance
 * @param direction - 'down' or 'up'
 * @param amount    - Total scroll distance in pixels (default: 400)
 */
export async function smoothScroll(
  page: Page,
  direction: 'down' | 'up' = 'down',
  amount: number = 400
): Promise<void> {
  const delta = direction === 'down' ? amount : -amount;
  const steps = 20;

  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, delta / steps);
    await sleep(40); // ~25fps scroll cadence
  }
}

// ─── Hover Helper ─────────────────────────────────────────────────────────────

/**
 * Smoothly hovers over an element without clicking.
 * Useful for triggering tooltips or hover states in demos.
 *
 * @param page     - Playwright page instance
 * @param selector - CSS selector to hover
 */
export async function smoothHover(
  page: Page,
  selector: string
): Promise<void> {
  const el = await page.waitForSelector(selector, { timeout: 10000 });
  if (!el) throw new Error(`Element not found: ${selector}`);

  const box = await el.boundingBox();
  if (!box) throw new Error(`Cannot get bounding box for: ${selector}`);

  await smoothMouseMove(
    page,
    box.x + box.width / 2,
    box.y + box.height / 2,
    600
  );
  await sleep(400);
}
