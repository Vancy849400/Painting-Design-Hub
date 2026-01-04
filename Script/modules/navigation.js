const NAV_HEIGHT = 80;

export function initializeNavigation() {
    initializeMenuToggle();
    initializeSmoothScroll();
}

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

function initializeSmoothScroll() {
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
}