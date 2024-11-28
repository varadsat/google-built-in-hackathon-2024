chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fetchHtml" && message.url) {
      const url = message.url;
  
      // Fetch the HTML from the URL
      fetch(url)
        .then(response => response.text())
        .then(html => {
          sendResponse({ htmlBody: html });
        })
        .catch(error => {
          console.error("Fetch failed:", error);
          sendResponse({ error: "Failed to fetch the page content." });
        });
  
      // Return true to indicate async response
      return true;
    }
  });
  