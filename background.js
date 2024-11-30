//background.js: receives the scrapped data from content.js and stores it to chrome local storage

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "scrapedData") {
      console.log("Received data from content script:", message.data);
  
      // Save the scraped data to `chrome.storage.local`
      chrome.storage.local.set({ scrapedContent: message.data }, () => {
        console.log("Data saved to storage.");
      });
    }
  });
  