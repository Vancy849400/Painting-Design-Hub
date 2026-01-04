// ============ MODAL FUNCTIONS ============
window.openToolModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
};

window.closeToolModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
};

// ============ HUB CARD CLICK HANDLERS ============
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

// ============ PAINT CALCULATOR ============
document.getElementById("calculateBtn").addEventListener("click", () => {
    const length = parseFloat(document.getElementById("roomLength").value) || 0;
    const width = parseFloat(document.getElementById("roomWidth").value) || 0;
    const height = parseFloat(document.getElementById("roomHeight").value) || 0;
    const coats = parseInt(document.getElementById("coats").value) || 1;

    const wallArea = 2 * (length + width) * height;
    const totalArea = wallArea * coats;
    const paintNeeded = (totalArea / 10).toFixed(2);
    const estimatedCost = (paintNeeded * 120).toFixed(2);

    document.getElementById("wallArea").textContent = `${wallArea.toFixed(2)} m²`;
    document.getElementById("paintNeeded").textContent = `${paintNeeded} liters`;
    document.getElementById("estimatedCost").textContent = `ZMW ${estimatedCost}`;
});

// ============ PALETTE GENERATOR UTILITIES ============
let currentScheme = "complementary";

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    const r1 = r / 255,
        g1 = g / 255,
        b1 = b / 255;
    const max = Math.max(r1, g1, b1),
        min = Math.min(r1, g1, b1);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r1:
                h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
                break;
            case g1:
                h = (b1 - r1) / d + 2;
                break;
            case b1:
                h = (r1 - g1) / d + 4;
                break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============ PALETTE GENERATION ============
function generatePalette(baseColor, scheme) {
    const hsl = hexToHsl(baseColor);
    const colors = [];

    switch (scheme) {
        case "complementary":
            colors.push({ name: "Base", hex: baseColor });
            colors.push({
                name: "Complement",
                hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
            });
            break;
        case "analogous":
            colors.push({
                name: "Left",
                hex: hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
            });
            colors.push({ name: "Base", hex: baseColor });
            colors.push({
                name: "Right",
                hex: hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
            });
            break;
        case "triadic":
            colors.push({ name: "Base", hex: baseColor });
            colors.push({
                name: "Triadic 1",
                hex: hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
            });
            colors.push({
                name: "Triadic 2",
                hex: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
            });
            break;
        case "monochrome":
            for (let i = 0; i < 5; i++) {
                const lightness = 90 - i * 20;
                colors.push({
                    name: `Shade ${i + 1}`,
                    hex: hslToHex(hsl.h, hsl.s, lightness),
                });
            }
            break;
        case "tetradic":
            colors.push({ name: "Base", hex: baseColor });
            colors.push({
                name: "Complement",
                hex: hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
            });
            colors.push({
                name: "Split 1",
                hex: hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l),
            });
            colors.push({
                name: "Split 2",
                hex: hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
            });
            break;
    }
    displayPalette(colors);
}

function displayPalette(colors) {
    const display = document.getElementById("paletteDisplay");
    display.innerHTML = "";
    colors.forEach((color) => {
        const rgb = hexToRgb(color.hex);
        const card = document.createElement("div");
        card.className = "palette-color-card";
        card.innerHTML = `
			<div class="palette-color-swatch" style="background:${color.hex}"></div>
			<div class="palette-color-info-box">
				<div class="palette-color-name">${color.name}</div>
				<div class="palette-color-hex">${color.hex.toUpperCase()}</div>
				<div class="palette-color-rgb">RGB(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
			</div>`;
        card.addEventListener("click", () => {
            navigator.clipboard.writeText(color.hex);
            showCopyNotification();
        });
        display.appendChild(card);
    });
}

function showCopyNotification() {
    const note = document.getElementById("copyNotification");
    note.classList.add("show");
    setTimeout(() => note.classList.remove("show"), 1500);
}

// ============ EXPORT PALETTE ============
document.getElementById("exportPaletteBtn").addEventListener("click", () => {
    const colors = [];
    document.querySelectorAll(".palette-color-card").forEach((card) => {
        const name = card.querySelector(".palette-color-name").textContent;
        const hex = card.querySelector(".palette-color-hex").textContent;
        colors.push(`${name}: ${hex}`);
    });
    if (colors.length === 0) {
        alert("No palette generated yet!");
        return;
    }
    const blob = new Blob([colors.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `palette-${currentScheme}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// ============ EVENT LISTENERS ============
document.querySelectorAll(".palette-scheme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document
            .querySelectorAll(".palette-scheme-btn")
            .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentScheme = btn.dataset.scheme;
        const baseColor = document.getElementById("paletteBaseColor").value;
        document.getElementById("paletteBaseHex").textContent = baseColor;
        generatePalette(baseColor, currentScheme);
    });
});

document.getElementById("paletteBaseColor").addEventListener("input", (e) => {
    document.getElementById("paletteBaseHex").textContent = e.target.value;
    generatePalette(e.target.value, currentScheme);
});

// ============ INITIALIZE ============
generatePalette(
    document.getElementById("paletteBaseColor").value,
    currentScheme
);

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