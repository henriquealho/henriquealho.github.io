const QUOTE_SECOND_INTERVAL = 30;
const ENDPOINT = "https://henriquealho.github.io/resources/quotes.json";

const getRandomQuote = async () => {
  const response = await fetch(ENDPOINT);
  const json = await response.json();
  const randomIndex = Math.floor(Math.random() * (json.length + 1));
  const quote = json[randomIndex];
  const { en: text, author } = quote;
  return { text, author };
};

const setQuote = async () => {
  const quote = await getRandomQuote();
  const { text, author } = quote;
  $("#quote").hide().html(`${text}<p>&mdash;${author}</p>`).fadeIn();
};

$(document).ready(() => {
  // Set a new random quote
  /// each quote seconds interval
  setQuote();
  setInterval(() => {
    setQuote();
  }, QUOTE_SECOND_INTERVAL * 1000);
});
