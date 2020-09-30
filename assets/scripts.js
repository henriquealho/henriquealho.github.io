const QUOTE_SECOND_INTERVAL = 30;
$(document).ready(function () {
    // Set a new random quote 
    /// each quote seconds interval
    setRandomQuote();
    setInterval(function () {
        setRandomQuote();
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
});