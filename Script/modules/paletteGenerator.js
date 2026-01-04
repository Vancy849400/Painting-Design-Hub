import { hexToRgb, hexToHsl, hslToHex } from './colorUtils.js';
import { generateStyledPaletteDocument } from './paletteExport.js';

let currentScheme = "complementary";

export function initializePaletteGenerator() {
    // Scheme button listeners
    document.querySelectorAll(".palette-scheme-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".palette-scheme-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentScheme = btn.dataset.scheme;
            const baseColor = document.getElementById("paletteBaseColor").value;
            document.getElementById("paletteBaseHex").textContent = baseColor;
            generatePalette(baseColor, currentScheme);
        });
    });

    // Base color input listener
    document.getElementById("paletteBaseColor").addEventListener("input", (e) => {
        document.getElementById("paletteBaseHex").textContent = e.target.value;
        generatePalette(e.target.value, currentScheme);
    });

    // Export button listener
    document.getElementById("exportPaletteBtn").addEventListener("click", () => {
        generateStyledPaletteDocument(currentScheme);
    });

    // Initialize palette
    generatePalette(
        document.getElementById("paletteBaseColor").value,
        currentScheme
    );
}

export function generatePalette(baseColor, scheme) {
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