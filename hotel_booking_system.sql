CREATE DATABASE hotel_booking_system;
USE hotel_booking_system;
CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(100) NOT NULL
);
CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Available'
);
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    number_of_guests INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'Confirmed',

    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Paid',

    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
INSERT INTO rooms
(room_number, room_type, price_per_night, capacity, status)
VALUES
('101', 'Single', 1500.00, 1, 'Available'),
('102', 'Double', 2500.00, 2, 'Available'),
('201', 'Deluxe', 4000.00, 2, 'Available'),
('202', 'Suite', 6000.00, 4, 'Available'),
('301', 'Family', 5000.00, 5, 'Available');

INSERT INTO customers
(full_name, email, phone, password)
VALUES
('Aarav Sharma', 'aarav@gmail.com', '9876543210', 'aarav123'),
('Ananya Singh', 'ananya@gmail.com', '9876501234', 'ananya123'),
('Rohan Verma', 'rohan@gmail.com', '9123456780', 'rohan123');

INSERT INTO bookings
(customer_id, room_id, check_in_date, check_out_date,
 number_of_guests, total_amount, booking_status)
VALUES
(1, 1, '2026-09-10', '2026-09-12', 1, 3000.00, 'Confirmed'),
(2, 3, '2026-09-15', '2026-09-18', 2, 12000.00, 'Confirmed'),
(3, 2, '2026-09-20', '2026-09-22', 2, 5000.00, 'Confirmed');

INSERT INTO payments
(booking_id, payment_date, amount, payment_method, payment_status)
VALUES
(1, '2026-09-08', 3000.00, 'UPI', 'Paid'),
(2, '2026-09-12', 12000.00, 'Card', 'Paid'),
(3, '2026-09-18', 5000.00, 'Cash', 'Paid');

SELECT * FROM customers;
SELECT * FROM rooms;
SELECT * FROM bookings;
SELECT * FROM payments;

SELECT 
    b.booking_id,
    c.full_name AS customer_name,
    r.room_number,
    r.room_type,
    b.check_in_date,
    b.check_out_date,
    b.number_of_guests,
    b.total_amount,
    b.booking_status
FROM bookings b
JOIN customers c ON b.customer_id = c.customer_id
JOIN rooms r ON b.room_id = r.room_id;

SELECT room_number, room_type, price_per_night, capacity
FROM rooms
WHERE status = 'Available';

SELECT
    p.payment_id,
    c.full_name AS customer_name,
    b.booking_id,
    p.amount,
    p.payment_method,
    p.payment_status
FROM payments p
JOIN bookings b ON p.booking_id = b.booking_id
JOIN customers c ON b.customer_id = c.customer_id;

USE hotel_booking_system;

ALTER TABLE customers DROP COLUMN password;

USE hotel_booking_system;

SELECT * FROM bookings;

SELECT * FROM customers;

SELECT 
    b.booking_id,
    c.full_name AS customer_name,
    r.room_number,
    r.room_type,
    b.check_in_date,
    b.check_out_date,
    b.number_of_guests,
    b.total_amount,
    b.booking_status
FROM bookings b
JOIN customers c ON b.customer_id = c.customer_id
JOIN rooms r ON b.room_id = r.room_id;

SELECT * FROM payments;

SELECT * FROM payments;

DESCRIBE payments;