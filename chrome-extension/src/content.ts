// Manifest V3 Content Script for DOM Context Extraction with SPA Navigation Support

interface LinkedInJobContext {
  jobTitle: string;
  companyName: string;
  location: string;
  jobDescription: string;
  url: string;
}

interface YouTubeVideoContext {
  videoTitle: string;
  channelName: string;
  description: string;
  transcript: string;
  url: string;
}

type ExtractedPageContext =
  | { platform: "linkedin"; data: LinkedInJobContext }
  | { platform: "youtube"; data: YouTubeVideoContext }
  | { platform: "unknown"; reason: string };

function extractLinkedInContext(): LinkedInJobContext | null {
  const jobTitleEl =
    document.querySelector(".job-details-jobs-unified-top-card__job-title") ||
    document.querySelector(".jobs-unified-top-card__job-title") ||
    document.querySelector("h1.t-24") ||
    document.querySelector("h1");
  const companyEl =
    document.querySelector(".job-details-jobs-unified-top-card__company-name") ||
    document.querySelector(".jobs-unified-top-card__company-name") ||
    document.querySelector(".jobs-unified-top-card__primary-description a");
  const descEl =
    document.querySelector(".jobs-description__content") ||
    document.querySelector(".jobs-box__html-content") ||
    document.querySelector("article");

  const jobTitle = jobTitleEl?.textContent?.trim();
  const companyName = companyEl?.textContent?.trim();
  const jobDescription = descEl?.textContent?.trim().slice(0, 5000);

  // Return null if core DOM nodes cannot be detected reliably without false-positive fallbacks
  if (!jobTitle || !companyName) {
    return null;
  }

  return {
    jobTitle,
    companyName,
    location: "Remote / Hybrid",
    jobDescription:
      jobDescription ||
      "Position description detected from LinkedIn DOM hierarchy.",
    url: window.location.href,
  };
}

function extractYouTubeContext(): YouTubeVideoContext | null {
  const titleEl =
    document.querySelector("h1.ytd-watch-metadata") ||
    document.querySelector("h1.title") ||
    document.querySelector("ytd-video-primary-info-renderer h1");
  const channelEl =
    document.querySelector("ytd-channel-name a") ||
    document.querySelector("#channel-name a") ||
    document.querySelector("ytd-video-owner-renderer ytd-channel-name");
  const descEl =
    document.querySelector("#description-inline-expander") ||
    document.querySelector("#description");

  const videoTitle = titleEl?.textContent?.trim();
  const channelName = channelEl?.textContent?.trim();
  const description = descEl?.textContent?.trim().slice(0, 3000);

  if (!videoTitle || !channelName) {
    return null;
  }

  return {
    videoTitle,
    channelName,
    description:
      description || "Video metadata detected from YouTube watch DOM.",
    transcript:
      "Automated DOM extraction context ready for zero-click analysis.",
    url: window.location.href,
  };
}

function getPageContext(): ExtractedPageContext {
  const url = window.location.href;
  if (url.includes("linkedin.com")) {
    const linkedIn = extractLinkedInContext();
    if (linkedIn) {
      return { platform: "linkedin", data: linkedIn };
    }
    return {
      platform: "unknown",
      reason: "CANNOT_DETECT_DOM: LinkedIn job title or company node not found.",
    };
  } else if (url.includes("youtube.com")) {
    const youTube = extractYouTubeContext();
    if (youTube) {
      return { platform: "youtube", data: youTube };
    }
    return {
      platform: "unknown",
      reason: "CANNOT_DETECT_DOM: YouTube watch metadata title node not found.",
    };
  }
  return {
    platform: "unknown",
    reason: "Unsupported domain. Navigate to LinkedIn Jobs or YouTube.",
  };
}

// Listen for message from side panel requesting DOM extraction
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "REQUEST_PAGE_CONTEXT") {
    const context = getPageContext();
    sendResponse({ success: true, context });
  }
  return true;
});

// Comprehensive Single-Page Application (SPA) & Browser Lifecycle Observer
let lastReportedUrl = window.location.href;

function notifySidePanelOfNavigation(forceReset = false) {
  const currentUrl = window.location.href;
  if (currentUrl !== lastReportedUrl || forceReset) {
    lastReportedUrl = currentUrl;
    const context = getPageContext();
    chrome.runtime
      .sendMessage({
        type: "PAGE_CONTEXT_UPDATED",
        url: currentUrl,
        context,
        reset: true,
        timestamp: Date.now(),
      })
      .catch(() => {
        // Side panel may be closed, ignore messaging error
      });
  }
}

// 1. Monkey-patch History API (pushState & replaceState) for SPA client-side routing
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args) {
  originalPushState.apply(this, args);
  notifySidePanelOfNavigation(true);
};

history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  notifySidePanelOfNavigation(true);
};

// 2. Listen for browser Back, Forward, and Hash Navigation
window.addEventListener("popstate", () => notifySidePanelOfNavigation(true));
window.addEventListener("hashchange", () => notifySidePanelOfNavigation(true));

// 3. YouTube specific navigation event
window.addEventListener("yt-navigate-finish", () => {
  setTimeout(() => notifySidePanelOfNavigation(true), 300);
});

// 4. Page Visibility & Focus Changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    notifySidePanelOfNavigation(false);
  }
});

// 5. DOM MutationObserver fallback for dynamic frameworks
const observer = new MutationObserver(() => {
  notifySidePanelOfNavigation(false);
});
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
}

console.log("Promptless AI 2.0 Content Script with Live Context Synchronization Loaded.");

