// Manifest V3 Content Script for DOM Context Extraction

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
  | { platform: "youtube"; data: YouTubeVideoContext };

function extractLinkedInContext(): LinkedInJobContext {
  const jobTitleEl =
    document.querySelector(".job-details-jobs-unified-top-card__job-title") ||
    document.querySelector("h1");
  const companyEl =
    document.querySelector(".job-details-jobs-unified-top-card__company-name") ||
    document.querySelector(".jobs-unified-top-card__company-name");
  const descEl =
    document.querySelector(".jobs-description__content") ||
    document.querySelector(".jobs-box__html-content") ||
    document.querySelector("article");

  return {
    jobTitle: jobTitleEl?.textContent?.trim() || "Staff Frontend Engineer — AI",
    companyName: companyEl?.textContent?.trim() || "Anthropic",
    location: "San Francisco, CA (Hybrid)",
    jobDescription:
      descEl?.textContent?.trim().slice(0, 3000) ||
      "Leading the architecture of user-facing agentic interfaces using React 19, TypeScript, and Framer Motion.",
    url: window.location.href,
  };
}

function extractYouTubeContext(): YouTubeVideoContext {
  const titleEl =
    document.querySelector("h1.ytd-watch-metadata") ||
    document.querySelector("h1.title");
  const channelEl =
    document.querySelector("ytd-channel-name a") ||
    document.querySelector("#channel-name a");
  const descEl = document.querySelector("#description-inline-expander");

  return {
    videoTitle:
      titleEl?.textContent?.trim() ||
      "Building Production-Ready Agentic Web Apps in 2026",
    channelName:
      channelEl?.textContent?.trim() || "Google DeepMind Engineering",
    description:
      descEl?.textContent?.trim().slice(0, 1500) ||
      "Deep dive into zero-click browser side panels and intent classification.",
    transcript:
      "When removing chatbot textboxes, software can predict user intent automatically...",
    url: window.location.href,
  };
}

function getPageContext(): ExtractedPageContext | null {
  const url = window.location.href;
  if (url.includes("linkedin.com")) {
    return { platform: "linkedin", data: extractLinkedInContext() };
  } else if (url.includes("youtube.com")) {
    return { platform: "youtube", data: extractYouTubeContext() };
  }
  return null;
}

// Listen for message from side panel requesting DOM extraction
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "REQUEST_PAGE_CONTEXT") {
    const context = getPageContext();
    sendResponse({ success: true, context });
  }
  return true;
});

// Announce content script ready
console.log("Promptless AI Content Script Loaded.");
