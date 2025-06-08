import { NAVBAR_LINKS } from './utils/constants.js';

class NavigationManager {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.updateNavLinks();
        window.addEventListener('storage', (e) => {
            if (e.key === 'token' || e.key === 'user') {
                this.updateNavLinks();
            }
        });
    }

    setupMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.hamburger.classList.remove('active');
                this.navLinks.classList.remove('active');
            }
        });
    }

    updateNavLinks() {
        const isAuthenticated = !!localStorage.getItem('token');
        const navLinksContainer = document.querySelector('.nav-links');
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

        // Filter links based on authentication state
        const visibleLinks = NAVBAR_LINKS.filter(link =>
            !link.requiresAuth || (link.requiresAuth && isAuthenticated)
        );

        // Update navigation links
        navLinksContainer.innerHTML = visibleLinks.map(link => `
            <a href="${link.href}" ${window.location.pathname.endsWith(link.href) ? 'class="active"' : ''}>
                ${link.text}
            </a>
        `).join('');

        // Add auth buttons only on homepage if not authenticated
        if (isHomePage && !isAuthenticated &&
            !window.location.pathname.includes('login.html') &&
            !window.location.pathname.includes('register.html')) {
            navLinksContainer.innerHTML += `
                <a href="login.html" class="auth-btn login">Login</a>
                <a href="register.html" class="auth-btn register">Register</a>
            `;
        }
    }
}

// Initialize navigation
const navigationManager = new NavigationManager(); 