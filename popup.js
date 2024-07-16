const colorOptions = document.querySelectorAll(".color-option");
const colorCode = document.querySelector(".color-code");
const rangeInput = document.querySelector(".range-input");
const rangeOutput = document.querySelector(".range-output");

colorOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const color = option.getAttribute("data-color");
    colorCode.value = color;
    updateColorPreview(color);
  });
});

rangeInput.addEventListener("input", () => {
  const percentage = rangeInput.value;
  rangeOutput.textContent = percentage + "%";

  // Store the range value in storage.local
  browser.storage.local.set({ rangePercentage: percentage });
});

function updateColorPreview(color) {
  document.querySelector(".color-preview").style.backgroundColor = color;
  colorCode.value = color;
}

