const API_URL = 'http://localhost:3000';

// -------------------------
// Load rooms from backend
// -------------------------
async function loadRooms() {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        const rooms = await response.json();

        const roomContainer = document.getElementById('room-container');
        const roomSelect = document.getElementById('room-select');

        roomContainer.innerHTML = '';
        roomSelect.innerHTML = '<option value="">Select Room</option>';

        rooms.forEach((room) => {
            const card = document.createElement('div');
            card.classList.add('room-card');

            card.innerHTML = `
                <h3>Room ${room.room_number}</h3>
                <p><strong>Type:</strong> ${room.room_type}</p>
                <p><strong>Capacity:</strong> ${room.capacity} Guest(s)</p>
                <p class="price">₹${room.price_per_night} / night</p>
                <p><strong>Status:</strong> ${room.status}</p>

                <button onclick="selectRoom(${room.room_id})">
                    Book This Room
                </button>
            `;

            roomContainer.appendChild(card);

            const option = document.createElement('option');

            option.value = room.room_id;

            option.textContent =
                `Room ${room.room_number} - ${room.room_type} - ₹${room.price_per_night}`;

            roomSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error loading rooms:', error);

        document.getElementById('room-container').innerHTML =
            '<p>Unable to load rooms.</p>';
    }
}


// -------------------------
// Select room from room card
// -------------------------
function selectRoom(roomId) {

    document.getElementById('room-select').value = roomId;

    document.getElementById('booking').scrollIntoView({
        behavior: 'smooth'
    });
}


// -------------------------
// Submit booking form
// -------------------------
document
    .getElementById('booking-form')
    .addEventListener('submit', async function (event) {

        event.preventDefault();

        const bookingMessage =
            document.getElementById('booking-message');

        const bookingData = {

            full_name:
                document
                    .getElementById('customer-name')
                    .value
                    .trim(),

            email:
                document
                    .getElementById('email')
                    .value
                    .trim(),

            phone:
                document
                    .getElementById('phone')
                    .value
                    .trim(),

            room_id:
                Number(
                    document.getElementById('room-select').value
                ),

            check_in_date:
                document.getElementById('check-in').value,

            check_out_date:
                document.getElementById('check-out').value,

            number_of_guests:
                Number(
                    document.getElementById('guests').value
                ),

            payment_method:
                document.getElementById('payment-method').value
        };


        // Validate required fields
        if (
            !bookingData.full_name ||
            !bookingData.email ||
            !bookingData.phone ||
            !bookingData.room_id ||
            !bookingData.check_in_date ||
            !bookingData.check_out_date ||
            !bookingData.number_of_guests ||
            !bookingData.payment_method
        ) {

            bookingMessage.textContent =
                'Please fill in all required details.';

            return;
        }


        bookingMessage.textContent =
            'Processing booking...';


        try {

            const response = await fetch(`${API_URL}/bookings`, {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(bookingData)
            });


            const result = await response.json();


            // Booking failed
            if (!response.ok) {

                bookingMessage.textContent =
                    result.message || 'Booking failed.';

                return;
            }


            // Booking successful
            bookingMessage.innerHTML = `
                ✅ <strong>Booking Successful!</strong><br>
                Booking ID: ${result.booking_id}<br>
                Total Amount: ₹${result.total_amount}<br>
                Payment Method: ${result.payment_method}
            `;


            document
                .getElementById('booking-form')
                .reset();


        } catch (error) {

            console.error('Booking error:', error);

            bookingMessage.textContent =
                'Unable to connect to the server.';
        }

    });


// -------------------------
// Format date
// -------------------------
function formatDate(dateValue) {

    if (!dateValue) {
        return '-';
    }

    const date = new Date(dateValue);

    return date.toLocaleDateString('en-GB');
}


// -------------------------
// Load booking details
// -------------------------
async function loadBookingDetails() {

    const bookingsContainer =
        document.getElementById('bookings-container');

    bookingsContainer.innerHTML =
        '<p>Loading booking details...</p>';


    try {

        const response =
            await fetch(`${API_URL}/booking-details`);

        const bookings =
            await response.json();


        if (!response.ok) {

            bookingsContainer.innerHTML =
                '<p>Unable to load booking details.</p>';

            return;
        }


        if (bookings.length === 0) {

            bookingsContainer.innerHTML =
                '<p>No bookings found.</p>';

            return;
        }


        let tableHTML = `

            <div class="booking-table-wrapper">

                <table class="booking-table">

                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Customer</th>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Guests</th>
                            <th>Amount</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
        `;


        bookings.forEach((booking) => {

            tableHTML += `

                <tr>

                    <td>
                        ${booking.booking_id}
                    </td>

                    <td>
                        ${booking.customer_name}
                    </td>

                    <td>
                        Room ${booking.room_number}
                        <br>
                        ${booking.room_type}
                    </td>

                    <td>
                        ${formatDate(booking.check_in_date)}
                    </td>

                    <td>
                        ${formatDate(booking.check_out_date)}
                    </td>

                    <td>
                        ${booking.number_of_guests}
                    </td>

                    <td>
                        ₹${booking.total_amount}
                    </td>

                    <td>
                        ${booking.payment_method || 'Not Paid'}
                    </td>

                    <td>
                        ${booking.payment_status || booking.booking_status}
                    </td>

                </tr>
            `;

        });


        tableHTML += `

                    </tbody>

                </table>

            </div>
        `;


        bookingsContainer.innerHTML =
            tableHTML;


    } catch (error) {

        console.error(
            'Error loading booking details:',
            error
        );

        bookingsContainer.innerHTML =
            '<p>Unable to connect to the server.</p>';
    }
}


// -------------------------
// View Bookings button
// -------------------------
document
    .getElementById('load-bookings-btn')
    .addEventListener('click', loadBookingDetails);


// -------------------------
// Load rooms when page opens
// -------------------------
loadRooms();