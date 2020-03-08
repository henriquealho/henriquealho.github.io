/**
 * GLOBAL VARS
 */
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const quoteSecondInterval = 30;

/**
 * MAIN
 */
$(document).ready(function () {

  // Set a new random quote 
  /// each quote seconds interval
  setRandomQuote();
  setInterval(function () {
    setRandomQuote();
  }, quoteSecondInterval * 1000);

  /** 
   * Iterate each .displayDate element to set its innerHTML
   * with the elapsed time between dates as text from data attributes
  */
  var dates = document.querySelectorAll('.displayDate');
  dates.forEach(element => {

    // Get values from data attributes
    var dataStartDate = $(element).data("startDate");
    var dataEndDate = $(element).data("endDate");

    // Get Date objects
    var startDate = getDateFromString(dataStartDate);
    var endDate = new Date();
    if (dataEndDate !== null && dataEndDate !== undefined) {
      endDate = getDateFromString(dataEndDate);
    }

    // Update innerHTML value
    var elapsedTimeTxt = getElapsedTimeBetweenDatesAsText(startDate, endDate); // gets elapsed time
    var intervalTxt = monthNames[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' - '; // first part of interval
    $(element).append('<span>' + intervalTxt + '</span>');
    /// If dataEndDate is undefined, add [Present] text
    if (dataEndDate === undefined) {
      $(element).append('<span class="w3-tag w3-teal w3-round">Present</span>');
    }
    else {
      $(element).append('<span>' + monthNames[endDate.getMonth()] + ' ' + endDate.getFullYear() + '</span>');
    }
    $(element).append('<span> (' + elapsedTimeTxt + ')</span>');
  });
});

/**
 * Sets a random quote from Quotes API
 */
function setRandomQuote() {
  var apiUrl = "http://quotes.stormconsultancy.co.uk/random.json";
  var quoteEl = $('#quote');
  $.getJSON(apiUrl, function (quote) {
    quoteEl.hide();
    quoteEl.html(quote.quote + "<p>&mdash; " + quote.author + "</p>");
    quoteEl.fadeIn();
  });
}

/**
 * Returns a date object by given string for given format
 * TODO: Add more format options
 */
function getDateFromString(txtDate, format = 'yyyy/mm/dd') {

  switch (format) {
    case 'yyyy/mm/dd':
      txtDate = txtDate.split("/")
      return new Date(txtDate[0], txtDate[1] - 1, txtDate[2]);
      break;
    default:
      throw 'Invalid date format!';
  }
}

/**
 * Returns total years between two dates
 */
function getYearsBetweenDates(startDate, endDate) {
  return endDate.getUTCFullYear() - startDate.getUTCFullYear(); // Get years
}

/*
* Returns total months between two dates
*/
function getMonthsBetweenDates(startDate, endDate) {
  var months;
  months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  return (months <= 0 ? 0 : months);
}

/**
 * Returns elapsed time between dates as text
 * Example: '1 year and 2 months', '2 years and 1 month'
*/
function getElapsedTimeBetweenDatesAsText(startDate, endDate) {

  var months = Math.abs(getMonthsBetweenDates(startDate, endDate));
  var years = 1;
  if (months < 12) {
    return months + (months == 1 ? ' month' : ' months');
  }
  else {
    var years = Math.abs(getYearsBetweenDates(startDate, endDate));
    months = Math.abs(getMonthsBetweenDates(startDate, endDate) - (years * 12));

    var output = years + (years == 1 ? ' year' : ' years');
    output += months > 0 ? ' and ' + months + (months == 1 ? ' month' : ' months') : '';
    return output;
  }
}