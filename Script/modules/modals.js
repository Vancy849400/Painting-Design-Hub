export function initializeModals() {
    // Open modal
    window.openToolModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    };

    // Close modal
    window.closeToolModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    };

    // Hub card click handlers
    document.querySelectorAll(".hub-card").forEach((card) => {
        card.addEventListener("click", () => {
            const toolId = card.getAttribute("data-tool");
            const modalId =
                toolId === "paintCalculator" ?
                "paintCalculatorModal" :
                "paletteGeneratorModal";
            openToolModal(modalId);
        });
    });

    // Close modals when clicking overlay
    document.querySelectorAll(".modal-overlay").forEach((overlay) => {
        overlay.addEventListener("click", (e) => {
            const modal = e.target.closest(".tool-modal");
            if (modal) {
                modal.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    });

    // Close modal with Escape key
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            document.querySelectorAll(".tool-modal.active").forEach((modal) => {
                modal.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        }
    });
}