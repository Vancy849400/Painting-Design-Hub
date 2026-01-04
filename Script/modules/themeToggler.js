export function initializeThemeToggler() {
    const toggleBtn = document.getElementById("themeToggle");
    const root = document.documentElement;

    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        root.setAttribute("data-theme", savedTheme);
        if (toggleBtn) {
            toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
        }
    }

    // Add event listener for theme toggle
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isDark = root.getAttribute("data-theme") === "dark";
            const newTheme = isDark ? "light" : "dark";

            // Update DOM
            root.setAttribute("data-theme", newTheme);

            // Save preference
            localStorage.setItem("theme", newTheme);

            // Update button icon
            toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
        });
    }
}