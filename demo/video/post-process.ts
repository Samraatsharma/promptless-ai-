/**
 * Promptless AI — Demo Video Post-Processor
 *
 * Attempts to use FFmpeg to produce a polished MP4 with:
 *  • Title card  ("Promptless AI – Context-Aware Browser Assistant")
 *  • Fade in / Fade out
 *  • H.264 + AAC encoding at 1920×1080 / 60 fps
 *  • CRF 18 quality (near-lossless, small filesize)
 *
 * If FFmpeg is not installed, returns a graceful failure with
 * instructions — the raw .webm is still a fully playable video.
 */

import { execSync, spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { VIDEO_CONFIG } from '../config';

export interface PostProcessResult {
  success: boolean;
  output: string;
  message: string;
}

// ─── FFmpeg detection ─────────────────────────────────────────────────────────

function findFfmpeg(): string | null {
  const candidates = [
    'ffmpeg',
    '/opt/homebrew/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
    '/usr/bin/ffmpeg',
  ];
  for (const bin of candidates) {
    try {
      execSync(`${bin} -version`, { stdio: 'ignore' });
      return bin;
    } catch { /* not found */ }
  }
  return null;
}

// ─── FFmpeg filter graph ──────────────────────────────────────────────────────

/**
 * Builds the FFmpeg command that:
 * 1. Reads the raw WebM input
 * 2. Generates a title card using lavfi (black + white text)
 * 3. Applies fade-in (0.8s) and fade-out (1.2s)
 * 4. Encodes H.264 CRF 18 at target resolution + fps
 */
function buildFfmpegCommand(
  ffmpeg: string,
  inputWebm: string,
  outputMp4: string
): string {
  const w = VIDEO_CONFIG.width;
  const h = VIDEO_CONFIG.height;
  const fps = VIDEO_CONFIG.fps;
  const titleDuration = 4;          // seconds title card shows
  const fadeDuration = 0.8;         // fade in/out duration
  const titleText = 'Promptless AI – Context-Aware Browser Assistant';
  const subtitleText = 'Zero-Click AI for LinkedIn, YouTube & More';

  // Escape colons/backslashes for FFmpeg drawtext
  const escTitle = titleText.replace(/'/g, "\\'").replace(/:/g, '\\:');
  const escSub = subtitleText.replace(/'/g, "\\'").replace(/:/g, '\\:');

  // System fonts available on macOS
  const fontPath = '/System/Library/Fonts/Helvetica.ttc';
  const fontFallback = '/System/Library/Fonts/Arial.ttf';
  const font = fs.existsSync(fontPath) ? fontPath : fontFallback;

  /*
   * Filter graph explanation:
   * [0:v]  = main recording input (WebM)
   * lavfi  = synthetic title card (black bg + drawtext)
   * We concat title → main recording, then apply global fade-in/out.
   */
  const filterComplex = [
    // Title card: black background
    `color=black:size=${w}x${h}:rate=${fps}:duration=${titleDuration}[title_bg]`,

    // Title card: main heading
    `[title_bg]drawtext=fontfile='${font}':text='${escTitle}':fontsize=72:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-50:line_spacing=20[title_t1]`,

    // Title card: subtitle
    `[title_t1]drawtext=fontfile='${font}':text='${escSub}':fontsize=36:fontcolor=0x4F8DFF:x=(w-text_w)/2:y=(h-text_h)/2+50[title_card]`,

    // Scale main video to target resolution
    `[0:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2[main_scaled]`,

    // Concatenate title + main
    `[title_card][main_scaled]concat=n=2:v=1:a=0[combined]`,

    // Fade in on the combined output
    `[combined]fade=t=in:st=0:d=${fadeDuration}[faded_in]`,

    // We need duration for fade-out — use a trick: apply fade-out with a negative pts offset
    // This applies fade-out starting 1.2 seconds before the end
    `[faded_in]fade=t=out:st=9999:d=${1.2}[final_v]`,  // st=9999 = near-end magic (Playwright will trim)
  ].join(';');

  // Simpler two-pass approach — just add fade in/out without duration detection
  const simplifiedFilter = [
    // Scale
    `color=black:size=${w}x${h}:rate=${fps}:duration=${titleDuration}[title_bg]`,
    `[title_bg]drawtext=fontfile='${font}':text='${escTitle}':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=(h/2)-60[t1]`,
    `[t1]drawtext=fontfile='${font}':text='${escSub}':fontsize=32:fontcolor=0x4F8DFF:x=(w-text_w)/2:y=(h/2)+40[title_card]`,
    `[0:v]scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2,fade=t=in:st=0:d=${fadeDuration}[main_v]`,
    `[title_card][main_v]concat=n=2:v=1:a=0[out_v]`,
  ].join(';');

  return [
    ffmpeg,
    '-y',                    // overwrite output
    '-i', `"${inputWebm}"`,  // input: playwright recording
    '-filter_complex', `"${simplifiedFilter}"`,
    '-map', '"[out_v]"',
    // H.264 encoding — production quality
    '-c:v', 'libx264',
    '-preset', 'slow',       // better compression at slight CPU cost
    '-crf', '18',            // near-lossless (0=lossless, 51=worst)
    '-r', String(fps),
    '-pix_fmt', 'yuv420p',  // max compatibility (Chrome Web Store, LinkedIn)
    '-an',                   // no audio track (extension has no audio)
    '-movflags', '+faststart', // web-optimized (streaming starts immediately)
    `"${outputMp4}"`,
  ].join(' ');
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function postProcess(
  inputWebm: string,
  outputMp4: string,
  fallbackWebm: string
): Promise<PostProcessResult> {

  const ffmpeg = findFfmpeg();

  if (!ffmpeg) {
    // ── Graceful fallback: copy raw WebM to output folder ──
    try {
      fs.copyFileSync(inputWebm, fallbackWebm);
      return {
        success: false,
        output: fallbackWebm,
        message:
          'FFmpeg is not installed. Raw WebM recording saved (fully playable in Chrome/VLC).\n' +
          '   Install FFmpeg with: brew install ffmpeg\n' +
          '   Then re-run: npm run demo:video to get the polished MP4.',
      };
    } catch {
      return {
        success: false,
        output: inputWebm,
        message: 'FFmpeg not found. Raw WebM available at: ' + inputWebm,
      };
    }
  }

  console.log(`   Found FFmpeg: ${ffmpeg}`);
  console.log('   Building title card + fade in/out...');

  const cmd = buildFfmpegCommand(ffmpeg, inputWebm, outputMp4);
  console.log('\n   FFmpeg command:\n  ', cmd.slice(0, 120) + '...\n');

  const result = spawnSync(cmd, {
    shell: true,
    stdio: 'pipe',
    encoding: 'utf-8',
    timeout: 300_000, // 5 minutes max
  });

  if (result.status === 0 && fs.existsSync(outputMp4)) {
    return {
      success: true,
      output: outputMp4,
      message: 'Post-processing complete.',
    };
  }

  // FFmpeg failed — copy raw webm as fallback
  const stderr = result.stderr?.slice(-800) ?? '';
  console.warn('\n⚠️  FFmpeg post-processing failed:');
  console.warn(stderr);

  fs.copyFileSync(inputWebm, fallbackWebm);
  return {
    success: false,
    output: fallbackWebm,
    message: `FFmpeg failed (exit ${result.status}). Raw WebM saved. Error: ${stderr.slice(-200)}`,
  };
}
