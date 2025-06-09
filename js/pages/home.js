/**
 * Homepage JavaScript
 * Handles all interactive functionality for the homepage
 */

class Homepage {
    constructor() {
        // DOM Elements
        this.menuToggle = document.querySelector('.menu-toggle');
        this.menu = document.querySelector('.menu');
        this.searchForm = document.querySelector('.search-form');
        this.searchInput = this.searchForm?.querySelector('input');
        this.searchIcon = this.searchForm?.querySelector('.search-icon');
        this.closeIcon = this.searchForm?.querySelector('.close-icon');
        this.nav = document.querySelector('nav');
        this.slides = document.querySelectorAll('.slide');
        this.cardsTrack = document.querySelector('.cards-track');
        this.cards = document.querySelectorAll('.offer, .pass');
        this.leftBtn = document.querySelector('.scroll-btn-left');
        this.rightBtn = document.querySelector('.scroll-btn-right');
        this.closePopup = document.querySelector('.close-popup');
        this.bookingPopup = document.getElementById('booking');

        // State
        this.currentSlide = 0;
        this.cardIndex = 0;
        this.cardWidth = this.cards[0]?.offsetWidth || 320;
        this.gap = 40; // Gap between cards (2.5rem = 40px)
        this.cardsPerView = Math.floor((this.cardsTrack?.offsetWidth || 0) / (this.cardWidth + this.gap));
        this.maxIndex = this.cards.length - this.cardsPerView;
        this.slideInterval = 5000; // Change slide every 5 seconds

        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initSearch();
        this.initSlider();
        this.initCardsSlider();
        this.initBookingPopup();
        this.initSmoothScroll();
    }

    // Mobile Menu
    initMobileMenu() {
        if (!this.menuToggle || !this.menu) return;

        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('expand-icon');
            this.menu.classList.toggle('expand-mobile');
        });
    }

    // Search Functionality
    initSearch() {
        if (!this.searchIcon || !this.closeIcon || !this.searchInput || !this.nav) return;

        const searchForm = this.searchInput.closest('.search-form');

        this.searchIcon.addEventListener('click', () => {
            this.searchInput.classList.add('expand');
            searchForm.classList.add('active');
            this.nav.classList.add('search-active');
            this.searchInput.focus();
        });

        this.closeIcon.addEventListener('click', () => {
            this.searchInput.classList.remove('expand');
            searchForm.classList.remove('active');
            this.nav.classList.remove('search-active');
            this.searchInput.value = '';
        });

        // Close search on ESC key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeIcon.click();
            }
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target) && this.searchInput.classList.contains('expand')) {
                this.closeIcon.click();
            }
        });
    }

    // Hero Section Slider
    initSlider() {
        if (!this.slides.length) return;

        const nextSlide = () => {
            this.slides[this.currentSlide].classList.remove('active');
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.slides[this.currentSlide].classList.add('active');
        };

        setInterval(nextSlide, this.slideInterval);
    }

    // Offers & Passes Slider
    initCardsSlider() {
        if (!this.cardsTrack || !this.leftBtn || !this.rightBtn) return;

        const updateSliderButtons = () => {
            this.leftBtn.disabled = this.cardIndex === 0;
            this.rightBtn.disabled = this.cardIndex >= this.maxIndex;
        };

        const scrollCards = (direction) => {
            if (direction === 'left' && this.cardIndex > 0) {
                this.cardIndex--;
            } else if (direction === 'right' && this.cardIndex < this.maxIndex) {
                this.cardIndex++;
            }

            const translateX = -(this.cardIndex * (this.cardWidth + this.gap));
            this.cardsTrack.style.transform = `translateX(${translateX}px)`;
            updateSliderButtons();
        };

        this.leftBtn.addEventListener('click', () => scrollCards('left'));
        this.rightBtn.addEventListener('click', () => scrollCards('right'));

        // Initialize slider state
        updateSliderButtons();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.cardsPerView = Math.floor(this.cardsTrack.offsetWidth / (this.cardWidth + this.gap));
            this.maxIndex = this.cards.length - this.cardsPerView;
            updateSliderButtons();
        });
    }

    // Booking Popup
    initBookingPopup() {
        if (!this.closePopup || !this.bookingPopup) return;

        this.closePopup.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '';
        });
    }

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Homepage();
}); 