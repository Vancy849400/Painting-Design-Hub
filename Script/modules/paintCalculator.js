export function initializePaintCalculator() {
    const calculateBtn = document.getElementById("calculateBtn");

    if (!calculateBtn) return;

    calculateBtn.addEventListener("click", () => {
        const length = parseFloat(document.getElementById("roomLength").value) || 0;
        const width = parseFloat(document.getElementById("roomWidth").value) || 0;
        const height = parseFloat(document.getElementById("roomHeight").value) || 0;
        const coats = parseInt(document.getElementById("coats").value) || 1;

        // Validate inputs
        if (length === 0 || width === 0 || height === 0) {
            alert("Please enter valid room dimensions");
            return;
        }

        // Calculate wall area (excluding floor and ceiling)
        const wallArea = 2 * (length + width) * height;

        // Calculate total area with coats
        const totalArea = wallArea * coats;

        // Paint coverage: 1 liter covers ~10 m²
        const paintNeeded = (totalArea / 10).toFixed(2);

        // Cost calculation: ZMW 120 per liter
        const estimatedCost = (paintNeeded * 120).toFixed(2);

        // Update results
        document.getElementById("wallArea").textContent = `${wallArea.toFixed(2)} m²`;
        document.getElementById("paintNeeded").textContent = `${paintNeeded} liters`;
        document.getElementById("estimatedCost").textContent = `ZMW ${estimatedCost}`;
    });
}