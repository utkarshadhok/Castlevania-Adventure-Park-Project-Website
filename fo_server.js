const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  
    password: '',  
    database: 'castlevania'  
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL');
    }
});




app.post('/place_order', (req, res) => {
    console.log("📩 Received order data:", req.body);

    const { customerName, cartItems, totalAmount } = req.body;
    
    if (!customerName || !cartItems || !totalAmount) {
        console.error("❌ Missing data:", { customerName, cartItems, totalAmount });
        return res.status(400).send("Missing order details");
    }

    const orderQuery = 'INSERT INTO orders (customer_name, cart_items, total_amount) VALUES (?, ?, ?)';
    
    db.query(orderQuery, [customerName, JSON.stringify(cartItems), totalAmount], (err, result) => {
        if (err) {
            console.error("❌ MySQL Error:", err);
            res.status(500).send("Failed to save order");
        } else {
            console.log("✅ Order saved:", result);
            res.status(200).send("Order placed successfully");
        }
    });
});





// Start Server
app.listen(8080, () => {
    console.log('🚀 Server running on http://localhost:8080');
});
