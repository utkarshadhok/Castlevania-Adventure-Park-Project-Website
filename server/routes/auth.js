const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            first_name,
            last_name,
            phone_number
        } = req.body;

        // Validate required fields
        const requiredFields = ['username', 'email', 'password', 'first_name', 'last_name'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT user_id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Validate password
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and include both letters and numbers'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const [result] = await db.query(
            `INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, email, hashedPassword, first_name, last_name, phone_number]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: result.insertId, email: email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: result.insertId,
                username,
                email,
                first_name,
                last_name
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
            [user.user_id]
        );

        // Generate token
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login'
        });
    }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, username, email, first_name, last_name, phone_number, created_at, last_login FROM users WHERE user_id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile'
        });
    }
});

module.exports = router; 