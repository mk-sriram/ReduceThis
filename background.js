chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "changeText",
    title: "Reduce This",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "changeText") {
    await chrome.tabs.executeScript(tab.id);
  }
});
