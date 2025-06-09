export const API_URL = 'http://localhost:3000/api';

export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout'
};

export const BOOKING_ENDPOINTS = {
    CREATE: '/bookings/create',
    LIST: '/bookings/list',
    DETAILS: (id) => `/bookings/${id}`,
    TICKET: (id) => `/bookings/${id}/ticket`,
    CANCEL: (id) => `/bookings/${id}/cancel`
};

export const PASS_TYPES = {
    DAY: {
        id: 'day',
        name: 'Day Pass',
        price: 2200,
        description: '10 AM to 6 PM access to all attractions',
        timing: '10:00 AM - 6:00 PM'
    },
    NIGHT: {
        id: 'night',
        name: 'Night Pass',
        price: 2600,
        description: '6 PM to midnight access to all attractions',
        timing: '6:00 PM - 12:00 AM'
    },
    FULL: {
        id: 'full',
        name: 'Full Day Combo',
        price: 4200,
        description: 'All-day access to all attractions',
        timing: '10:00 AM - 12:00 AM'
    },
    FAMILY: {
        id: 'family',
        name: 'Family Package',
        price: 1500,
        description: 'Special family benefits and discounts',
        timing: 'Valid for all timings'
    }
};

export const SERVICE_FEE = 200;
export const TAX_RATE = 0.18; // 18% GST

export const TOAST_DURATION = 3000;

export const NAVBAR_LINKS = [
    { text: 'Home', href: 'index.html' },
    { text: 'DreamFeast HQ', href: 'dreamfeast.html' },
    { text: 'Book Now', href: 'booking.html' },
    { text: 'Profile', href: 'profile.html', requiresAuth: true }
];

export const FOOTER_LINKS = {
    SOCIAL: [
        { icon: 'facebook', url: '#' },
        { icon: 'twitter', url: '#' },
        { icon: 'instagram', url: '#' }
    ],
    QUICK: [
        { text: 'Terms & Conditions', href: '#' },
        { text: 'Privacy Policy', href: '#' },
        { text: 'FAQs', href: '#' }
    ]
};

export const CONTACT_INFO = {
    phone: '+91 123-456-7890',
    email: 'info@castlevania.com',
    address: '123 Dracula Street, Transylvania'
}; 