// Dynamically load and display documents from documents.json
async function loadDocuments() {
  const response = await fetch('resources/documents.json');
  const docs = await response.json();
  const container = document.getElementById('documents-list');
  if (!container) return;
  let html = '<div class="row">';
  docs.forEach(doc => {
    html += `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm document-card">
          <a href="${doc.entryUrl}" target="_blank" rel="noopener">
            <img src="${doc.thumbUrl}" class="card-img-top document-thumb" alt="${doc.entryTitle}">
          </a>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${doc.entryTitle}</h5>
            <p class="card-text small text-muted mb-2">${doc.author}</p>
            <a href="${doc.entryUrl}" class="btn btn-primary mt-auto" target="_blank" rel="noopener">View Document</a>
          </div>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  loadDocuments();
});
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
