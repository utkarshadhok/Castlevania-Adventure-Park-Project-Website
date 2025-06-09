
DROP TABLE IF EXISTS booking_passes;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS passes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE passes (
    pass_id INT AUTO_INCREMENT PRIMARY KEY,
    pass_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration_hours INT,
    start_time TIME,
    end_time TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    booking_date DATE NOT NULL,
    visit_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE booking_passes (
    booking_pass_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    pass_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (pass_id) REFERENCES passes(pass_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO passes (pass_name, description, price, duration_hours, start_time, end_time) VALUES
('Day Pass', 'Full day access to all attractions', 49.99, 12, '09:00:00', '21:00:00'),
('Evening Pass', 'Evening access to all attractions', 39.99, 6, '16:00:00', '22:00:00'),
('VIP Pass', 'Skip-the-line access to all attractions plus exclusive benefits', 99.99, 12, '09:00:00', '22:00:00'),
('Family Pack', 'Access for 2 adults and 2 children with special discounts', 159.99, 12, '09:00:00', '21:00:00'),
('Season Pass', 'Unlimited access for the entire season', 299.99, NULL, NULL, NULL);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_visit_date ON bookings(visit_date);
CREATE INDEX idx_booking_passes_booking_id ON booking_passes(booking_id);


DELIMITER //
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//
DELIMITER ; 