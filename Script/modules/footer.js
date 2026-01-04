export function updateDynamicYear() {
    const nowElement = document.getElementById("now");
    if (nowElement) {
        nowElement.textContent = `© ${new Date().getFullYear()} Professional House Painting. All rights reserved.`;
    }
}