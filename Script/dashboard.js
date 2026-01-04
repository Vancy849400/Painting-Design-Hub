import { initializeAuth } from "./modules/auth.js";
import { initializeThemeToggler } from "./modules/themeToggler.js";

// ============ INITIALIZATION ============

document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        // Redirect to home if not logged in
        window.location.href = "index.html";
        return;
    }

    // Initialize modules
    initializeAuth();
    initializeThemeToggler();
    initializeDashboard();
    updateDynamicYear();
});

// ============ DASHBOARD INITIALIZATION ============

function initializeDashboard() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Populate user data
    displayUserData(currentUser);
    loadUserProjects();
    loadUserQuotes();
    loadDashboardStats();

    // Set up event listeners
    setupDashboardListeners();
}

// ============ DISPLAY USER DATA ============

function displayUserData(userData) {
    // Dashboard header
    document.getElementById("dashboardUserName").textContent = userData.fullName;

    // Profile section
    document.getElementById("profileAvatarLarge").textContent = userData.avatar;
    document.getElementById("profileFullName").textContent = userData.fullName;
    document.getElementById("profileUserEmail").textContent = userData.email;
    document.getElementById("editFullName").value = userData.fullName;
    document.getElementById("editEmail").value = userData.email;

    // Get full user details
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const fullUser = users.find(u => u.email === userData.email);

    if (fullUser) {
        document.getElementById("profilePhone").textContent = fullUser.phone;
        document.getElementById("editPhone").value = fullUser.phone;
        document.getElementById("createdDate").textContent = new Date(fullUser.createdAt).toLocaleDateString();
    }
}

// ============ LOAD USER PROJECTS ============

function loadUserProjects() {
    const userProjects = JSON.parse(localStorage.getItem("userProjects")) || [];
    const recentProjects = document.getElementById("recentProjects");
    const userProjectsList = document.getElementById("userProjectsList");

    if (userProjects.length === 0) {
        recentProjects.innerHTML = '<p class="empty-state">No projects yet. Create your first project!</p>';
        userProjectsList.innerHTML = '<p class="empty-state">No projects yet. Create your first project to get started!</p>';
        return;
    }

    // Recent projects (overview tab)
    recentProjects.innerHTML = userProjects
        .slice(-3)
        .reverse()
        .map(project => `
            <div class="project-item">
                <div>
                    <div class="project-title">${project.name}</div>
                    <small style="color: var(--text-light);">${project.type}</small>
                </div>
                <span class="project-status ${project.status}">${project.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}</span>
            </div>
        `).join("");

    // All projects (projects tab)
    displayFilteredProjects(userProjects, 'all');
}

// ============ DISPLAY FILTERED PROJECTS ============

function displayFilteredProjects(projects, filter) {
    const userProjectsList = document.getElementById("userProjectsList");

    const filtered = filter === 'all' ?
        projects :
        projects.filter(p => p.status === filter);

    if (filtered.length === 0) {
        userProjectsList.innerHTML = `<p class="empty-state">No ${filter} projects</p>`;
        return;
    }

    userProjectsList.innerHTML = filtered
        .map(project => `
            <div class="project-card">
                <h4>${project.name}</h4>
                <p>${project.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="project-status ${project.status}">
                        ${project.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                    </span>
                    <button class="btn-secondary" onclick="editProject('${project.id}')">Edit</button>
                </div>
            </div>
        `).join("");
}

// ============ LOAD DASHBOARD STATS ============

function loadDashboardStats() {
    const userProjects = JSON.parse(localStorage.getItem("userProjects")) || [];

    const completed = userProjects.filter(p => p.status === 'completed').length;
    const inProgress = userProjects.filter(p => p.status === 'in-progress').length;
    const totalSpent = userProjects.reduce((sum, p) => sum + (p.cost || 0), 0);

    document.getElementById("projectCount").textContent = userProjects.length;
    document.getElementById("totalSpent").textContent = `ZMW ${totalSpent.toLocaleString()}`;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("inProgressCount").textContent = inProgress;
}

// ============ LOAD USER QUOTES ============

function loadUserQuotes() {
    const userQuotes = JSON.parse(localStorage.getItem("userQuotes")) || [];
    const quotesList = document.getElementById("quotesList");

    if (userQuotes.length === 0) {
        quotesList.innerHTML = '<p class="empty-state">No quote requests yet</p>';
        return;
    }

    quotesList.innerHTML = userQuotes
        .reverse()
        .map(quote => `
            <div class="project-card">
                <h4>Quote for: ${quote.projectName}</h4>
                <p>${quote.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <small style="color: var(--text-light);">Requested: ${new Date(quote.requestedDate).toLocaleDateString()}</small>
                    <span class="project-status ${quote.status}">${quote.status === 'pending' ? '⏳ Pending' : '✓ Received'}</span>
                </div>
            </div>
        `).join("");
}

