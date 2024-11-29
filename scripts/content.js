

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

  const url = href;

  // Fetch the HTML from the URL
  fetch(url)
    .then(response => response.text())
    .then(async (html) => {

      const cleanHtml = DOMPurify
        .sanitize(html, {
          ALLOWED_ATTR: [],
          ALLOWED_TAGS: [
            "p",
            "h1",
            "h2",
            "h3",
            "blockquote",
            "li",
            "div",
            "article",
          ],
          FORBID_ATTR: ["data-*"]
        });
      const parser = new DOMParser();
      // Parse the HTML string into a Document object
      const doc = parser.parseFromString(cleanHtml, "text/html");
      // Extract the body content
      // const bodyContent = doc.body;

      console.log("HTML Body of the page:", doc);

      // const normalizedContent = cleanContent.replace(/\s+/g, " ");
      // console.log("HTML Body of the page:", cleanContent);

      // Helper function to remove empty elements
      function removeEmptyElements(root) {
        const elements = root.querySelectorAll("*:empty");
        elements.forEach((el) => el.remove());
      }
      // Remove empty tags
      removeEmptyElements(doc);

      // Optionally flatten overly nested structures
      function flattenNestedDivs(root) {
        const divs = root.querySelectorAll("div");
        divs.forEach((div) => {
          if (div.children.length === 1 && div.firstElementChild.tagName === "DIV") {
            // Replace the div with its child
            div.replaceWith(...div.childNodes);
          }
        });
      }

      // Flatten nested divs
      flattenNestedDivs(doc);

      const flattenedHtml = doc.body.innerHTML;
      const normalizedContent = flattenedHtml.replace(/\s+/g, " ");


      console.log("supercleaned HTML Body of the page:", normalizedContent);


    })
    .catch(error => {
      console.error("Fetch failed:", error);
      // sendResponse({ error: "Failed to fetch the page content." });
    });

} else {
  console.error("Element not found with the given selector.");
}
