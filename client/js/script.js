// Hero Slider
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.classList.remove('active');
        });
        slides[index].style.opacity = '1';
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Show first slide
    showSlide(0);

    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Optional: Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.slider').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.querySelector('.slider').addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            }
        }
    }
});

// ... rest of your existing script code ... 