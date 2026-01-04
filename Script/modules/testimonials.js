export function initializeTestimonials(testimonialsData) {
    renderTestimonials(testimonialsData);
}

function renderTestimonials(testimonialsData) {
    const testimonialsGrid = document.getElementById("testimonialsGrid");
    if (!testimonialsGrid) {
        console.error("testimonialsGrid element not found");
        return;
    }

    testimonialsGrid.innerHTML = testimonialsData
        .map((testimonial) => `
            <div class="testimonial-card">
                <div class="stars">${"★".repeat(testimonial.rating)}</div>
                <p class="testimonial-text">"${testimonial.text}"</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${testimonial.avatar}</div>
                    <div class="author-info">
                        <h4>${testimonial.author}</h4>
                        <p>${testimonial.role}</p>
                    </div>
                </div>
                ${testimonial.verified ? '<span class="verified-badge">✓ Verified Review</span>' : ""}
            </div>
        `)
        .join("");
}