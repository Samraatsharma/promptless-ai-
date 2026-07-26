/**
 * Promptless AI — Demo Video Recorder
 *
 * Uses Playwright's built-in video recording (WebM via VP8/VP9).
 * After recording, calls the post-processor to produce the final MP4.
 *
 * Usage:
 *   npm run demo:video
 *
 * Output:
 *   demo/output/raw/session-<timestamp>.webm   — raw Playwright capture
 *   demo/output/promptless-demo.mp4            — final polished video (if ffmpeg present)
 *   demo/output/promptless-demo.webm           — fallback if ffmpeg not installed
 */

import { chromium, BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { DEMO_CONFIG, VIDEO_CONFIG } from './config';
import { runFullDemo } from './scenarios/full-demo';
import { sleep } from './utils/mouse';
import { postProcess } from './video/post-process';

const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const RAW_DIR = path.join(OUTPUT_DIR, 'raw');
const RAW_VIDEO = path.join(RAW_DIR, `session-${TIMESTAMP}.webm`);
const FINAL_VIDEO = path.join(OUTPUT_DIR, 'promptless-demo.mp4');
const FALLBACK_VIDEO = path.join(OUTPUT_DIR, 'promptless-demo.webm');

function ensureDirs(): void {
  [OUTPUT_DIR, RAW_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

function printBanner(): void {
  console.log('\n' + '═'.repeat(64));
  console.log('  🎬  PROMPTLESS AI — CINEMATIC DEMO VIDEO RECORDER');
  console.log('═'.repeat(64));
  console.log(`\n  Resolution  : ${VIDEO_CONFIG.width}×${VIDEO_CONFIG.height}`);
  console.log(`  Frame Rate  : ${VIDEO_CONFIG.fps} fps`);
  console.log(`  Raw output  : ${RAW_VIDEO}`);
  console.log(`  Final output: ${FINAL_VIDEO}`);
  console.log();
}

async function main(): Promise<void> {
  printBanner();
  ensureDirs();

  const extensionPath = path.resolve(__dirname, DEMO_CONFIG.extensionPath);

  if (!fs.existsSync(extensionPath)) {
    console.error(`\n❌ Extension not found at: ${extensionPath}`);
    console.log('   Run: npm --prefix ../chrome-extension run build');
    process.exit(1);
  }

  console.log('🚀 Launching Chrome with extension + video recording...\n');

  let context: BrowserContext;
  try {
    context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--load-extension=${extensionPath}`,
        `--disable-extensions-except=${extensionPath}`,
        '--start-maximized',
        '--no-sandbox',
        '--disable-infobars',
        '--disable-blink-features=AutomationControlled',
        // Hide the "Chrome is being controlled" infobar
        '--disable-features=TranslateUI',
        // Ensure high-quality rendering
        '--force-device-scale-factor=1',
      ],
      viewport: {
        width: VIDEO_CONFIG.width,
        height: VIDEO_CONFIG.height,
      },
      slowMo: DEMO_CONFIG.browser.slowMo,
      channel: 'chrome',
      // ✅ Playwright built-in video recording
      recordVideo: {
        dir: RAW_DIR,
        size: {
          width: VIDEO_CONFIG.width,
          height: VIDEO_CONFIG.height,
        },
      },
    });
  } catch (launchErr) {
    console.error('❌ Failed to launch Chrome:', launchErr);
    process.exit(1);
  }

  // Give extension a moment to initialize
  await sleep(2000);

  // Open the main page for the demo tour
  const page: Page = await context.newPage();

  // Navigate to a blank start to let extension load
  await page.goto('about:blank');
  await sleep(1500);

  console.log('🎥 Recording started. Running Full Product Tour...\n');

  let recordingPath: string | undefined;

  try {
    await runFullDemo(page, context);

    // Hold on landing page for closing title moment
    console.log('\n⏸  Holding on landing page for 4 seconds (closing shot)...');
    await sleep(4000);

  } catch (err) {
    console.error('\n❌ Demo error during recording:', err);
  } finally {
    // Save video — must call page.video().path() BEFORE context.close()
    try {
      const video = page.video();
      if (video) {
        recordingPath = await video.path();
        console.log(`\n💾 Raw recording saved: ${recordingPath}`);
      }
    } catch (_) { /* video may not be available */ }

    await context.close();
    console.log('✅ Browser closed.');
  }

  // ── Post-processing ──────────────────────────────────────────────────────────
  if (recordingPath && fs.existsSync(recordingPath)) {
    console.log('\n🎞  Starting post-processing pipeline...');
    const result = await postProcess(recordingPath, FINAL_VIDEO, FALLBACK_VIDEO);

    if (result.success) {
      console.log('\n' + '═'.repeat(64));
      console.log('  🏆  DEMO VIDEO COMPLETE!');
      console.log('═'.repeat(64));
      console.log(`\n  File : ${result.output}`);
      console.log(`  Size : ${getFileSizeMB(result.output)} MB`);
      console.log(`\n  Ready for: Product Hunt · LinkedIn · YouTube · Chrome Web Store`);
      console.log('═'.repeat(64) + '\n');
    } else {
      console.log('\n⚠️  Post-processing unavailable:');
      console.log(`   ${result.message}`);
      console.log('\n📦 Raw recording (WebM) is fully playable:');
      console.log(`   ${recordingPath}`);
      console.log('\n💡 To get the polished MP4, install FFmpeg:');
      console.log('   brew install ffmpeg');
      console.log('   Then re-run: npm run demo:video\n');
    }
  } else {
    console.warn('\n⚠️  No recording file found. Check browser permissions.');
  }
}

function getFileSizeMB(filePath: string): string {
  try {
    const bytes = fs.statSync(filePath).size;
    return (bytes / (1024 * 1024)).toFixed(1);
  } catch {
    return '?';
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
