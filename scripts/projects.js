// Projects page: render projects from resources/projects.json, most recent first.
// Each project can provide a name, description, version, images, date, repoUrl, demoUrl, featured, and isVisible.
// isVisible can be true or an ISO date/datetime string from which the project is visible.

const byMostRecent = (a, b) => (b.date || "").localeCompare(a.date || "");

const getProjectImages = (project) => project.images || (project.imageUrl ? [project.imageUrl] : []);

const isProjectVisible = (project) => {
  if (project.isVisible === true) return true;
  if (typeof project.isVisible !== "string") return false;

  const visibleFrom = Date.parse(project.isVisible);
  return !Number.isNaN(visibleFrom) && Date.now() >= visibleFrom;
};

const renderProjectGallery = (project, name) => {
  const images = getProjectImages(project);
  if (!images.length) return "";

  const galleryId = `project-gallery-${escapeHtml(project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`;
  const imageList = escapeHtml(JSON.stringify(images.map((src, index) => ({
    src,
    alt: `${project.name} screenshot ${index + 1}`,
  }))));
  const thumbnails = images.map((src, index) => `
    <button
      class="project-gallery-thumb${index === 0 ? " is-active" : ""}"
      type="button"
      data-gallery-target="${galleryId}"
      data-image-src="${escapeHtml(src)}"
      data-image-alt="${name} screenshot ${index + 1}"
      data-image-index="${index}"
      aria-label="Show image ${index + 1} of ${images.length} for ${name}"
      aria-pressed="${index === 0}"
    >
      <img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async">
    </button>
  `).join("");

  return `
    <div class="project-gallery" id="${galleryId}">
      <button
        class="project-gallery-main"
        type="button"
        data-gallery-target="${galleryId}"
        data-image-list="${imageList}"
        aria-label="Open ${name} image gallery"
      >
        <img src="${escapeHtml(images[0])}" alt="${name} screenshot 1" loading="lazy" decoding="async">
      </button>
      ${images.length > 1 ? `<div class="project-gallery-thumbnails" role="group" aria-label="${name} screenshots">${thumbnails}</div>` : ""}
    </div>
  `;
};

const renderProjectMeta = (project) => {
  return project.version
    ? `<div class="project-meta"><span class="project-version">${escapeHtml(project.version)}</span></div>`
    : "";
};

const renderProject = (project) => {
  const name = escapeHtml(project.name);
  const links = [
    project.demoUrl &&
      `<a href="${escapeHtml(project.demoUrl)}" class="project-link" target="_blank" rel="noopener">
        ${escapeHtml(new URL(project.demoUrl).hostname)}<span class="sr-only"> — ${name} (opens in a new tab)</span>
      </a>`,
    project.repoUrl &&
      `<a href="${escapeHtml(project.repoUrl)}" class="project-link project-link-code" target="_blank" rel="noopener">
        <i class="fa fa-github" aria-hidden="true"></i> Source code<span class="sr-only"> for ${name} (opens in a new tab)</span>
      </a>`,
  ].filter(Boolean).join("");

  return `
    <div class="col-12 mb-4">
      <article class="card h-100 project-card${project.featured ? " is-featured" : ""}">
        ${renderProjectGallery(project, name)}
        <div class="card-body d-flex flex-column">
          <div class="project-heading">
            <h2 class="card-title">${name}</h2>
            ${renderProjectMeta(project)}
          </div>
          ${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ""}
          ${links ? `<div class="project-links mt-auto">${links}</div>` : ""}
        </div>
      </article>
    </div>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  const imageDialog = document.getElementById("project-image-dialog");
  const dialogImage = imageDialog.querySelector(".project-image-dialog-image");
  const dialogCounter = imageDialog.querySelector(".project-image-dialog-counter");
  const previousButton = imageDialog.querySelector(".project-image-dialog-previous");
  const nextButton = imageDialog.querySelector(".project-image-dialog-next");
  let activeImages = [];
  let activeIndex = 0;
  let activeGallery = null;
  let returnFocusTo = null;

  const showDialogImage = () => {
    const image = activeImages[activeIndex];
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogCounter.textContent = `${activeIndex + 1} / ${activeImages.length}`;
    const mainImage = activeGallery.querySelector(".project-gallery-main img");
    mainImage.src = image.src;
    mainImage.alt = image.alt;
    activeGallery.querySelectorAll(".project-gallery-thumb").forEach((thumbnail) => {
      const active = Number(thumbnail.dataset.imageIndex) === activeIndex;
      thumbnail.classList.toggle("is-active", active);
      thumbnail.setAttribute("aria-pressed", String(active));
    });
    const multipleImages = activeImages.length > 1;
    previousButton.hidden = !multipleImages;
    nextButton.hidden = !multipleImages;
  };

  const openImageDialog = (triggerButton, gallery, index) => {
    activeGallery = gallery;
    activeImages = JSON.parse(gallery.querySelector(".project-gallery-main").dataset.imageList);
    activeIndex = index;
    returnFocusTo = triggerButton;
    triggerButton.focus();
    showDialogImage();
    imageDialog.showModal();
  };

  const moveDialogImage = (offset) => {
    activeIndex = (activeIndex + offset + activeImages.length) % activeImages.length;
    showDialogImage();
  };

  renderCardList({
    url: "/resources/projects.json",
    containerId: "projects-list",
    renderCard: renderProject,
    sort: byMostRecent,
    filter: isProjectVisible,
    emptyMessage: "No projects yet.",
  });

  document.getElementById("projects-list").addEventListener("click", (event) => {
    const button = event.target.closest(".project-gallery-thumb, .project-gallery-main");
    if (!button) return;

    const gallery = document.getElementById(button.dataset.galleryTarget);
    const image = gallery.querySelector(".project-gallery-main img");
    let imageIndex = 0;

    if (button.classList.contains("project-gallery-thumb")) {
      imageIndex = Number(button.dataset.imageIndex);
      image.src = button.dataset.imageSrc;
      image.alt = button.dataset.imageAlt;

      gallery.querySelectorAll(".project-gallery-thumb").forEach((thumbnail) => {
        const active = thumbnail === button;
        thumbnail.classList.toggle("is-active", active);
        thumbnail.setAttribute("aria-pressed", String(active));
      });
    } else {
      imageIndex = gallery.querySelector(".project-gallery-thumb.is-active")
        ? Number(gallery.querySelector(".project-gallery-thumb.is-active").dataset.imageIndex)
        : 0;
    }

    openImageDialog(button, gallery, imageIndex);
  });

  previousButton.addEventListener("click", () => moveDialogImage(-1));
  nextButton.addEventListener("click", () => moveDialogImage(1));
  imageDialog.querySelector(".project-image-dialog-close").addEventListener("click", () => {
    imageDialog.close();
  });
  imageDialog.addEventListener("click", (event) => {
    if (event.target === imageDialog) imageDialog.close();
  });
  imageDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      imageDialog.close();
    } else if (activeImages.length > 1 && event.key === "ArrowLeft") {
      moveDialogImage(-1);
    } else if (activeImages.length > 1 && event.key === "ArrowRight") {
      moveDialogImage(1);
    }
  });
  imageDialog.addEventListener("close", () => {
    returnFocusTo?.focus();
    returnFocusTo = null;
  });
});
