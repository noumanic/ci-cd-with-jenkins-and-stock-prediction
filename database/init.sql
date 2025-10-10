-- Database setup script for Stock Prediction App
-- This script creates the database and tables needed for the application

-- Create database
CREATE DATABASE IF NOT EXISTS stock_prediction;
USE stock_prediction;

-- Create stock_prices table
CREATE TABLE IF NOT EXISTS stock_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_symbol_date (symbol, date),
    INDEX idx_symbol (symbol),
    INDEX idx_date (date)
);

-- Create predictions table to store prediction history
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    current_price DECIMAL(10,2) NOT NULL,
    predicted_price DECIMAL(10,2) NOT NULL,
    change_percent DECIMAL(5,2) NOT NULL,
    prediction_method VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_symbol (symbol),
    INDEX idx_created_at (created_at)
);

-- Insert some sample data
INSERT INTO stock_prices (symbol, price, date) VALUES
('AAPL', 150.00, CURDATE() - INTERVAL 4 DAY),
('AAPL', 152.50, CURDATE() - INTERVAL 3 DAY),
('AAPL', 151.80, CURDATE() - INTERVAL 2 DAY),
('AAPL', 153.20, CURDATE() - INTERVAL 1 DAY),
('AAPL', 154.10, CURDATE()),
('GOOGL', 2800.00, CURDATE() - INTERVAL 4 DAY),
('GOOGL', 2815.50, CURDATE() - INTERVAL 3 DAY),
('GOOGL', 2820.20, CURDATE() - INTERVAL 2 DAY),
('GOOGL', 2818.70, CURDATE() - INTERVAL 1 DAY),
('GOOGL', 2825.30, CURDATE()),
('MSFT', 300.00, CURDATE() - INTERVAL 4 DAY),
('MSFT', 302.10, CURDATE() - INTERVAL 3 DAY),
('MSFT', 301.50, CURDATE() - INTERVAL 2 DAY),
('MSFT', 303.80, CURDATE() - INTERVAL 1 DAY),
('MSFT', 304.20, CURDATE()),
('TSLA', 200.00, CURDATE() - INTERVAL 4 DAY),
('TSLA', 198.50, CURDATE() - INTERVAL 3 DAY),
('TSLA', 201.20, CURDATE() - INTERVAL 2 DAY),
('TSLA', 199.80, CURDATE() - INTERVAL 1 DAY),
('TSLA', 202.10, CURDATE()),
('AMZN', 3200.00, CURDATE() - INTERVAL 4 DAY),
('AMZN', 3215.20, CURDATE() - INTERVAL 3 DAY),
('AMZN', 3208.70, CURDATE() - INTERVAL 2 DAY),
('AMZN', 3212.30, CURDATE() - INTERVAL 1 DAY),
('AMZN', 3218.90, CURDATE())
ON DUPLICATE KEY UPDATE price = VALUES(price);

-- Create a view for recent predictions
CREATE OR REPLACE VIEW recent_predictions AS
SELECT 
    symbol,
    current_price,
    predicted_price,
    change_percent,
    prediction_method,
    created_at
FROM predictions
ORDER BY created_at DESC
LIMIT 50;

-- Create a view for stock statistics
CREATE OR REPLACE VIEW stock_statistics AS
SELECT 
    symbol,
    COUNT(*) as data_points,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price,
    MAX(date) as latest_date
FROM stock_prices
GROUP BY symbol;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON stock_prediction.* TO 'stock_user'@'%';
-- FLUSH PRIVILEGES;
