export function initializeProjects(projects) {
    // Display projects on page load
    displayProjects(projects, "all");

    // Filter button listeners
    window.filterProjects = function(category) {
        const buttons = document.querySelectorAll(".filter-btn");
        buttons.forEach((btn) => {
            const isActive =
                btn.innerText.toLowerCase() === category ||
                (category === "all" && btn.innerText === "All");
            btn.classList.toggle("active", isActive);
        });
        displayProjects(projects, category);
    };
}

function displayProjects(projects, filter = "all") {
    const projectGrid = document.getElementById("projectGrid");
    if (!projectGrid) return;

    projectGrid.innerHTML = "";

    projects.forEach((project, index) => {
        if (filter !== "all" && project.category !== filter) return;

        const card = document.createElement("div");
        card.className = "project-card";
        card.onclick = () => openModal(projects, index);
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
}

function openModal(projects, index) {
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
}

// Global modal functions
window.closeModal = function() {
    const modal = document.getElementById("projectModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

// Modal event listeners
window.addEventListener("click", (event) => {
    const modal = document.getElementById("projectModal");
    if (event.target === modal) {
        window.closeModal();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        window.closeModal();
    }
});