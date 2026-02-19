import { projects, data } from "./data/Projects.js";
import { initializeProjects } from "./modules/projects.js";
import { initializeTeam } from "./modules/team.js";
import { initializeTestimonials } from "./modules/testimonials.js";
import { initializeNavigation } from "./modules/navigation.js";
import { initializeFAQ } from "./modules/faq.js";
import { initializeThemeToggler } from "./modules/themeToggler.js";
import { updateDynamicYear } from "./modules/footer.js";

// Initialize all modules when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Core features
    initializeProjects(projects);
    initializeTeam(data.team);
    initializeTestimonials(data.testimonials);
    initializeNavigation();
    initializeFAQ();
    initializeThemeToggler();
    updateDynamicYear();
});