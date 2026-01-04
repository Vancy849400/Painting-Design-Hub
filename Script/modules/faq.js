export function initializeFAQ() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((question) => {
        question.addEventListener("click", function() {
            this.parentElement.classList.toggle("active");
        });
    });
}