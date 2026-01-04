import { projects, data } from "./Projects.js";

// ============ Constants ============
const NAV_HEIGHT = 80;
const OBSERVER_OPTIONS = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
};

// ============ Project Display & Filtering ============
/** Display projects filtered by category */
window.displayProjects = function(filter = "all") {
    const projectGrid = document.getElementById("projectGrid");
    if (!projectGrid) return;

    projectGrid.innerHTML = "";

    projects.forEach((project, index) => {
        if (filter !== "all" && project.category !== filter) return;

        const card = document.createElement("div");
        card.className = "project-card";
        card.onclick = () => openModal(index);
        card.innerHTML = `
      <div class="project-image" style="background-image: url('${project.image}');"></div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <span class="status-badge ${project.status}">
          ${project.status === "completed" ? "✓ Completed" : "⏳ In Progress"}
        </span>
      </div>
    `;
        projectGrid.appendChild(card);
    });
};

/** Filter projects and update button states */
window.filterProjects = function(category) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach((btn) => {
        const isActive = btn.innerText.toLowerCase() === category ||
            (category === "all" && btn.innerText === "All");
        btn.classList.toggle("active", isActive);
    });
    displayProjects(category);
};

// ============ Modal Functions ============
/** Open project modal with details */
window.openModal = function(index) {
    const project = projects[index];
    const modal = document.getElementById("projectModal");
    const modalImage = document.getElementById("modalImage");
    const modalDetails = document.getElementById("modalDetails");

    if (!modal || !modalImage || !modalDetails) return;

    modalImage.style.backgroundImage = `url('${project.image}')`;

    let detailsHTML = `
    <h2>${project.title}</h2>
    <span class="status-badge ${project.status}">
      ${project.status === "completed" ? "✓ Completed" : "⏳ In Progress"}
    </span>
    <p style="margin-top: 1.5rem;">${project.imageDescription}</p>
    <div class="details-grid">
  `;

    project.details.forEach((detail) => {
        detailsHTML += `
      <div class="detail-item">
        <div class="detail-label">${detail.label}</div>
        <div class="detail-value">${detail.value}</div>
      </div>
    `;
    });

    detailsHTML += `</div>`;
    modalDetails.innerHTML = detailsHTML;

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
};

/** Close project modal */
window.closeModal = function() {
    const modal = document.getElementById("projectModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

// ============ Modal Event Listeners ============
window.addEventListener("click", (event) => {
    const modal = document.getElementById("projectModal");
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

// ============ Team & Testimonials Rendering ============
/** Render team member cards */
function renderTeamCards() {
    const teamGrid = document.getElementById("teamGrid");
    if (!teamGrid) {
        console.error("teamGrid element not found");
        return;
    }

    teamGrid.innerHTML = data.team
        .map((member) => `
      <div class="team-card">
        <div class="team-avatar">${member.avatar}</div>
        <h3>${member.name}</h3>
        <div class="team-role">${member.role}</div>
        <p>${member.description}</p>
        <div class="team-specialties">
          ${member.specialties.map((s) => `<span class="specialty-tag">${s}</span>`).join("")}
        </div>
      </div>
    `)
    .join("");
}

/** Render testimonial cards */
function renderTestimonials() {
  const testimonialsGrid = document.getElementById("testimonialsGrid");
  if (!testimonialsGrid) {
    console.error("testimonialsGrid element not found");
    return;
  }

  testimonialsGrid.innerHTML = data.testimonials
    .map((testimonial) => `
      <div class="testimonial-card">
        <div class="stars">${"★".repeat(testimonial.rating)}</div>
        <p class="testimonial-text">"${testimonial.text}"</p>
        <div class="testimonial-author">
          <div class="author-avatar">${testimonial.avatar}</div>
          <div class="author-info">
            <h4>${testimonial.author}</h4>
            <p>${testimonial.role}</p>
          </div>
        </div>
        ${testimonial.verified ? '<span class="verified-badge">✓ Verified Review</span>' : ""}
      </div>
    `)
    .join("");
}

// ============ Smooth Scroll Function ============
/** Smooth scroll to element by ID */
window.smoothScroll = function(e, targetId) {
  const element = document.getElementById(targetId);

  if (!element && (targetId === "about" || targetId === "home")) {
    window.location.href = `index.html#${targetId}`;
    return;
  }

  if (element) {
    e.preventDefault();
    const targetPosition = element.offsetTop - NAV_HEIGHT;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    history.pushState(null, null, `#${targetId}`);
  }
};

// ============ Hamburger Menu Toggle ============
function initializeMenuToggle() {
  const nav = document.getElementById("navbar");
  const menuToggle = document.querySelector(".menu-toggle");

  if (!nav || !menuToggle) return;

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    const expanded = nav.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", expanded);
    document.body.classList.toggle("no-scroll", expanded);
  });

  nav.querySelectorAll("ul a").forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      }
    });
  });
}

// ============ FAQ Toggle ============
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((question) => {
    question.addEventListener("click", function() {
      this.parentElement.classList.toggle("active");
    });
  });
}

// ============ Scroll Animation Observer ============
function initializeScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.8s ease forwards";
      }
    });
  }, OBSERVER_OPTIONS);

  document.querySelectorAll(".project-card").forEach((card) => {
    observer.observe(card);
  });
}

// ============ Dynamic Year ============
function updateDynamicYear() {
  const nowElement = document.getElementById("now");
  if (nowElement) {
    nowElement.textContent = `© ${new Date().getFullYear()} Professional House Painting. All rights reserved.`;
  }
}

// ============ Initialization ============
document.addEventListener("DOMContentLoaded", function() {
  renderTeamCards();
  renderTestimonials();
  initializeFAQ();
  initializeMenuToggle();
  initializeScrollAnimations();
  updateDynamicYear();
  displayProjects("all");
});

// =========================
// THEME TOGGLER
// =========================
const toggleBtn = document.getElementById("themeToggle");
const root = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
    if (toggleBtn) toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

// Add event listener properly
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        const isDark = root.getAttribute("data-theme") === "dark";
        const newTheme = isDark ? "light" : "dark";

        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
}