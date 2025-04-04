const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Adjust this to your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'castlevania'
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
    connection.release();
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'castlevania-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.post('/signup', async (req, res) => {
  try {
    const { name, age, avatar, email, password, specialOffers } = req.body;
    if (!name || !age || !avatar || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error checking email:', err);
        return res.status(500).json({ success: false, message: 'Server error during signup' });
      }
      if (results.length > 0) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (name, age, avatar, email, password, specialOffers) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(sql, [name, age, avatar, email, hashedPassword, specialOffers ? 1 : 0], (err, result) => {
        if (err) {
          console.error('Database error during signup:', err);
          return res.status(500).json({ success: false, message: 'Error occurred during sign up.' });
        }
        console.log('User successfully registered:', result);
        return res.status(200).json({ success: true, message: 'Signup successful!' });
      });
    });
  } catch (error) {
    console.error('Server error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Database error during login:', err);
        return res.status(500).json({ success: false, message: 'Error occurred during login.' });
      }
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'No user found with this email.' });
      }
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          age: user.age,
          specialOffers: user.specialOffers
        };
        return res.status(200).json({
          success: true,
          message: 'Login successful!',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            age: user.age,
            specialOffers: user.specialOffers
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect password.' });
      }
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ success: true, user: req.session.user });
  } else {
    return res.status(401).json({ success: false, message: 'User not logged in' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
