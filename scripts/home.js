// Home page: rotating programming quote and GitHub profile info.
const QUOTE_SECOND_INTERVAL = 30;
const QUOTES_URL = "/resources/quotes.json";
const MAX_QUOTE_LENGTH = 140;
const MEDIUM_FEED_URL = "https://medium.com/feed/@henriquealho";
const MEDIUM_API_URL = "https://api.rss2json.com/v1/api.json";
const MEDIUM_CACHE_KEY = "medium-posts-cache-v2";
const MEDIUM_RETRY_KEY = "medium-posts-retry-after";
const MEDIUM_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MEDIUM_RETRY_DELAY_MS = 60 * 60 * 1000;
const QUOTES_PAGE_URL = "/quotes.html";

let quotesCache = null;
let mediumPostsCache = null;
let mediumPostsPromise = null;
let mediumPostIndex = 0;
let mediumRetryAfter = 0;

const loadQuotes = async () => {
  if (!quotesCache) {
    const response = await fetch(QUOTES_URL);
    if (!response.ok) throw new Error(`Failed to load quotes (${response.status})`);
    const data = await response.json();
    quotesCache = data.filter(
      (quote) =>
        typeof quote.en === "string" &&
        quote.en.trim().length > 0 &&
        quote.en.trim().length <= MAX_QUOTE_LENGTH,
    );
  }
  return quotesCache;
};

const getRandomQuote = async () => {
  const quotes = await loadQuotes();
  const { id, en: text, author } = quotes[Math.floor(Math.random() * quotes.length)];
  return { id, text, author };
};

const isValidMediumPosts = (posts) =>
  Array.isArray(posts) &&
  posts.length > 0 &&
  posts.every(
    (post) =>
      typeof post.title === "string" &&
      post.title.trim().length > 0 &&
      typeof post.url === "string" &&
      (post.excerpt === undefined || typeof post.excerpt === "string") &&
      (() => {
        try {
          return new URL(post.url).protocol === "https:";
        } catch {
          return false;
        }
      })(),
  );

