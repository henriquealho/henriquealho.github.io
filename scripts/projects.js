// Projects page: render projects from resources/projects.json, most recent first.
// Each project:
// {
//   name, description,
//   version?: SemVer string, e.g. "1.2.0" or "0.1.0-alpha",
//   status?: "finished" | "in-development" | "on-hold",
//   date?: "YYYY-MM-DD" (last update, used for ordering),
//   imageUrl?: featured image, tags?: [], repoUrl?, demoUrl?, featured?
// }
const PROJECT_STATUSES = {
  finished: { label: "Finished", icon: "fa-check" },
  "in-development": { label: "In development", icon: "fa-wrench" },
  "on-hold": { label: "On hold", icon: "fa-pause" },
};

const byMostRecent = (a, b) => (b.date || "").localeCompare(a.date || "");

const renderProjectCover = (project, name) => {
  const initial = escapeHtml((project.name || "?").trim().charAt(0).toUpperCase());
  const image = project.imageUrl
    ? `<img src="${escapeHtml(project.imageUrl)}" class="project-cover-img" alt="Screenshot of ${name}" loading="lazy" onerror="this.remove()">`
    : "";
  return `<div class="project-cover" aria-hidden="${project.imageUrl ? "false" : "true"}"><span class="project-cover-initial">${initial}</span>${image}</div>`;
};

const renderProjectMeta = (project) => {
  const status = PROJECT_STATUSES[project.status];
  const items = [
    project.version &&
      `<span class="project-version" title="Version">v${escapeHtml(project.version.replace(/^v/, ""))}</span>`,
    status &&
      `<span class="project-status project-status-${escapeHtml(project.status)}"><i class="fa ${status.icon}" aria-hidden="true"></i> ${status.label}</span>`,
  ].filter(Boolean);
  return items.length ? `<div class="project-meta">${items.join("")}</div>` : "";
};

const renderProject = (project) => {
  const name = escapeHtml(project.name);
  const tags = (project.tags || [])
    .map((tag) => `<li class="project-tag">${escapeHtml(tag)}</li>`)
    .join("");
  const links = [
    project.demoUrl &&
      `<a href="${escapeHtml(project.demoUrl)}" class="btn btn-primary" target="_blank" rel="noopener">
        <i class="fa fa-external-link" aria-hidden="true"></i> Live demo<span class="sr-only"> of ${name} (opens in a new tab)</span>
      </a>`,
    project.repoUrl &&
      `<a href="${escapeHtml(project.repoUrl)}" class="btn btn-outline-dark" target="_blank" rel="noopener">
        <i class="fa fa-github" aria-hidden="true"></i> Code<span class="sr-only"> of ${name} (opens in a new tab)</span>
      </a>`,
  ]
    .filter(Boolean)
    .join("");

  return `
    <div class="col-md-6 col-lg-4 mb-4">
      <article class="card h-100 shadow-sm document-card project-card${project.featured ? " is-featured" : ""}">
        ${renderProjectCover(project, name)}
        <div class="card-body d-flex flex-column">
          <h2 class="card-title h5">${name}</h2>
          ${renderProjectMeta(project)}
          ${project.description ? `<p class="card-text text-muted mb-3">${escapeHtml(project.description)}</p>` : ""}
          ${tags ? `<ul class="project-tags" aria-label="Technologies">${tags}</ul>` : ""}
          ${links ? `<div class="project-links mt-auto">${links}</div>` : ""}
        </div>
      </article>
    </div>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  renderCardList({
    url: "/resources/projects.json",
    containerId: "projects-list",
    renderCard: renderProject,
    sort: byMostRecent,
    emptyMessage: "No projects yet.",
  });
});
