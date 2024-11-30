//panel.js: updates the data on the panel.html 

document.addEventListener("DOMContentLoaded", () => {
  
  // Function to update content in the panel
  const updateContent = (content) => {
    const contentContainer = document.getElementById("content");
    contentContainer.innerHTML = content;
  };

  // Fetch existing content on load
  chrome.storage.local.get("scrapedContent", (result) => {
    if (result.scrapedContent) {
      updateContent(result.scrapedContent);
    } else {
      console.error("No content found in storage.");
    }
  });

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.scrapedContent) {
      console.log("Storage updated:", changes.scrapedContent.newValue);
      updateContent(changes.scrapedContent.newValue);
    }
  });
});

  
