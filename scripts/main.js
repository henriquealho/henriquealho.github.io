const QUOTE_SECOND_INTERVAL = 30;
const ENDPOINT = "https://henriquealho.github.io/resources/quotes.json";

const getRandomQuote = async () => {
  const response = await fetch(ENDPOINT);
  const json = await response.json();
  const randomIndex = Math.floor(Math.random() * (json.length + 1));
  const quote = json[randomIndex];
  const { id, en: text, author } = quote;
  return { id, text, author };
};

const setQuote = async () => {
  const quote = await getRandomQuote();
  const { id, text, author } = quote;
  $("#quote").hide().html(`${text}<p>&mdash;${author}</p>`).fadeIn();
  $('#container-quote').attr('href', `https://henriquealho.github.io/Programming-Quotes?id=${id}`);
};

$(document).ready(() => {
  // Set a new random quote
  /// each quote seconds interval
  setQuote();
  setInterval(() => {
    setQuote();
  }, QUOTE_SECOND_INTERVAL * 1000);
});
