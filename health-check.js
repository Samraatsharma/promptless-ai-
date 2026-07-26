#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Promptless AI — Automated Diagnostic Health Check CLI (`health-check.js`)
 * Verifies Node version, dependencies, environment configuration, and build artifacts.
 */

const fs = require("fs");
const path = require("path");

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

let passCount = 0;
let warnCount = 0;
let failCount = 0;

function logPass(msg) {
  console.log(`${GREEN}[✔ PASS]${RESET} ${msg}`);
  passCount++;
}

function logWarn(msg) {
  console.log(`${YELLOW}[▲ WARN]${RESET} ${msg}`);
  warnCount++;
}

function logFail(msg) {
  console.log(`${RED}[✖ FAIL]${RESET} ${msg}`);
  failCount++;
}

console.log(`${CYAN}====================================================${RESET}`);
console.log(`${CYAN}    PROMPTLESS AI — DIAGNOSTIC HEALTH CHECK CLI      ${RESET}`);
console.log(`${CYAN}====================================================${RESET}\n`);

// 1. Node.js Version Check
const nodeVersion = process.versions.node;
const majorVersion = parseInt(nodeVersion.split(".")[0], 10);
if (majorVersion >= 18) {
  logPass(`Node.js version v${nodeVersion} is compatible (>= 18.x)`);
} else {
  logFail(
    `Node.js version v${nodeVersion} is unsupported. Please upgrade to Node 18+ or 20+.`
  );
}

// 2. Monorepo Folder Structure Check
const requiredFolders = [
  "app",
  "components",
  "lib",
  "chrome-extension",
  "supabase",
];
let missingFolder = false;
for (const folder of requiredFolders) {
  if (!fs.existsSync(path.join(__dirname, folder))) {
    logFail(`Missing required directory: /${folder}`);
    missingFolder = true;
  }
}
if (!missingFolder) {
  logPass("All core monorepo directories are present and intact");
}

// 3. Environment Variable Configuration Check
const envPath = path.join(__dirname, ".env.local");
const examplePath = path.join(__dirname, ".env.example");
if (fs.existsSync(envPath)) {
  logPass(".env.local file found");
  const content = fs.readFileSync(envPath, "utf-8");
  if (content.includes("GEMINI_API_KEY=")) {
    logPass("GEMINI_API_KEY is defined in .env.local");
  } else {
    logWarn("GEMINI_API_KEY missing from .env.local; fallback mocks will be used");
  }
} else if (fs.existsSync(examplePath)) {
  logWarn(".env.local not found, but .env.example exists. Copying or setting vars required for production AI calls");
} else {
  logFail("Neither .env.local nor .env.example was found");
}

// 4. Next.js Build Check
const nextBuildDir = path.join(__dirname, ".next");
if (fs.existsSync(nextBuildDir)) {
  logPass("Next.js 16 production build directory (.next) found");
} else {
  logWarn("Next.js build directory (.next) not found. Run 'npm run build' before deployment");
}

// 5. Chrome Extension Manifest V3 Build Check
const extBuildDir = path.join(__dirname, "chrome-extension/dist");
const sidepanelHtml = path.join(extBuildDir, "sidepanel.html");
const sidepanelJs = path.join(extBuildDir, "sidepanel.js");
if (
  fs.existsSync(extBuildDir) &&
  fs.existsSync(sidepanelHtml) &&
  fs.existsSync(sidepanelJs)
) {
  logPass("Chrome Extension Manifest V3 build bundle found in /chrome-extension/dist");
} else {
  logWarn("Chrome Extension build bundle missing. Run 'npm --prefix chrome-extension run build'");
}

// 6. ESLint / TypeScript Manifest Integrity
const tsConfigPath = path.join(__dirname, "tsconfig.json");
const extTsConfigPath = path.join(__dirname, "chrome-extension/tsconfig.json");
if (fs.existsSync(tsConfigPath) && fs.existsSync(extTsConfigPath)) {
  logPass("TypeScript compiler configuration files present in root and workspace");
} else {
  logFail("Missing tsconfig.json in project root or chrome-extension/");
}

console.log(`\n${CYAN}----------------------------------------------------${RESET}`);
console.log(
  `Health Check Summary: ${GREEN}${passCount} Passed${RESET} | ${YELLOW}${warnCount} Warnings${RESET} | ${RED}${failCount} Failed${RESET}`
);
console.log(`${CYAN}----------------------------------------------------${RESET}\n`);

if (failCount > 0) {
  console.error(
    `${RED}[ERROR] Promptless AI health check failed. Resolve the errors above.${RESET}`
  );
  process.exit(1);
} else {
  console.log(
    `${GREEN}[SUCCESS] Promptless AI is healthy and ready for local development / production deployment!${RESET}`
  );
  process.exit(0);
}
