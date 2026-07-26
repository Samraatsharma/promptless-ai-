import { Page } from 'playwright';
import { sleep, smoothScroll } from '../utils/mouse';
import { DEMO_CONFIG } from '../config';

export async function runGmailDemo(page: Page): Promise<void> {
  console.log('\n📧 [GMAIL DEMO] Starting Gmail scenario...');

  await page.goto(DEMO_CONFIG.urls.gmail, { waitUntil: 'domcontentloaded' });
  await sleep(DEMO_CONFIG.timing.pageLoad);

  // Scroll through inbox naturally
  await smoothScroll(page, 'down', 300);
  await sleep(DEMO_CONFIG.timing.naturalPause);
  await smoothScroll(page, 'down', 200);
  await sleep(DEMO_CONFIG.timing.longPause);

  console.log('   ✅ Gmail demo scenario complete.');
}