const getMediumExcerpt = (content) => {
  if (typeof content !== "string" || !content.trim()) return "";

  const parsedContent = new DOMParser().parseFromString(content, "text/html");
  const paragraphs = Array.from(
    parsedContent.body.querySelectorAll("p, li, h1, h2, h3, blockquote"),
  )
    .map((element) => element.textContent.trim())
    .filter(Boolean);
  const text = (paragraphs.join(" ") || parsedContent.body.textContent)
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 180) return text;

  const excerpt = text.slice(0, 180);
  const lastSpace = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, lastSpace > 120 ? lastSpace : 180).trimEnd()}…`;
};

const readMediumCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(MEDIUM_CACHE_KEY));
    if (cached && isValidMediumPosts(cached.posts)) return cached;
  } catch (error) {
    console.warn("Could not read the cached Medium posts.", error);
  }
  return null;
};

const saveMediumCache = (posts) => {
  try {
    localStorage.setItem(
      MEDIUM_CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), posts }),
    );
    localStorage.removeItem(MEDIUM_RETRY_KEY);
  } catch (error) {
    console.warn("Could not cache the Medium posts.", error);
  }
};

const loadMediumPosts = async () => {
  if (!mediumPostsPromise) {
    mediumPostsPromise = fetchMediumPosts();
  }
  try {
    return await mediumPostsPromise;
  } finally {
    mediumPostsPromise = null;
  }
};

const fetchMediumPosts = async () => {
  if (mediumPostsCache) return mediumPostsCache;

  const cached = readMediumCache();
  if (cached && Date.now() - cached.fetchedAt < MEDIUM_CACHE_TTL_MS) {
    mediumPostsCache = cached.posts;
    return mediumPostsCache;
  }

  let storedRetryAfter = 0;
  try {
    storedRetryAfter = Number(localStorage.getItem(MEDIUM_RETRY_KEY));
  } catch (error) {
    console.warn("Could not read the Medium feed retry delay.", error);
  }
  mediumRetryAfter = Math.max(mediumRetryAfter, storedRetryAfter || 0);
  if (Date.now() < mediumRetryAfter) {
    if (cached) {
      mediumPostsCache = cached.posts;
      return mediumPostsCache;
    }
    throw new Error("Medium feed retry is delayed after a previous failure");
  }

  try {
    const params = new URLSearchParams({ rss_url: MEDIUM_FEED_URL });
    const response = await fetch(`${MEDIUM_API_URL}?${params}`);
    if (!response.ok) throw new Error(`Failed to load Medium posts (${response.status})`);

    const feed = await response.json();
    if (feed.status !== "ok" || !Array.isArray(feed.items)) {
      throw new Error(`Invalid Medium feed response (${feed.status || "unknown status"})`);
    }

    mediumPostsCache = feed.items
      .filter((post) => typeof post.title === "string" && typeof post.link === "string")
      .map((post) => ({
        title: post.title.trim(),
        url: post.link,
        excerpt: getMediumExcerpt(post.description || post.content),
      }))
      .filter((post) => {
        try {
          return post.title.length > 0 && new URL(post.url).protocol === "https:";
        } catch {
          return false;
        }
      });
    if (!isValidMediumPosts(mediumPostsCache)) {
      throw new Error("Medium RSS feed did not contain any valid posts");
    }
    saveMediumCache(mediumPostsCache);
    return mediumPostsCache;
  } catch (error) {
    mediumRetryAfter = Date.now() + MEDIUM_RETRY_DELAY_MS;
    try {
      localStorage.setItem(MEDIUM_RETRY_KEY, String(mediumRetryAfter));
    } catch (storageError) {
      console.warn("Could not save the Medium feed retry delay.", storageError);
    }

    if (cached) {
      mediumPostsCache = cached.posts;
      console.warn("Using cached Medium posts after the feed request failed.", error);
      return mediumPostsCache;
    }
    throw error;
  }
};

const updateFeature = (text, { href, label, italic, excerpt }) => {
  const quoteEl = document.getElementById("quote");
  const linkEl = document.getElementById("container-quote");
  const labelEl = document.getElementById("feature-label");
  if (!quoteEl || !linkEl || !labelEl) return;

  quoteEl.classList.remove("is-visible");
  quoteEl.classList.remove("is-loading");
  quoteEl.textContent = text;
  if (excerpt) {
    const excerptEl = document.createElement("span");
    excerptEl.className = "medium-excerpt";
    excerptEl.textContent = excerpt;
    quoteEl.appendChild(excerptEl);
  }
  linkEl.href = href;
  linkEl.classList.toggle("is-medium", !italic);
  labelEl.textContent = label;
  labelEl.hidden = !label;
  quoteEl.classList.toggle("font-italic", italic);
  linkEl.target = italic ? "_self" : "_blank";
  void quoteEl.offsetWidth;
  quoteEl.classList.add("is-visible");
};

const setQuote = async () => {
  try {
    const { id, text, author } = await getRandomQuote();
    const quoteEl = document.getElementById("quote");
    if (!quoteEl) return;

    quoteEl.classList.remove("is-visible");
    quoteEl.classList.remove("is-loading");
    quoteEl.textContent = text;
    const authorEl = document.createElement("span");
    authorEl.className = "quote-author";
    authorEl.textContent = `—${author}`;
    quoteEl.appendChild(authorEl);

    const linkEl = document.getElementById("container-quote");
    if (linkEl) {
      linkEl.href = `${QUOTES_PAGE_URL}?id=${encodeURIComponent(id)}`;
      linkEl.classList.remove("is-medium");
      linkEl.target = "_self";
    }
    const labelEl = document.getElementById("feature-label");
    if (labelEl) labelEl.hidden = true;
    quoteEl.classList.add("font-italic");
    void quoteEl.offsetWidth;
    quoteEl.classList.add("is-visible");
  } catch (error) {
    console.error(error);
    const quoteEl = document.getElementById("quote");
    if (!quoteEl) return;
    quoteEl.classList.remove("is-loading");
    quoteEl.textContent = "A little inspiration is unavailable right now.";
    quoteEl.classList.add("is-visible");
  }
};

const setMediumPost = async () => {
  if (Date.now() < mediumRetryAfter) return;

  try {
    const posts = await loadMediumPosts();
    const post = posts[mediumPostIndex];
    mediumPostIndex = (mediumPostIndex + 1) % posts.length;
    updateFeature(post.title, {
      href: post.url,
      label: "Latest on Medium",
      italic: false,
      excerpt: post.excerpt,
    });
  } catch (error) {
    console.warn("Could not load the latest Medium post; the quote remains visible.", error);
  }
};

// The static HTML already has the name and bio; only replace them when GitHub answers.
const setUserInfo = async () => {
  try {
    const response = await fetch("https://api.github.com/users/henriquealho");
    if (!response.ok) return;
    const { name } = await response.json();
    if (name) document.getElementById("name").textContent = name;
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setUserInfo();
  setQuote();
  let showMediumPost = true;
  setInterval(() => {
    if (document.hidden) return;
    if (showMediumPost) {
      setMediumPost();
    } else {
      setQuote();
    }
    showMediumPost = !showMediumPost;
  }, QUOTE_SECOND_INTERVAL * 1000);
});
