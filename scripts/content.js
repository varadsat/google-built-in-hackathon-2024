console.log("Content script loaded");

// Select the element and safely get the href attribute
const element = document.querySelector('.a-link-emphasis.a-text-bold');
if (element) {
  
  let href = element.getAttribute('href');

  if (href && !href.startsWith('http')) {
    // Prepend the domain (origin) to make it an absolute URL
    href = window.location.origin + href;
  }
  console.log("href is ", href);
  
  // Send the href to the background script
  chrome.runtime.sendMessage({ action: "fetchHtml", url: href }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Runtime error:", chrome.runtime.lastError.message);
    } else if (response.error) {
      console.error("Error from background:", response.error);
    } else {
      console.log("HTML Body of the page:", response.htmlBody);
    }
  });
} else {
  console.error("Element not found with the given selector.");
}
