document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function startSlideshow() {
        setInterval(nextSlide, slideInterval);
    }

    if (slides.length > 0) {
        startSlideshow();
    }
}); 