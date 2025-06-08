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
│   │   ├── main.css (base styles)
│   │   ├── components/
│   │   │   ├── auth.css
│   │   │   ├── booking.css
│   │   │   ├── food.css
│   │   │   └── popup.css
│   │   └── pages/
│   │       ├── home.css
│   │       ├── booking.css
│   │       └── dreamfeast.css
│   ├── js/
│   │   ├── components/
│   │   │   ├── auth.js
│   │   │   ├── slider.js
│   │   │   └── popup.js
│   │   └── pages/
│   │       ├── home.js
│   │       ├── booking.js
│   │       └── dreamfeast.js
│   └── images/
├── server/
│   ├── routes/
│   ├── models/
│   └── config/
└── public/
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v8.0 or higher)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/castlevania.git
   cd castlevania
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=castlevania
   JWT_SECRET=your_jwt_secret_here
   ```

4. Set up the MySQL database:
   ```bash
   # Log into MySQL
   mysql -u your_mysql_user -p
   
   # Create the database
   CREATE DATABASE castlevania;
   
   # Exit MySQL
   exit
   
   # Import the schema
   mysql -u your_mysql_user -p castlevania < data.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Development

- The project uses a modular architecture with separate components for different features
- CSS is organized using BEM methodology
- JavaScript follows ES6+ standards and uses classes for better organization
- Authentication is handled using JWT tokens

## Database Schema

The application uses MySQL with the following main tables:

- `users`: Stores user information and authentication details
- `passes`: Contains different types of park passes and their details
- `bookings`: Tracks user bookings and visit information
- `booking_passes`: Junction table for booking-pass relationships

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Bookings
- GET `/api/passes` - Get all available passes
- POST `/api/bookings` - Create a new booking
- GET `/api/bookings/:id` - Get booking details
- GET `/api/bookings/user/:userId` - Get user's bookings

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 