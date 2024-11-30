// content.js scrapes out the data from a particular page

console.log("Content script loaded");

// Scrape data
function scrapeData() {
  const element = document.querySelector('.a-link-emphasis.a-text-bold');
  if (element) {
    let href = element.getAttribute('href');
    if (href && !href.startsWith('http')) {
      href = window.location.origin + href;
    }
    console.log("href is ", href);

    fetch(href)
      .then(response => response.text())
      .then(async (html) => {
        const cleanHtml = DOMPurify.sanitize(html, {
          ALLOWED_ATTR: [],
          ALLOWED_TAGS: ["p", "h1", "h2", "h3", "blockquote", "li", "div", "article"],
          FORBID_ATTR: ["data-*"]
        });
        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanHtml, "text/html");

        // Remove empty elements
        [...doc.querySelectorAll("*:empty")].forEach(el => el.remove());

        const flattenedHtml = doc.body.innerHTML.replace(/\s+/g, " ");
        console.log("Supercleaned HTML Body of the page:", flattenedHtml);

        // Send the scraped data to the background script
        chrome.runtime.sendMessage({ action: "scrapedData", data: flattenedHtml });
      })
      .catch(error => console.error("Fetch failed:", error));
  } else {
    console.error("Element not found with the given selector.");
  }
}

// Run scraping on page load
scrapeData();

// Detect navigation changes in single-page applications
let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log("URL changed, re-scraping data...");
    scrapeData();
  }
});
observer.observe(document, { childList: true, subtree: true });
