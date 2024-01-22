chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.get(["status"], function (result) {
    if (result.status) {
      chrome.action.setIcon({
        path: {
          48: "logo-48-gray.png",
        },
      });
    } else {
      chrome.action.setIcon({
        path: {
          48: "src/assets/logo-48.png",
        },
      });
    }
    chrome.storage.sync.set({ status: !result.status });
  });
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.storage.sync.set({ status: true });
  }
});
