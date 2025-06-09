import { API_URL, AUTH_ENDPOINTS, BOOKING_ENDPOINTS } from './utils/constants.js';

class ProfileManager {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user')) || null;
        this.token = localStorage.getItem('token');
        this.init();
    }

    init() {
        if (!this.token) {
            window.location.href = 'index.html';
            return;
        }

        this.loadUserProfile();
        this.loadBookingHistory();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => this.handleLogout());
        document.getElementById('profileForm').addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('preferencesForm').addEventListener('submit', (e) => this.handlePreferencesUpdate(e));
    }

    async loadUserProfile() {
        try {
            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.PROFILE}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch profile');

            const data = await response.json();
            this.user = data.user;
            this.updateProfileUI();
        } catch (error) {
            console.error('Error loading profile:', error);
            this.showError('Failed to load profile information');
        }
    }

    async loadBookingHistory() {
        try {
            const response = await fetch(`${API_URL}${BOOKING_ENDPOINTS.LIST}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch bookings');

            const data = await response.json();
            this.updateBookingsUI(data.bookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
            this.showError('Failed to load booking history');
        }
    }

    updateProfileUI() {
        document.getElementById('userName').textContent = this.user.name;
        document.getElementById('memberSince').textContent = new Date(this.user.createdAt).toLocaleDateString();

        document.getElementById('fullName').value = this.user.name;
        document.getElementById('email').value = this.user.email;
        document.getElementById('phone').value = this.user.phone;
        document.getElementById('address').value = this.user.address || '';

        document.getElementById('emailNotifications').checked = this.user.preferences?.emailNotifications || false;
        document.getElementById('smsNotifications').checked = this.user.preferences?.smsNotifications || false;
        document.getElementById('preferredPass').value = this.user.preferences?.preferredPass || 'day';
    }

    updateBookingsUI(bookings) {
        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = bookings.length ? '' : '<p>No bookings found</p>';

        bookings.forEach(booking => {
            const card = document.createElement('div');
            card.className = 'booking-card';
            card.innerHTML = `
                <h3>Booking #${booking.booking_id}</h3>
                <div class="booking-details">
                    <div class="booking-detail">
                        <span class="detail-label">Visit Date</span>
                        <span class="detail-value">${new Date(booking.visit_date).toLocaleDateString()}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">Booking Date</span>
                        <span class="detail-value">${new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">Status</span>
                        <span class="detail-value">${booking.booking_status}</span>
                    </div>
                    <div class="booking-detail">
                        <span class="detail-label">Total Amount</span>
                        <span class="detail-value">₹${booking.total_amount.toFixed(2)}</span>
                    </div>
                </div>
                <div class="booking-passes">
                    ${booking.passes.map(pass => `
                        <div class="pass-item">
                            <span>${pass.pass_name}</span>
                            <span>${pass.quantity} x ₹${pass.unit_price.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="booking-actions">
                    <button class="btn" onclick="window.location.href='booking-confirmation.html?bookingId=${booking.booking_id}'">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn" onclick="downloadTicket(${booking.booking_id})">
                        <i class="fas fa-download"></i> Download Ticket
                    </button>
                </div>
            `;
            bookingsList.appendChild(card);
        });
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        try {
            const formData = {
                name: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };

            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.PROFILE}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const data = await response.json();
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.showSuccess('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showError('Failed to update profile');
        }
    }

    async handlePreferencesUpdate(e) {
        e.preventDefault();
        try {
            const preferences = {
                emailNotifications: document.getElementById('emailNotifications').checked,
                smsNotifications: document.getElementById('smsNotifications').checked,
                preferredPass: document.getElementById('preferredPass').value
            };

            const response = await fetch(`${API_URL}${AUTH_ENDPOINTS.PROFILE}/preferences`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ preferences })
            });

            if (!response.ok) throw new Error('Failed to update preferences');

            const data = await response.json();
            this.user = data.user;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.showSuccess('Preferences updated successfully');
        } catch (error) {
            console.error('Error updating preferences:', error);
            this.showError('Failed to update preferences');
        }
    }

    handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }

    async downloadTicket(bookingId) {
        try {
            const response = await fetch(`${API_URL}${BOOKING_ENDPOINTS.TICKET(bookingId)}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to download ticket');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ticket-${bookingId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Error downloading ticket:', error);
            this.showError('Failed to download ticket');
        }
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

window.downloadTicket = function (bookingId) {
    profileManager.downloadTicket(bookingId);
};

const profileManager = new ProfileManager(); 