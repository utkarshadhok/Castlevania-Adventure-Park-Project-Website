const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const PDFDocument = require('pdfkit');

// Get all passes
router.get('/passes', async (req, res) => {
    try {
        const [passes] = await db.query('SELECT * FROM passes WHERE is_active = true');
        res.json({
            success: true,
            passes
        });
    } catch (error) {
        console.error('Error fetching passes:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching passes'
        });
    }
});

// Get user's bookings
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, 
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'pass_name', p.pass_name,
                            'quantity', bp.quantity,
                            'unit_price', bp.unit_price,
                            'subtotal', bp.subtotal
                        )
                    ) as passes
             FROM bookings b
             LEFT JOIN booking_passes bp ON b.booking_id = bp.booking_id
             LEFT JOIN passes p ON bp.pass_id = p.pass_id
             WHERE b.user_id = ?
             GROUP BY b.booking_id
             ORDER BY b.created_at DESC`,
            [req.params.userId]
        );

        res.json({
            success: true,
            bookings: bookings.map(booking => ({
                ...booking,
                passes: booking.passes ? JSON.parse(`[${booking.passes}]`) : []
            }))
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

// Get booking details
router.get('/:bookingId', authMiddleware, async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, 
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'pass_name', p.pass_name,
                            'quantity', bp.quantity,
                            'unit_price', bp.unit_price,
                            'subtotal', bp.subtotal
                        )
                    ) as passes
             FROM bookings b
             LEFT JOIN booking_passes bp ON b.booking_id = bp.booking_id
             LEFT JOIN passes p ON bp.pass_id = p.pass_id
             WHERE b.booking_id = ?
             GROUP BY b.booking_id`,
            [req.params.bookingId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = bookings[0];
        booking.passes = booking.passes ? JSON.parse(`[${booking.passes}]`) : [];

        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking details'
        });
    }
});

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const {
            visit_date,
            passes,
            total_amount,
            service_fee
        } = req.body;

        // Validate required fields
        if (!visit_date || !passes || !total_amount || !service_fee) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Insert booking
        const [bookingResult] = await connection.query(
            `INSERT INTO bookings (user_id, booking_date, visit_date, total_amount, service_fee)
             VALUES (?, CURRENT_DATE, ?, ?, ?)`,
            [req.user.id, visit_date, total_amount, service_fee]
        );

        const bookingId = bookingResult.insertId;

        // Insert booking passes
        for (const pass of passes) {
            await connection.query(
                `INSERT INTO booking_passes (booking_id, pass_id, quantity, unit_price, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [bookingId, pass.pass_id, pass.quantity, pass.unit_price, pass.subtotal]
            );
        }

        await connection.commit();

        // Generate booking confirmation PDF
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.json({
                success: true,
                booking_id: bookingId,
                message: 'Booking created successfully',
                pdf: pdfData.toString('base64')
            });
        });

        // Add content to PDF
        doc.fontSize(25).text('Booking Confirmation', 100, 100);
        doc.fontSize(15).text(`Booking ID: ${bookingId}`, 100, 150);
        doc.fontSize(15).text(`Visit Date: ${visit_date}`, 100, 180);
        doc.fontSize(15).text(`Total Amount: $${total_amount}`, 100, 210);
        doc.fontSize(15).text('Passes:', 100, 250);

        let y = 280;
        passes.forEach(pass => {
            doc.fontSize(12).text(
                `${pass.quantity}x ${pass.pass_name} - $${pass.subtotal}`,
                120,
                y
            );
            y += 20;
        });

        doc.end();
    } catch (error) {
        await connection.rollback();
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking'
        });
    } finally {
        connection.release();
    }
});

module.exports = router; 