// Shared helpers for pages that render a list of cards from a JSON file.
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const renderCardList = async ({ url, containerId, renderCard, sort, filter, emptyMessage }) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url} (${response.status})`);
    let items = await response.json();
    if (filter) items = items.filter(filter);
    if (sort) items.sort(sort);
    container.innerHTML = items.length
      ? `<div class="row">${items.map(renderCard).join("")}</div>`
      : `<p class="text-white">${escapeHtml(emptyMessage)}</p>`;
  } catch (error) {
    console.error(error);
    container.innerHTML =
      '<p class="text-white">Could not load this list right now. Please try again later.</p>';
  } finally {
    container.setAttribute("aria-busy", "false");
  }
};
