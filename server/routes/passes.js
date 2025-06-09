const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const [passes] = await pool.query('SELECT * FROM passes WHERE is_active = true');
        res.json(passes);
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({ error: 'Failed to fetch passes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [pass] = await pool.query('SELECT * FROM passes WHERE pass_id = ? AND is_active = true', [req.params.id]);
        if (pass.length === 0) {
            return res.status(404).json({ error: 'Pass not found' });
        }
        res.json(pass[0]);
    } catch (error) {
        console.error('Error fetching pass:', error);
        res.status(500).json({ error: 'Failed to fetch pass' });
    }
});

module.exports = router; 