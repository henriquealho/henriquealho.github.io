const QUOTES_URL = "/resources/quotes.json";
const MAX_QUOTE_LENGTH = 140;
const quoteTextEl = document.getElementById("quote-text");
const quoteAuthorEl = document.getElementById("quote-author");
const quoteCounterEl = document.getElementById("quote-counter");
const quoteFeedbackEl = document.getElementById("quote-feedback");
const previousButton = document.getElementById("previous-quote");
const nextButton = document.getElementById("next-quote");
const randomButton = document.getElementById("random-quote");
const copyButton = document.getElementById("copy-quote");

let quotes = [];
let currentIndex = 0;
let feedbackTimeout;

const fitQuoteText = () => {
  quoteTextEl.style.removeProperty("font-size");
  let fontSize = Number.parseFloat(getComputedStyle(quoteTextEl).fontSize);
  const minFontSize = 10.5;

  quoteTextEl.style.fontSize = `${fontSize}px`;
  while (quoteTextEl.scrollHeight > quoteTextEl.clientHeight && fontSize > minFontSize) {
    fontSize = Math.max(minFontSize, fontSize - 0.5);
    quoteTextEl.style.fontSize = `${fontSize}px`;
  }
};

const updateQuoteUrl = (quote) => {
  const url = new URL(window.location.href);
  url.searchParams.set("id", quote.id);
  window.history.replaceState(null, "", url);
};

const renderQuote = (index, updateUrl = true) => {
  const quote = quotes[index];
  if (!quote) return;

  currentIndex = index;
  quoteTextEl.classList.remove("is-visible");
  quoteTextEl.classList.remove("is-loading");
  quoteTextEl.textContent = quote.en;
  quoteAuthorEl.textContent = quote.author ? `— ${quote.author}` : "";
  quoteCounterEl.textContent = `${index + 1} / ${quotes.length}`;
  previousButton.hidden = index === 0;
  nextButton.disabled = false;
  randomButton.disabled = false;
  copyButton.disabled = false;
  fitQuoteText();
  clearFeedback();
  if (updateUrl) updateQuoteUrl(quote);

  void quoteTextEl.offsetWidth;
  quoteTextEl.classList.add("is-visible");
};

const clearFeedback = () => {
  clearTimeout(feedbackTimeout);
  quoteFeedbackEl.textContent = "";
  quoteFeedbackEl.classList.remove("is-error");
};

const showFeedback = (message, isError = false) => {
  clearFeedback();
  quoteFeedbackEl.textContent = message;
  quoteFeedbackEl.classList.toggle("is-error", isError);
  feedbackTimeout = setTimeout(clearFeedback, 2500);
};

const selectRandomQuote = () => {
  if (quotes.length === 0) return;
  const index = Math.floor(Math.random() * quotes.length);
  renderQuote(index);
};

const loadQuotes = async () => {
  try {
    const response = await fetch(QUOTES_URL);
    if (!response.ok) throw new Error(`Failed to load quotes (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("The quotes file did not contain any quotes");
    }

    quotes = data.filter(
      (quote) =>
        typeof quote.id === "string" &&
        typeof quote.en === "string" &&
        quote.en.trim().length > 0 &&
        quote.en.trim().length <= MAX_QUOTE_LENGTH,
    );
    if (quotes.length === 0) throw new Error("No valid quotes were found");

    const quoteId = new URLSearchParams(window.location.search).get("id");
    const selectedIndex = quotes.findIndex((quote) => quote.id === quoteId);
    if (selectedIndex >= 0) {
      renderQuote(selectedIndex, false);
    } else {
      selectRandomQuote();
    }
  } catch (error) {
    console.error(error);
    quoteTextEl.textContent = "Quotes could not be loaded. Please try again later.";
    quoteAuthorEl.textContent = "";
    quoteCounterEl.textContent = "";
    quoteTextEl.classList.remove("is-loading");
    fitQuoteText();
    quoteTextEl.classList.add("is-visible");
    nextButton.disabled = true;
    randomButton.disabled = true;
  } finally {
    quoteTextEl.closest(".quotes-card")?.setAttribute("aria-busy", "false");
  }
};

window.addEventListener("resize", fitQuoteText);

previousButton.addEventListener("click", () => {
  if (currentIndex > 0) renderQuote(currentIndex - 1);
});

nextButton.addEventListener("click", () => {
  if (quotes.length > 0) renderQuote((currentIndex + 1) % quotes.length);
});

randomButton.addEventListener("click", selectRandomQuote);

copyButton.addEventListener("click", async () => {
  const quote = quotes[currentIndex];
  if (!quote) return;

  try {
    if (!navigator.clipboard) throw new Error("Clipboard access is unavailable");
    await navigator.clipboard.writeText(`"${quote.en}"\n-- ${quote.author}`);
    showFeedback("Copied to clipboard.");
  } catch (error) {
    console.error(error);
    showFeedback("Could not copy this quote.", true);
  }
});

loadQuotes();
