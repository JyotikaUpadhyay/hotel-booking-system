require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }

    console.log('Connected to MySQL Database!');
});

// Test route
app.get('/', (req, res) => {
    res.send('Hotel Booking System Backend is Running!');
});

// Get all rooms
app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM rooms', (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// Get all booking details with customer, room and payment information
app.get('/booking-details', (req, res) => {

    const query = `
        SELECT
            b.booking_id,
            c.full_name AS customer_name,
            c.email,
            c.phone,
            r.room_number,
            r.room_type,
            b.check_in_date,
            b.check_out_date,
            b.number_of_guests,
            b.total_amount,
            b.booking_status,
            p.payment_method,
            p.payment_status
        FROM bookings b
        JOIN customers c
            ON b.customer_id = c.customer_id
        JOIN rooms r
            ON b.room_id = r.room_id
        LEFT JOIN payments p
            ON b.booking_id = p.booking_id
        ORDER BY b.booking_id DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// Create new booking
app.post('/bookings', (req, res) => {

    const {
        full_name,
        email,
        phone,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        payment_method
    } = req.body;

    // Validate required fields
    if (
        !full_name ||
        !email ||
        !phone ||
        !room_id ||
        !check_in_date ||
        !check_out_date ||
        !number_of_guests ||
        !payment_method
    ) {
        return res.status(400).json({
            message: 'Please fill in all required fields.'
        });
    }

    // Get selected room
    db.query(
        'SELECT * FROM rooms WHERE room_id = ?',
        [room_id],
        (roomErr, roomResults) => {

            if (roomErr) {
                return res.status(500).json({
                    error: roomErr.message
                });
            }

            if (roomResults.length === 0) {
                return res.status(404).json({
                    message: 'Room not found.'
                });
            }

            const room = roomResults[0];

            // Check room capacity
            if (Number(number_of_guests) > room.capacity) {
                return res.status(400).json({
                    message:
                        `This room allows maximum ${room.capacity} guest(s).`
                });
            }

            const checkIn = new Date(check_in_date);
            const checkOut = new Date(check_out_date);

            // Validate dates
            if (checkOut <= checkIn) {
                return res.status(400).json({
                    message:
                        'Check-out date must be after check-in date.'
                });
            }

            // Check for overlapping booking
            const overlapQuery = `
                SELECT *
                FROM bookings
                WHERE room_id = ?
                AND booking_status = 'Confirmed'
                AND check_in_date < ?
                AND check_out_date > ?
            `;

            db.query(
                overlapQuery,
                [
                    room_id,
                    check_out_date,
                    check_in_date
                ],
                (overlapErr, overlapResults) => {

                    if (overlapErr) {
                        return res.status(500).json({
                            error: overlapErr.message
                        });
                    }

                    // Room already booked for selected dates
                    if (overlapResults.length > 0) {
                        return res.status(409).json({
                            message:
                                'This room is already booked for the selected dates. Please choose another room or different dates.'
                        });
                    }

                    // Calculate number of nights
                    const nights =
                        (checkOut - checkIn) /
                        (1000 * 60 * 60 * 24);

                    const totalAmount =
                        nights * Number(room.price_per_night);

                    // Check if customer already exists
                    db.query(
                        'SELECT * FROM customers WHERE email = ?',
                        [email],
                        (customerErr, customerResults) => {

                            if (customerErr) {
                                return res.status(500).json({
                                    error: customerErr.message
                                });
                            }

                            // Existing customer
                            if (customerResults.length > 0) {

                                createBooking(
                                    customerResults[0].customer_id,
                                    room_id,
                                    check_in_date,
                                    check_out_date,
                                    number_of_guests,
                                    totalAmount,
                                    payment_method,
                                    res
                                );

                            } else {

                                // Add new customer
                                const customerQuery = `
                                    INSERT INTO customers
                                    (full_name, email, phone)
                                    VALUES (?, ?, ?)
                                `;

                                db.query(
                                    customerQuery,
                                    [
                                        full_name,
                                        email,
                                        phone
                                    ],
                                    (insertErr, customerResult) => {

                                        if (insertErr) {
                                            return res.status(500).json({
                                                error: insertErr.message
                                            });
                                        }

                                        createBooking(
                                            customerResult.insertId,
                                            room_id,
                                            check_in_date,
                                            check_out_date,
                                            number_of_guests,
                                            totalAmount,
                                            payment_method,
                                            res
                                        );
                                    }
                                );
                            }
                        }
                    );
                }
            );
        }
    );
});

// Create booking
function createBooking(
    customerId,
    roomId,
    checkIn,
    checkOut,
    guests,
    totalAmount,
    paymentMethod,
    res
) {

    const bookingQuery = `
        INSERT INTO bookings
        (
            customer_id,
            room_id,
            check_in_date,
            check_out_date,
            number_of_guests,
            total_amount,
            booking_status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
    `;

    db.query(
        bookingQuery,
        [
            customerId,
            roomId,
            checkIn,
            checkOut,
            guests,
            totalAmount
        ],
        (bookingErr, bookingResult) => {

            if (bookingErr) {
                return res.status(500).json({
                    error: bookingErr.message
                });
            }

            const bookingId = bookingResult.insertId;

            // Create payment record
            const paymentQuery = `
                INSERT INTO payments
                (
                    booking_id,
                    payment_date,
                    amount,
                    payment_method,
                    payment_status
                )
                VALUES (?, CURRENT_DATE, ?, ?, 'Paid')
            `;

            db.query(
                paymentQuery,
                [
                    bookingId,
                    totalAmount,
                    paymentMethod
                ],
                (paymentErr, paymentResult) => {

                    if (paymentErr) {
                        return res.status(500).json({
                            error: paymentErr.message
                        });
                    }

                    res.status(201).json({
                        message: 'Booking successful!',
                        booking_id: bookingId,
                        payment_id: paymentResult.insertId,
                        total_amount: totalAmount,
                        payment_method: paymentMethod
                    });
                }
            );
        }
    );
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});