chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "changeText",
    title: "Reduce This",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "changeText") {
    // Get the stored range value
    browser.storage.local.get("rangePercentage").then((result) => {
      const rangePercentage = result.rangePercentage || 50; // Default to 50% if not set
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: changeSelectedText,
        args: [rangePercentage], // Pass the range percentage as an argument
      });
    });
  }
});

async function changeSelectedText(rangePercentage) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  //console.log(rangePercentage);
  const reducePercentage = 50 + rangePercentage * 0.5;
  //console.log(reducePercentage);
  const textInput = selection.toString();
  //console.log(textInput.split(" ").length);
  const wordsReduce =
    (1 - reducePercentage / 100) * textInput.split(" ").length;

  try {
    const response = await fetch(
      "https://us-central1-reducetext-429111.cloudfunctions.net/ReduceThis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
          wordCount: wordsReduce,
        }),
      }
    );

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
