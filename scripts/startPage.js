loadingContainer.style.display = "none";
const showText = document.getElementById("showInstructions");

function showInstructions() {
  if (showText.style.display === "block") {
    showText.style.display = "none";
  } else {
    showText.style.display = "block";
  }
}
