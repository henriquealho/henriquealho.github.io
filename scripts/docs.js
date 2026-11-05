// Docs page: render documents from resources/documents.json.
const getThumbnailUrl = (doc) => {
  const fileId = doc.entryUrl.match(/\/file\/d\/([^/]+)/)?.[1];
  return fileId
    ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w800`
    : doc.thumbUrl;
};

const renderDocument = (doc) => {
  const url = escapeHtml(doc.entryUrl);
  const title = escapeHtml(doc.entryTitle);
  const thumbnailUrl = escapeHtml(getThumbnailUrl(doc));
  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 shadow-sm document-card">
        <a href="${url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
          <div class="document-thumb-frame">
            <img src="${thumbnailUrl}" class="card-img-top document-thumb" alt="" loading="lazy">
            <div class="document-thumb-fallback" aria-hidden="true">
              <i class="fa fa-book" aria-hidden="true"></i>
              <span>${title}</span>
            </div>
          </div>
        </a>
        <div class="card-body d-flex flex-column">
          <h2 class="card-title h5">${title}</h2>
          <p class="card-text small text-muted mb-2">${escapeHtml(doc.author)}</p>
          <a href="${url}" class="btn btn-primary btn-sm mt-auto align-self-start" target="_blank" rel="noopener">
            Open document<span class="sr-only"> ${title} (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("documents-list");
  container?.addEventListener("error", (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.classList.contains("document-thumb")) return;
    image.hidden = true;
    image.closest(".document-thumb-frame")?.classList.add("is-unavailable");
  }, true);

  renderCardList({
    url: "/resources/documents.json",
    containerId: "documents-list",
    renderCard: renderDocument,
    emptyMessage: "No documents yet.",
  });
});
