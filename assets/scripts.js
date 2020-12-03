const QUOTE_SECOND_INTERVAL = 30;
$(document).ready(function () {
    // Set a new random quote 
    /// each quote seconds interval
    setQuote();
    setInterval(function () {
        setQuote();
    }, QUOTE_SECOND_INTERVAL * 1000);

    /**
     * Sets a random quote from Quotes API
     */
    function setRandomQuote() {
        var apiUrl = "https://programming-quotes-api.herokuapp.com/quotes/random";
        var quoteEl = $('#quote');
        $.getJSON(apiUrl, function (quote) {
            quoteEl.hide();
            quoteEl.html(quote.en + "<p>&mdash; " + quote.author + "</p>");
            quoteEl.fadeIn();
        });
    }

    /**
     *  Set Quote
     */ 
    async function setQuote() {
        var quote = await getRandomQuote();
        var quoteEl = $('#quote');
        quoteEl.hide();
        quoteEl.html(quote.text + "<p>&mdash; " + quote.author + "</p>");
        quoteEl.fadeIn();
    }

    async function getRandomQuote() {
        const url =
          "https://raw.githubusercontent.com/skolakoda/programming-quotes-api/master/backup/quotes.json";
        let response = await fetch(url);
        let json = await response.json();
      
        json = json[Math.floor(Math.random() * (json.length + 1))];
      
        return {
          text: json["en"],
          author: json["author"]
        };
      }
});