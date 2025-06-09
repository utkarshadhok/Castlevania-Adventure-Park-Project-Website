// Constants
const API_URL = 'http://localhost:3000/api';
const SERVICE_FEE_PERCENTAGE = 0.05; // 5% service fee

// Cart state
let cart = {
    passes: [],
    total: 0,
    serviceFee: 0,
    grandTotal: 0
};

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize pass cards
async function initializePasses() {
    try {
        const response = await fetch(`${API_URL}/passes`);
        const data = await response.json();

        if (data.success) {
            const passContainer = document.querySelector('.pass-container');
            data.passes.forEach(pass => {
                const passCard = createPassCard(pass);
                passContainer.appendChild(passCard);
            });
        }
    } catch (error) {
        console.error('Error fetching passes:', error);
        showError('Failed to load passes. Please try again later.');
    }
}

// Create pass card element
function createPassCard(pass) {
    const card = document.createElement('div');
    card.className = 'pass-card';
    card.innerHTML = `
        <h3>${pass.pass_name}</h3>
        <p class="price">₹${pass.price.toFixed(2)}</p>
        <p class="description">${pass.description}</p>
        <div class="quantity-controls">
            <button class="quantity-btn minus" onclick="updateQuantity(${pass.pass_id}, -1)">-</button>
            <span class="quantity" id="quantity-${pass.pass_id}">0</span>
            <button class="quantity-btn plus" onclick="updateQuantity(${pass.pass_id}, 1)">+</button>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${pass.pass_id})">
            Add to Cart
        </button>
    `;
    return card;
}

// Update pass quantity
function updateQuantity(passId, change) {
    const quantityElement = document.getElementById(`quantity-${passId}`);
    let quantity = parseInt(quantityElement.textContent) + change;
    quantity = Math.max(0, quantity); // Ensure quantity doesn't go below 0
    quantityElement.textContent = quantity;
}

// Add pass to cart
function addToCart(passId) {
    const quantity = parseInt(document.getElementById(`quantity-${passId}`).textContent);
    if (quantity === 0) return;

    const pass = cart.passes.find(p => p.pass_id === passId);
    if (pass) {
        pass.quantity = quantity;
    } else {
        cart.passes.push({
            pass_id: passId,
            quantity: quantity,
            unit_price: getPassPrice(passId)
        });
    }

    calculateTotals();
    saveCart();
    updateCartDisplay();
    showSuccess('Added to cart successfully!');
}

// Calculate cart totals
function calculateTotals() {
    cart.total = cart.passes.reduce((sum, pass) => {
        return sum + (pass.quantity * pass.unit_price);
    }, 0);

    cart.serviceFee = cart.total * SERVICE_FEE_PERCENTAGE;
    cart.grandTotal = cart.total + cart.serviceFee;
}

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = `
        <h3>Your Cart</h3>
        ${cart.passes.map(pass => `
            <div class="cart-item">
                <span>${getPassName(pass.pass_id)}</span>
                <span>${pass.quantity} x ₹${pass.unit_price.toFixed(2)}</span>
                <button onclick="removeFromCart(${pass.pass_id})">Remove</button>
            </div>
        `).join('')}
        <div class="cart-summary">
            <div>Subtotal: ₹${cart.total.toFixed(2)}</div>
            <div>Service Fee: ₹${cart.serviceFee.toFixed(2)}</div>
            <div class="grand-total">Total: ₹${cart.grandTotal.toFixed(2)}</div>
        </div>
        <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
}

// Remove item from cart
function removeFromCart(passId) {
    cart.passes = cart.passes.filter(pass => pass.pass_id !== passId);
    calculateTotals();
    saveCart();
    updateCartDisplay();
    document.getElementById(`quantity-${passId}`).textContent = '0';
}

// Proceed to checkout
async function proceedToCheckout() {
    if (!isAuthenticated()) {
        showError('Please login to continue with booking');
        return;
    }

    if (cart.passes.length === 0) {
        showError('Your cart is empty');
        return;
    }

    const visitDate = document.getElementById('visit-date').value;
    if (!visitDate) {
        showError('Please select a visit date');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                visit_date: visitDate,
                passes: cart.passes,
                total_amount: cart.grandTotal,
                service_fee: cart.serviceFee
            })
        });

        const data = await response.json();
        if (data.success) {
            showSuccess('Booking created successfully!');
            clearCart();
            window.location.href = '/booking-confirmation.html';
        } else {
            showError(data.message || 'Failed to create booking');
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        showError('Failed to create booking. Please try again later.');
    }
}

// Clear cart
function clearCart() {
    cart = {
        passes: [],
        total: 0,
        serviceFee: 0,
        grandTotal: 0
    };
    saveCart();
    updateCartDisplay();
}

// Helper functions
function getPassPrice(passId) {
    // This should be replaced with actual pass data from the API
    const passPrices = {
        1: 2200, // Day Pass
        2: 2600, // Night Pass
        3: 4200, // Full Day Combo
        4: 1500  // Family Package
    };
    return passPrices[passId];
}

function getPassName(passId) {
    // This should be replaced with actual pass data from the API
    const passNames = {
        1: 'Day Pass',
        2: 'Night Pass',
        3: 'Full Day Combo',
        4: 'Family Package'
    };
    return passNames[passId];
}

function isAuthenticated() {
    return !!localStorage.getItem('token');
}

function getAuthToken() {
    return localStorage.getItem('token');
}

// UI feedback functions
function showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initializePasses();

    // Initialize date picker with minimum date as tomorrow
    const datePicker = document.getElementById('visit-date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    datePicker.min = tomorrow.toISOString().split('T')[0];
}); 