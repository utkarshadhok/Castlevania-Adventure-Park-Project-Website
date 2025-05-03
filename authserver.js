const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'castlevania'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});


const JWT_SECRET = 'castlevania-adventure-park-secret-key';


app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, dob, phone, emergency, password, confirmPassword } = req.body;

      
        const errors = {};

        if (!name || name.trim() === '') {
            errors.name = 'Name is required';
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Valid email is required';
        }

        if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            errors.phone = 'Valid phone number is required';
        }

        if (!emergency || !/^\d{10}$/.test(emergency.replace(/\D/g, ''))) {
            errors.emergency = 'Valid emergency contact is required';
        }

        if (!dob) {
            errors.dob = 'Date of birth is required';
        }

        if (!password || password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

       
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        
        db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors: { email: 'Email already registered' }
                });
            }

           
            const hashedPassword = await bcrypt.hash(password, 10);

          
            db.query(
                'INSERT INTO users (name, email, dob, phone, emergency, password) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, dob, phone, emergency, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error('Failed to insert user:', err);
                        return res.status(500).json({ success: false, message: 'Failed to create account' });
                    }

                    
                    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, { expiresIn: '7d' });

                   
                    res.status(201).json({
                        success: true,
                        message: 'Account created successfully',
                        token
                    });
                }
            );
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

      
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const user = results[0];

           
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

           
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

           
            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.get('/api/profile', authenticateToken, (req, res) => {
    db.query('SELECT id, name, email, dob, phone, emergency, created_at FROM users WHERE id = ?',
        [req.user.id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({
                success: true,
                profile: results[0]
            });
        }
    );
});


app.put('/api/profile', authenticateToken, (req, res) => {
    const { name, email, dob, phone, emergency } = req.body;

 
    const errors = {};

    if (!name || name.trim() === '') {
        errors.name = 'Name is required';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Valid email is required';
    }

    if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        errors.phone = 'Valid phone number is required';
    }

    if (!emergency || !/^\d{10}$/.test(emergency.replace(/\D/g, ''))) {
        errors.emergency = 'Valid emergency contact is required';
    }

    if (!dob) {
        errors.dob = 'Date of birth is required';
    }

   
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, errors });
    }

  
    db.query('SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.user.id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    errors: { email: 'Email already registered by another user' }
                });
            }

         
            db.query(
                'UPDATE users SET name = ?, email = ?, dob = ?, phone = ?, emergency = ? WHERE id = ?',
                [name, email, dob, phone, emergency, req.user.id],
                (err, result) => {
                    if (err) {
                        console.error('Failed to update user:', err);
                        return res.status(500).json({ success: false, message: 'Failed to update profile' });
                    }

                    res.json({
                        success: true,
                        message: 'Profile updated successfully'
                    });
                }
            );
        }
    );
});


app.put('/api/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

     
        const errors = {};

        if (!currentPassword) {
            errors.currentPassword = 'Current password is required';
        }

        if (!newPassword || newPassword.length < 6) {
            errors.newPassword = 'New password must be at least 6 characters';
        }

        if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = 'Passwords do not match';
        }

        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ success: false, errors });
        }

 
        db.query('SELECT password FROM users WHERE id = ?', [req.user.id], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const user = results[0];

            
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    errors: { currentPassword: 'Current password is incorrect' }
                });
            }

          
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            
            db.query(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, req.user.id],
                (err, result) => {
                    if (err) {
                        console.error('Failed to update password:', err);
                        return res.status(500).json({ success: false, message: 'Failed to update password' });
                    }

                    res.json({
                        success: true,
                        message: 'Password updated successfully'
                    });
                }
            );
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.get('/api/bookings', authenticateToken, (req, res) => {
    db.query('SELECT * FROM ticket_bookings WHERE user_id = ? ORDER BY booking_date DESC',
        [req.user.id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            res.json({
                success: true,
                bookings: results
            });
        }
    );
});
app.get('/api/food-orders', authenticateToken, (req, res) => {
    
    db.query('SELECT * FROM orders WHERE customer_name = ? ORDER BY order_time DESC',
        [req.user.name], 
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            res.json({
                success: true,
                orders: results
            });
        }
    );
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    });
}


app.get('/api/user', authenticateToken, (req, res) => {
    db.query('SELECT id, name, email FROM users WHERE id = ?',
        [req.user.id],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.json({
                success: true,
                user: results[0]
            });
        }
    );
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});