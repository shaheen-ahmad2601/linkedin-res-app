chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'tabUpdated' });
  }
});
