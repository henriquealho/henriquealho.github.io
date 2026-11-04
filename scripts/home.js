// Home page: rotating programming quote and GitHub profile info.
const QUOTE_SECOND_INTERVAL = 30;
const QUOTES_URL = "/resources/quotes.json";
const QUOTES_APP_URL = "https://henriquealho.github.io/Programming-Quotes/";

let quotesCache = null;

const loadQuotes = async () => {
  if (!quotesCache) {
    const response = await fetch(QUOTES_URL);
    if (!response.ok) throw new Error(`Failed to load quotes (${response.status})`);
    quotesCache = await response.json();
  }
  return quotesCache;
};

const getRandomQuote = async () => {
  const quotes = await loadQuotes();
  const { id, en: text, author } = quotes[Math.floor(Math.random() * quotes.length)];
  return { id, text, author };
};

const setQuote = async () => {
  const quoteEl = document.getElementById("quote");
  const linkEl = document.getElementById("container-quote");
  if (!quoteEl || !linkEl) return;

  try {
    const { id, text, author } = await getRandomQuote();
    quoteEl.classList.remove("is-visible");
    quoteEl.textContent = text;
    const authorEl = document.createElement("span");
    authorEl.className = "quote-author";
    authorEl.textContent = `—${author}`;
    quoteEl.appendChild(authorEl);
    linkEl.href = `${QUOTES_APP_URL}?id=${encodeURIComponent(id)}`;
    // Force a reflow so the fade-in transition runs again.
    void quoteEl.offsetWidth;
    quoteEl.classList.add("is-visible");
  } catch (error) {
    console.error(error);
  }
};

// The static HTML already has the name and bio; only replace them when GitHub answers.
const setUserInfo = async () => {
  try {
    const response = await fetch("https://api.github.com/users/henriquealho");
    if (!response.ok) return;
    const { name, bio } = await response.json();
    if (name) document.getElementById("name").textContent = name;
    if (bio) document.getElementById("bio").textContent = bio;
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setUserInfo();
  setQuote();
  setInterval(() => {
    if (!document.hidden) setQuote();
  }, QUOTE_SECOND_INTERVAL * 1000);
});
