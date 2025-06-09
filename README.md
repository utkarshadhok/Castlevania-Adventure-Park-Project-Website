# Castlevania Adventure Park Website

A modern, responsive website for Castlevania Adventure Park featuring authentication, booking system, and an interactive UI.

## Features

- Responsive design for mobile, tablet, and desktop
- User authentication (login/signup)
- Interactive image slider
- Special offers and passes carousel
- Booking system
- Food ordering system (DreamFeast)
- Search functionality

## Project Structure

```
castlevania/
├── client/
│   ├── styles/
│   ├── js/
│   └── images/
├── server/
│   ├── routes/
│   ├── models/
│   └── config/
└── public/
```

## Prerequisites

- XAMPP (v8.0 or higher)
- Node.js (v14 or higher)
- npm (v6 or higher)

## XAMPP Setup Instructions

1. Install XAMPP:
   - Download and install XAMPP from https://www.apachefriends.org/
   - Start Apache and MySQL services from XAMPP Control Panel

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/castlevania.git
   cd castlevania
   ```

3. Move the project:
   - Copy the entire project folder to `C:\xampp\htdocs\castlevania`

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file in the root directory:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=castlevania
   JWT_SECRET=your_jwt_secret_here
   ```

6. Set up the MySQL database:
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named 'castlevania'
   - Import the database schema:
     - Click on the 'castlevania' database
     - Go to 'Import' tab
     - Choose the 'data.sql' file from the project
     - Click 'Go' to import

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Access the website:
   - Open your browser and navigate to `http://localhost/castlevania`

## Database Schema

The application uses MySQL with the following main tables:

- `users`: User information and authentication
- `passes`: Park passes and details
- `bookings`: User bookings and visit information
- `booking_passes`: Booking-pass relationships

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Bookings
- GET `/api/passes` - Get all passes
- POST `/api/bookings` - Create booking
- GET `/api/bookings/:id` - Get booking details
- GET `/api/bookings/user/:userId` - Get user's bookings

## Troubleshooting

1. Database Connection Issues:
   - Ensure MySQL service is running in XAMPP
   - Verify database credentials in `.env`
   - Check if database 'castlevania' exists

2. Server Issues:
   - Ensure Apache service is running
   - Check if port 3000 is available
   - Verify all dependencies are installed

3. File Permissions:
   - Ensure proper read/write permissions for the project folder
   - Check if XAMPP has access to the project directory

## License

This project is licensed under the MIT License. 