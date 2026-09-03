# 🏨 Hotel Booking System

A full-stack **Hotel Booking Management System** developed as a DBMS Mini Project.  
The application allows users to view available rooms, make hotel bookings, select a payment method, and view booking details.

## 📌 Project Overview

The Hotel Booking System provides a simple interface for managing hotel room reservations. It integrates a frontend application with a Node.js/Express backend and a MySQL relational database.

The system also performs validations such as preventing overlapping room bookings, checking room capacity, and validating booking dates.

## ✨ Features

- View hotel rooms and room details
- Select a room for booking
- Enter customer information
- Select check-in and check-out dates
- Specify number of guests
- Automatic calculation of total booking amount
- Room capacity validation
- Check-in/check-out date validation
- Prevention of overlapping/double bookings
- Payment method selection
- Automatic payment record creation
- View confirmed bookings and payment information
- MySQL database integration

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MySQL
- MySQL Workbench

### Other Tools
- Visual Studio Code
- Git
- GitHub

## 🗄️ Database Tables

The project uses four main relational tables:

### 1. Customers
Stores customer information such as name, email, and phone number.

### 2. Rooms
Stores room number, room type, capacity, price per night, and room status.

### 3. Bookings
Stores booking information including customer, room, check-in/check-out dates, number of guests, total amount, and booking status.

### 4. Payments
Stores payment information associated with each booking.

## 🔗 Database Relationships

- One customer can have multiple bookings.
- One room can have multiple bookings on different dates.
- Each booking is associated with a customer and a room.
- Payment records are linked to bookings using foreign keys.

## ✅ Validations Implemented

The system checks:

- Check-out date must be after check-in date.
- Number of guests cannot exceed room capacity.
- A room cannot be booked for overlapping dates.
- Required booking information must be provided.

## 📁 Project Structure

```text
Hotel-Booking-System/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── hotel_booking_system.sql
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

> `node_modules` and `.env` are intentionally excluded from the repository.

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hotel_booking_system
PORT=3000
```

### 4. Set up the database

Open MySQL Workbench and execute:

```text
hotel_booking_system.sql
```

### 5. Start the backend server

```bash
node server.js
```

The backend will run on:

```text
http://localhost:3000
```

### 6. Open the frontend

Open `index.html` using Live Server in Visual Studio Code.

## 🔒 Security

Database credentials are stored using environment variables.

The `.env` file is excluded from GitHub through `.gitignore` to prevent database credentials from being publicly exposed.

## 🎓 Academic Project

This project was developed as a **DBMS Mini Project** to demonstrate:

- Relational database design
- Primary and foreign keys
- Database relationships
- SQL queries and JOIN operations
- Frontend-backend integration
- CRUD/database operations
- Data validation and integrity

