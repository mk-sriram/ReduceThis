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

  // Get the stored percentage value
  const rangeInput = document.querySelector(".range-input");
  const percentage = rangeInput ? rangeInput.value : 50; // Default to 50% if not set
  const reducePercentage = 50 + percentage * 0.5;

  const textInput = selection.toString();
  const wordsReduce = (1 - reducePercentage / 100) * textInput.length;

  try {
    const response = await fetch("https://localhost:3000/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: textInput,
        wordCount: wordsReduce,
      }),
    });

    const result = await response.json();
    const range = selection.getRangeAt(0);
    range.deleteContents();

    // Create a <span> element to wrap the text and style it
    const newNode = document.createElement("span");
    newNode.style.color = "red"; // Set text color to red
    newNode.textContent = result.result; // Set the text content

    range.insertNode(newNode);
  } catch (error) {
    console.error("Client Error:", error);
  }
}
