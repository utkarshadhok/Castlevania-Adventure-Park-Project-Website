const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.use('/api', authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 