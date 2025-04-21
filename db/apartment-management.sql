-- Database: apartment_management

-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS leases;
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS payments;

-- Create Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ROLE_ADMIN', 'ROLE_TENANT') NOT NULL
);

-- Create Profiles table
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Apartments table
CREATE TABLE apartments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_number VARCHAR(20) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    floor INT NOT NULL,
    description TEXT
);

-- Create Tenants table
CREATE TABLE tenants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT NOT NULL,
    apartment_id INT NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'PENDING_MOVE_IN', 'PENDING_MOVE_OUT') NOT NULL DEFAULT 'ACTIVE',
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

-- Create Leases table
CREATE TABLE leases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    apartment_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rent DECIMAL(10, 2) NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL,
    status ENUM('ACTIVE', 'EXPIRED', 'TERMINATED', 'PENDING_START', 'PENDING_RENEWAL') NOT NULL DEFAULT 'ACTIVE',
    pdf_url VARCHAR(255),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

-- Create Maintenance Requests table
CREATE TABLE maintenance_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    apartment_id INT NOT NULL,
    issue_type ENUM('PLUMBING', 'ELECTRICAL', 'HVAC', 'STRUCTURAL', 'OTHER') NOT NULL,
    description TEXT NOT NULL,
    preferred_date DATE,
    urgency ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
    status ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    technician_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
);

-- Create Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    tenant_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    method ENUM('CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER') NOT NULL,
    transaction_id VARCHAR(50),
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- --- Seed Data ---

-- Add an Admin User
-- IMPORTANT: Replace '<BCRYPT_HASHED_PASSWORD>' with the actual BCrypt hash of the desired password.
-- Example: If password is 'password', the hash might look like '$2a$10$...'
INSERT INTO users (email, password_hash, role) VALUES
('admin@example.com', '<BCRYPT_HASHED_PASSWORD>', 'ROLE_ADMIN');

-- Optional: Add a corresponding profile for the admin if needed by your application logic
-- INSERT INTO profiles (user_id, full_name, phone, emergency_contact) VALUES
-- ((SELECT id FROM users WHERE email = 'admin@example.com'), 'Admin User', '000-000-0000', '111-111-1111');
