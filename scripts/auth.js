import { API_URL, AUTH_ENDPOINTS } from './utils/constants.js';

class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
       
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });
    }

    checkAuthState() {
        const token = localStorage.getItem('token');
        const currentPage = window.location.pathname;

        if (token) {
            
            if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
                window.location.href = 'index.html';
            }
        } else {
           
            if (currentPage.includes('profile.html')) {
                window.location.href = 'login.html';
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.querySelector('input[name="remember"]')?.checked;

        try {
            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to login');
            }

            this.handleAuthSuccess(data, remember);
            window.location.href = 'index.html';
        } catch (error) {
            this.showError(error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.querySelector('input[name="terms"]').checked;

        if (!terms) {
            this.showError('Please accept the Terms & Conditions');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to register');
            }

            this.handleAuthSuccess(data, true);
            window.location.href = 'index.html';
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleAuthSuccess(data, remember) {
        if (remember) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        } else {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
        }
    }

    togglePasswordVisibility(e) {
        const button = e.currentTarget;
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const form = document.querySelector('.auth-form');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.insertBefore(errorDiv, form.firstChild);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize authentication
const authManager = new AuthManager(); 