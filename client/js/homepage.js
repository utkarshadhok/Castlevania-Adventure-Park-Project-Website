document.addEventListener('DOMContentLoaded', () => {
    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('expand-icon');
        menu.classList.toggle('expand-mobile');
    });

    // Search functionality
    const searchForm = document.querySelector('nav form');
    const searchInput = searchForm.querySelector('input');
    const searchIcon = searchForm.querySelector('.fa-search');
    const closeIcon = searchForm.querySelector('.fa-times');
    const nav = document.querySelector('nav');

    searchIcon.addEventListener('click', () => {
        searchInput.classList.add('expand');
        nav.classList.add('search-active');
        searchInput.focus();
    });

    closeIcon.addEventListener('click', () => {
        searchInput.classList.remove('expand');
        nav.classList.remove('search-active');
        searchInput.value = '';
    });

    // Hero section image slider
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000; // Change slide every 5 seconds

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    setInterval(nextSlide, slideInterval);

    // Offers & Passes slider
    const cardsTrack = document.querySelector('.cards-track');
    const cards = document.querySelectorAll('.offer, .pass');
    const leftBtn = document.querySelector('.scroll-btn-left');
    const rightBtn = document.querySelector('.scroll-btn-right');

    let cardIndex = 0;
    const cardWidth = cards[0].offsetWidth;
    const gap = 40; // Gap between cards (2.5rem = 40px)
    const cardsPerView = Math.floor(cardsTrack.offsetWidth / (cardWidth + gap));
    const maxIndex = cards.length - cardsPerView;

    function updateSliderButtons() {
        leftBtn.disabled = cardIndex === 0;
        rightBtn.disabled = cardIndex >= maxIndex;
    }

    function scrollCards(direction) {
        if (direction === 'left' && cardIndex > 0) {
            cardIndex--;
        } else if (direction === 'right' && cardIndex < maxIndex) {
            cardIndex++;
        }

        const translateX = -(cardIndex * (cardWidth + gap));
        cardsTrack.style.transform = `translateX(${translateX}px)`;
        updateSliderButtons();
    }

    leftBtn.addEventListener('click', () => scrollCards('left'));
    rightBtn.addEventListener('click', () => scrollCards('right'));

    // Initialize slider state
    updateSliderButtons();

    // Booking popup
    const closePopup = document.querySelector('.close-popup');
    const bookingPopup = document.getElementById('booking');

    if (closePopup && bookingPopup) {
        closePopup.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '';
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}); 