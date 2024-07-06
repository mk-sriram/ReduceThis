chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "changeText",
    title: "Reduce Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "changeText") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: changeSelectedText,
    });
  }
});

async function changeSelectedText() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  try {
    console.log("client ran functions");
    const response = await fetch("http://localhost:3000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: selection.toString() }),
    });

    const data = await response.json();
    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Create a <span> element to wrap the text and style it
    const newNode = document.createElement("span");
    newNode.style.color = "red"; // Set text color to red
    newNode.textContent = data.result; // Set the text content

    range.insertNode(newNode);
    //console.log("client success:", );
  } catch (error) {
    console.error("client Error:", error);
  }
}
