// Manifest V3 Background Service Worker for Promptless AI 2.0 (Live Context Synchronization)
// Continuously monitors Tab Changes, Window Focus, URL Updates, SPA Navigation, and Lifecycle resets.

// 1. Enable Side Panel on click across all tabs
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// Helper to broadcast active tab state to any open Side Panel
function broadcastActiveTabContext() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab && activeTab.url) {
      chrome.runtime
        .sendMessage({
          type: "ACTIVE_TAB_CHANGED",
          url: activeTab.url,
          title: activeTab.title || "",
          tabId: activeTab.id,
          timestamp: Date.now(),
        })
        .catch(() => {
          // Ignore error if sidepanel is closed
        });
    }
  });
}

// 2. Continuous Monitoring: Active Tab Changes
chrome.tabs.onActivated.addListener(() => {
  broadcastActiveTabContext();
});

// 3. Continuous Monitoring: URL / Status Updates
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    if (tab.active) {
      broadcastActiveTabContext();
    }
  }
});

// 4. Continuous Monitoring: Window Focus Changes
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    broadcastActiveTabContext();
  }
});

// 5. Continuous Monitoring: SPA History API Navigation
if (chrome.webNavigation && chrome.webNavigation.onHistoryStateUpdated) {
  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    if (details.frameId === 0) {
      broadcastActiveTabContext();
    }
  });
}

// 6. Message handler for content script pings
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "PING_PROMPTLESS") {
    sendResponse({ status: "ACTIVE", version: "2.0.0" });
  }
  return true;
});
