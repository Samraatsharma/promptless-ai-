// Manifest V3 Background Service Worker for Promptless AI Side Panel

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const isLinkedIn = tab.url.includes("linkedin.com/jobs");
    const isYouTube = tab.url.includes("youtube.com/watch");
    if (isLinkedIn || isYouTube) {
      chrome.sidePanel.setOptions({
        tabId,
        path: "sidepanel.html",
        enabled: true,
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "PING_PROMPTLESS") {
    sendResponse({ status: "ACTIVE", version: "1.0.0" });
  }
  return true;
});
