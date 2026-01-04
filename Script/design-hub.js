import { initializeModals } from './modules/modals.js';
import { initializePaintCalculator } from './modules/paintCalculator.js';
import { initializePaletteGenerator } from './modules/paletteGenerator.js';
import { initializeThemeToggler } from './modules/themeToggler.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    initializeModals();
    initializePaintCalculator();
    initializePaletteGenerator();
    initializeThemeToggler();
});