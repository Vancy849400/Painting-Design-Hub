import { hexToRgb, hexToHsl, hslToHex } from './colorUtils.js';
import { generateStyledPaletteDocument } from './paletteExport.js';

let currentScheme = "complementary";
let initialized = false;

function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

function getContrastRatio(rgb1, rgb2) {
    const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(x => {
            x = x / 255;
            return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

export function initializePaletteGenerator() {
    if (initialized) return;

    const baseColorInput = document.getElementById("paletteBaseColor");
    const baseHexDisplay = document.getElementById("paletteBaseHex");
    const exportBtn = document.getElementById("exportPaletteBtn");

    if (!baseColorInput || !baseHexDisplay || !exportBtn) {
        console.error("Required palette elements not found in DOM");
        return;
    }

    // Load saved scheme from localStorage
    const savedScheme = localStorage.getItem("paletteScheme");
    if (savedScheme) currentScheme = savedScheme;

    // Scheme button listeners
    document.querySelectorAll(".palette-scheme-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".palette-scheme-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentScheme = btn.dataset.scheme;
            localStorage.setItem("paletteScheme", currentScheme);
            const baseColor = baseColorInput.value;
            baseHexDisplay.textContent = baseColor;
            generatePalette(baseColor, currentScheme);
        });
    });

    // Base color input listener
    baseColorInput.addEventListener("input", (e) => {
        const color = e.target.value;
        if (isValidHex(color)) {
            baseHexDisplay.textContent = color;
            generatePalette(color, currentScheme);
        }
    });

    // Export button listener
    exportBtn.addEventListener("click", () => {
        generateStyledPaletteDocument(currentScheme);
    });

    // Initialize palette
    generatePalette(baseColorInput.value, currentScheme);
    initialized = true;
}

export function generatePalette(baseColor, scheme) {
    if (!isValidHex(baseColor)) {
        console.warn(`Invalid hex color: ${baseColor}`);
        return;
    }

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

    displayPalette(colors, baseColor);
}

function displayPalette(colors, baseColor) {
    const display = document.getElementById("paletteDisplay");
    if (!display) return;

    display.innerHTML = "";
    const baseRgb = hexToRgb(baseColor);

    colors.forEach((color) => {
        const rgb = hexToRgb(color.hex);
        const contrast = getContrastRatio(baseRgb, rgb);
        const wcagAA = contrast >= 4.5;
        const wcagAAA = contrast >= 7;

        const card = document.createElement("div");
        card.className = "palette-color-card";
        card.innerHTML = `
            <div class="palette-color-swatch" style="background:${color.hex}"></div>
            <div class="palette-color-info-box">
                <div class="palette-color-name">${color.name}</div>
                <div class="palette-color-hex">${color.hex.toUpperCase()}</div>
                <div class="palette-color-rgb">RGB(${rgb.r}, ${rgb.g}, ${rgb.b})</div>
                <div class="palette-color-contrast" title="Contrast ratio for accessibility">
                    Contrast: ${contrast} <span class="wcag-badge ${wcagAAA ? 'wcag-aaa' : wcagAA ? 'wcag-aa' : 'wcag-fail'}">${wcagAAA ? 'AAA' : wcagAA ? 'AA' : 'Fail'}</span>
                </div>
            </div>`;

        card.addEventListener("click", () => {
            navigator.clipboard.writeText(color.hex).then(() => {
                showCopyNotification(color.hex);
            }).catch(err => console.error("Failed to copy:", err));
        });

        display.appendChild(card);
    });
}

function showCopyNotification(text) {
    const note = document.getElementById("copyNotification");
    if (!note) return;

    note.textContent = `Copied: ${text}`;
    note.classList.add("show");
    setTimeout(() => note.classList.remove("show"), 1500);
}