// ============ DASHBOARD VIEW SWITCHING ============

window.switchDashboardView = function(viewName) {
    // Hide all views
    document.querySelectorAll(".dashboard-view").forEach(view => {
        view.classList.remove("active");
    });

    // Show selected view
    const view = document.getElementById(viewName + "View");
    if (view) {
        view.classList.add("active");
    }

    // Update menu
    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
    });
    event.target.classList.add("active");
};

// ============ PROJECT FILTERING ============

window.filterProjects = function(status) {
    document.querySelectorAll(".projects-filter .filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    const userProjects = JSON.parse(localStorage.getItem("userProjects")) || [];
    displayFilteredProjects(userProjects, status);
};

// ============ PROFILE EDITING ============

let editModeActive = false;

window.toggleEditMode = function() {
    editModeActive = !editModeActive;
    const inputs = document.querySelectorAll(".detail-group input");
    const button = event.target;

    inputs.forEach(input => {
        input.readOnly = !editModeActive;
        input.style.background = editModeActive ? "var(--card)" : "transparent";
    });

    if (editModeActive) {
        button.textContent = "Save Changes";
        button.classList.add("btn-primary");
    } else {
        button.textContent = "Edit Profile";
        saveProfileChanges();
    }
};

function saveProfileChanges() {
    const fullName = document.getElementById("editFullName").value;
    const email = document.getElementById("editEmail").value;
    const phone = document.getElementById("editPhone").value;

    // Update user data
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].fullName = fullName;
        users[userIndex].phone = phone;
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Update current user session
    currentUser.fullName = fullName;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    showDashboardSuccess("Profile updated successfully!");
}

// ============ PROJECT MANAGEMENT ============

window.navigateTo = function(page) {
    if (page === 'projects') {
        switchDashboardView('projects');
    } else if (page === 'quote') {
        openQuoteModal();
    } else if (page === 'tools') {
        window.location.href = "design-hub.html";
    } else if (page === 'support') {
        alert("Contact support: +260 979 661 765");
    }
};

window.editProject = function(projectId) {
    alert("Edit functionality coming soon!");
};

// ============ QUOTE MANAGEMENT ============

window.openQuoteModal = function() {
    const projectName = prompt("What is the project name?");
    if (!projectName) return;

    const description = prompt("Describe your project:");
    if (!description) return;

    // Save quote request
    const userQuotes = JSON.parse(localStorage.getItem("userQuotes")) || [];
    const quote = {
        id: Date.now(),
        projectName,
        description,
        requestedDate: new Date().toISOString(),
        status: 'pending'
    };

    userQuotes.push(quote);
    localStorage.setItem("userQuotes", JSON.stringify(userQuotes));

    showDashboardSuccess("Quote request submitted! We'll review it shortly.");
    loadUserQuotes();
};

// ============ SETTINGS MANAGEMENT ============

window.openChangePasswordModal = function() {
    const currentPassword = prompt("Enter current password:");
    if (!currentPassword) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === currentUser.email);

    if (user.password !== currentPassword) {
        alert("Current password is incorrect");
        return;
    }

    const newPassword = prompt("Enter new password:");
    if (!newPassword || newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
    }

    const confirmPassword = prompt("Confirm new password:");
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Update password
    user.password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    showDashboardSuccess("Password changed successfully!");
};

window.confirmDeleteAccount = function() {
    if (confirm("Are you sure? This cannot be undone.")) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Remove user
        const filteredUsers = users.filter(u => u.email !== currentUser.email);
        localStorage.setItem("users", JSON.stringify(filteredUsers));
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userProjects");
        localStorage.removeItem("userQuotes");

        alert("Account deleted successfully");
        window.location.href = "index.html";
    }
};

// ============ SETUP LISTENERS ============

function setupDashboardListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        darkModeToggle.checked = isDark;
        darkModeToggle.addEventListener("change", () => {
            const newTheme = darkModeToggle.checked ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    // Email notifications
    const emailNotif = document.getElementById("emailNotifications");
    if (emailNotif) {
        const savedPreference = localStorage.getItem("emailNotifications");
        emailNotif.checked = savedPreference !== "false";
        emailNotif.addEventListener("change", () => {
            localStorage.setItem("emailNotifications", emailNotif.checked);
        });
    }
}

// ============ UTILITY FUNCTIONS ============

function showDashboardSuccess(message) {
    const notification = document.createElement("div");
    notification.className = "auth-success-notification";
    notification.textContent = "✓ " + message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function updateDynamicYear() {
    const nowElement = document.getElementById("now");
    if (nowElement) {
        nowElement.textContent = `© ${new Date().getFullYear()} Professional House Painting. All rights reserved.`;
    }
}