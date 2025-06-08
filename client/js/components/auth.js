/**
 * Auth Popup Component
 * Handles authentication functionality including login and signup
 */

class AuthPopup {
    constructor() {
        // DOM Elements
        this.popup = document.getElementById('authPopup');
        this.overlay = this.popup?.querySelector('.auth-popup-overlay');
        this.closeBtn = this.popup?.querySelector('.close-btn');
        this.toggleViews = this.popup?.querySelectorAll('.toggle-view');
        this.loginView = document.getElementById('loginView');
        this.signupView = document.getElementById('signupView');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.navAuthBtn = document.querySelector('.nav-auth-btn');

        this.init();
    }

    init() {
        if (!this.popup) return;

        this.initEventListeners();
        this.initFormValidation();
    }

    initEventListeners() {
        // Toggle popup
        this.navAuthBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.show();
        });

        // Close popup
        this.closeBtn?.addEventListener('click', () => this.hide());
        this.overlay?.addEventListener('click', () => this.hide());

        // Toggle between login and signup views
        this.toggleViews?.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const view = toggle.dataset.view;
                this.switchView(view);
            });
        });

        // Handle form submissions
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupForm?.addEventListener('submit', (e) => this.handleSignup(e));

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('active')) {
                this.hide();
            }
        });
    }

    initFormValidation() {
        // Login form validation
        if (this.loginForm) {
            const loginEmail = this.loginForm.querySelector('#loginEmail');
            const loginPassword = this.loginForm.querySelector('#loginPassword');

            loginEmail?.addEventListener('input', () => {
                this.validateEmail(loginEmail);
            });

            loginPassword?.addEventListener('input', () => {
                this.validatePassword(loginPassword);
            });
        }

        // Signup form validation
        if (this.signupForm) {
            const signupName = this.signupForm.querySelector('#signupName');
            const signupEmail = this.signupForm.querySelector('#signupEmail');
            const signupPassword = this.signupForm.querySelector('#signupPassword');
            const signupConfirmPassword = this.signupForm.querySelector('#signupConfirmPassword');

            signupName?.addEventListener('input', () => {
                this.validateName(signupName);
            });

            signupEmail?.addEventListener('input', () => {
                this.validateEmail(signupEmail);
            });

            signupPassword?.addEventListener('input', () => {
                this.validatePassword(signupPassword);
            });

            signupConfirmPassword?.addEventListener('input', () => {
                this.validateConfirmPassword(signupPassword, signupConfirmPassword);
            });
        }
    }

    show() {
        this.popup?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.popup?.classList.remove('active');
        document.body.style.overflow = '';
        this.clearMessages();
        this.resetForms();
    }

    switchView(view) {
        if (view === 'login') {
            this.signupView?.classList.remove('active');
            this.loginView?.classList.add('active');
        } else {
            this.loginView?.classList.remove('active');
            this.signupView?.classList.add('active');
        }
        this.clearMessages();
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('#loginEmail');
        const password = form.querySelector('#loginPassword');

        if (!this.validateForm(form)) return;

        try {
            const response = await this.loginUser(email.value, password.value);
            if (response.success) {
                this.showMessage(form, 'Login successful!', 'success');
                setTimeout(() => {
                    this.hide();
                    window.location.reload();
                }, 1500);
            } else {
                this.showMessage(form, response.message || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage(form, 'An error occurred. Please try again later.', 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('#signupName');
        const email = form.querySelector('#signupEmail');
        const password = form.querySelector('#signupPassword');
        const confirmPassword = form.querySelector('#signupConfirmPassword');

        if (!this.validateForm(form)) return;

        try {
            const response = await this.registerUser(name.value, email.value, password.value);
            if (response.success) {
                this.showMessage(form, 'Registration successful! Please log in.', 'success');
                setTimeout(() => {
                    this.switchView('login');
                }, 1500);
            } else {
                this.showMessage(form, response.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            this.showMessage(form, 'An error occurred. Please try again later.', 'error');
        }
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showInputError(input, 'This field is required');
                isValid = false;
            } else {
                switch (input.type) {
                    case 'email':
                        isValid = this.validateEmail(input) && isValid;
                        break;
                    case 'password':
                        isValid = this.validatePassword(input) && isValid;
                        break;
                    default:
                        this.clearInputError(input);
                }
            }
        });

        return isValid;
    }

    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value.trim());

        if (!isValid) {
            this.showInputError(input, 'Please enter a valid email address');
        } else {
            this.clearInputError(input);
        }

        return isValid;
    }

    validatePassword(input) {
        const password = input.value.trim();
        const isValid = password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

        if (!isValid) {
            this.showInputError(input, 'Password must be at least 8 characters long and include both letters and numbers');
        } else {
            this.clearInputError(input);
        }

        return isValid;
    }

    validateConfirmPassword(passwordInput, confirmInput) {
        const isValid = passwordInput.value === confirmInput.value;

        if (!isValid) {
            this.showInputError(confirmInput, 'Passwords do not match');
        } else {
            this.clearInputError(confirmInput);
        }

        return isValid;
    }

    validateName(input) {
        const name = input.value.trim();
        const isValid = name.length >= 2;

        if (!isValid) {
            this.showInputError(input, 'Name must be at least 2 characters long');
        } else {
            this.clearInputError(input);
        }

        return isValid;
    }

    showInputError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('error');
    }

    clearInputError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('error');
    }

    showMessage(form, message, type) {
        const messageElement = form.querySelector('.form-message');
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
    }

    clearMessages() {
        const messages = this.popup.querySelectorAll('.form-message');
        messages.forEach(message => {
            message.textContent = '';
            message.className = 'form-message';
        });
    }

    resetForms() {
        this.loginForm?.reset();
        this.signupForm?.reset();

        const inputs = this.popup.querySelectorAll('input');
        inputs.forEach(input => this.clearInputError(input));
    }

    // API calls
    async loginUser(email, password) {
        // Replace with your actual API endpoint
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    async registerUser(name, email, password) {
        // Replace with your actual API endpoint
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Network error' };
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AuthPopup();
}); 