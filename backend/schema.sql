-- Smart Inventory System Database Schema
-- Compatible with MySQL and TiDB Cloud Serverless

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer'
);

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Available'
);

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id VARCHAR(100) NOT NULL UNIQUE,
    asset_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available'
);

CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_no INT NOT NULL,
    floor_name VARCHAR(100) NOT NULL,
    room_no INT NOT NULL,
    room_code VARCHAR(100) NOT NULL UNIQUE,
    room_type VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS room_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    quantity INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'Working'
);

CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NULL,
    student_name VARCHAR(255) NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
