/**
 * Promptless AI — Demo Automation Framework
 * Central configuration file for all demo settings.
 * Modify values here to tune timings, URLs, and behavior.
 */

export const DEMO_CONFIG = {
  // Chrome extension dist path (relative to this demo/ directory)
  extensionPath: '../chrome-extension/dist',

  // Browser settings
  browser: {
    headless: false,
    slowMo: 0,
    windowWidth: 1440,
    windowHeight: 900,
  },

  // Animation timing (ms)
  timing: {
    mouseSpeed: 800,       // ms for smooth mouse movement
    naturalPause: 1200,    // pause between actions
    longPause: 2500,       // pause for reading
    pageLoad: 3000,        // wait for page to be ready
    aiGeneration: 12000,   // max wait for AI output
    extensionOpen: 1500,   // wait after opening extension
    scrollDuration: 800,   // smooth scroll time
    transitionPause: 600,  // between demo steps
  },

  // Demo URLs
  urls: {
    linkedinFeed: 'https://www.linkedin.com/feed/',
    linkedinJob: 'https://www.linkedin.com/jobs/view/4206537354/',
    youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    github: 'https://github.com/microsoft/vscode',
    gmail: 'https://mail.google.com/mail/u/0/',
    promptlessWebsite: 'https://promptless-ai.vercel.app',
  },

  // Scenarios to run in full-demo (order matters)
  fullDemoOrder: ['linkedin-demo', 'youtube-demo', 'github-demo'],
} as const;

export type DemoConfig = typeof DEMO_CONFIG;
