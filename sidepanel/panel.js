//panel.js: updates the data on the panel.html 

let session;

async function initDefaults() {
  if (!('aiOriginTrial' in chrome)) {
    console.error('Error: chrome.aiOriginTrial not supported in this browser');
    return;
  }
  const defaults = await chrome.aiOriginTrial.languageModel.capabilities();
  console.log('Model default:', defaults);
  if (defaults.available !== 'readily') {
    console.log(
      `Model not yet available (current state: "${defaults.available}")`
    );
    return;
  }
}

async function runPrompt(prompt, params) {
  try {
    if (!session) {
      session = await chrome.aiOriginTrial.languageModel.create(params);
    }
    return session.prompt(prompt);
  } catch (e) {
    console.log('Prompt failed');
    console.error(e);
    console.log('Prompt:', prompt);
    // Reset session
    reset();
    throw e;
  }
}

async function reset() {
  if (session) {
    session.destroy();
  }
  session = null;
}

initDefaults();
  


document.addEventListener("DOMContentLoaded", () => {
  
  // Function to update content in the panel
  const updateContent = (content) => {
    const contentContainer = document.getElementById("content");
    contentContainer.innerHTML = content;
  };

  // Fetch existing content on load
  chrome.storage.local.get("scrapedContent",async (result) => {
    if (result.scrapedContent) {
      let response = '';
      try {
        const params = {
          systemPrompt: 'You are an assistant for analyzing product reviews on an e-commerce website.',
        };
        const prompt = `Fetch the customer name, rating and review description from each of the 
                        reviews given and give me only a markup file with all these details. 
                        Reviews: ${changes.scrapedContent.newValue}`;
        console.log(prompt);
        
        response = await runPrompt(prompt, params);
      } catch (e) {
        console.log("Prompt response could was not received." + e);
      }
      updateContent(response);
    } else {
      console.error("No content found in storage.");
    }
  });

  // Listen for storage changes
  chrome.storage.onChanged.addListener(async(changes, areaName) => {
    if (areaName === "local" && changes.scrapedContent) {
      console.log("Storage updated:", changes.scrapedContent.newValue);
      let response = '';
      try {
        const params = {
          systemPrompt: 'You are an assistant for analyzing product reviews on an e-commerce website.',
        };
        const prompt = `Fetch the customer name, rating and review description from each of the 
                        reviews given and give me only a markup file with all these details. 
                        Reviews: ${changes.scrapedContent.newValue}`;
        console.log(prompt);
        
        response = await runPrompt(prompt, params);
      } catch (e) {
        console.log("Prompt response could was not received." + e);
      }

      updateContent(response);
    }
  });
});


