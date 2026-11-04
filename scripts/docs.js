// Docs page: render documents from resources/documents.json.
const renderDocument = (doc) => {
  const url = escapeHtml(doc.entryUrl);
  const title = escapeHtml(doc.entryTitle);
  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm document-card">
        <a href="${url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
          <img src="${escapeHtml(doc.thumbUrl)}" class="card-img-top document-thumb" alt="" loading="lazy">
        </a>
        <div class="card-body d-flex flex-column">
          <h2 class="card-title h5">${title}</h2>
          <p class="card-text small text-muted mb-2">${escapeHtml(doc.author)}</p>
          <a href="${url}" class="btn btn-primary mt-auto" target="_blank" rel="noopener">
            View Document<span class="sr-only"> ${title} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  renderCardList({
    url: "/resources/documents.json",
    containerId: "documents-list",
    renderCard: renderDocument,
    emptyMessage: "No documents yet.",
  });
});
