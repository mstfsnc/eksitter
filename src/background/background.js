chrome.browserAction.onClicked.addListener(function () {
  chrome.storage.sync.get(["status"], function (result) {
    if (result.status) {
      chrome.browserAction.setIcon({ path: "/assets/logo-48-gray.png" });
    } else {
      chrome.browserAction.setIcon({ path: "/assets/logo-48.png" });
    }
    chrome.storage.sync.set({ status: !result.status });
  });
});
