// Auth Popup Management
class AuthPopup {
    constructor() {
        this.popup = document.getElementById('authPopup');
        this.loginView = document.getElementById('loginView');
        this.signupView = document.getElementById('signupView');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.closeBtn = this.popup.querySelector('.close-btn');
        this.overlay = this.popup.querySelector('.auth-popup-overlay');
        this.toggleLinks = document.querySelectorAll('.toggle-view');
        this.navAuthBtn = document.querySelector('.nav-auth-btn');

        this.initializeEventListeners();
        this.checkAuthState();
    }

    initializeEventListeners() {
        // Toggle popup
        this.navAuthBtn.addEventListener('click', () => this.openPopup());
        this.closeBtn.addEventListener('click', () => this.closePopup());
        this.overlay.addEventListener('click', () => this.closePopup());

        // Toggle views
        this.toggleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleView(e.target.dataset.view);
            });
        });

        // Form submissions
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));

        // Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.closePopup();
            }
        });
    }

    openPopup() {
        this.popup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closePopup() {
        this.popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleView(view) {
        if (view === 'login') {
            this.loginView.classList.add('active');
            this.signupView.classList.remove('active');
        } else {
            this.loginView.classList.remove('active');
            this.signupView.classList.add('active');
        }
    }

    showMessage(form, message, type) {
        const messageDiv = form.querySelector('.form-message');
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        setTimeout(() => {
            messageDiv.className = 'form-message';
            messageDiv.textContent = '';
        }, 3000);
    }

    validatePassword(password) {
        return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = this.loginForm.loginEmail.value;
        const password = this.loginForm.loginPassword.value;

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (user && user.password === password) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showMessage(this.loginForm, 'Login successful!', 'success');
            this.updateNavButton(user.name);
            setTimeout(() => this.closePopup(), 1500);
        } else {
            this.showMessage(this.loginForm, 'Invalid email or password', 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const name = this.signupForm.signupName.value;
        const email = this.signupForm.signupEmail.value;
        const password = this.signupForm.signupPassword.value;
        const confirmPassword = this.signupForm.signupConfirmPassword.value;

        if (!this.validatePassword(password)) {
            this.showMessage(this.signupForm, 'Password must be at least 8 characters with letters and numbers', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(this.signupForm, 'Passwords do not match', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.email === email)) {
            this.showMessage(this.signupForm, 'Email already exists', 'error');
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        this.showMessage(this.signupForm, 'Account created successfully!', 'success');
        this.updateNavButton(name);
        setTimeout(() => this.closePopup(), 1500);
    }

    updateNavButton(name) {
        this.navAuthBtn.innerHTML = `<i class="fas fa-user"></i> Welcome, ${name}`;
        this.navAuthBtn.classList.add('logged-in');
    }

    checkAuthState() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            this.updateNavButton(currentUser.name);
        }
    }
}

// Initialize Auth Popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthPopup();
}); 