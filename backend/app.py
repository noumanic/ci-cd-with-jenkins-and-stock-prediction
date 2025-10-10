from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
pymysql.install_as_MySQLdb()
import requests
import json
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'database': os.getenv('DB_NAME', 'stock_prediction')
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = pymysql.connect(**DB_CONFIG)
        return connection
    except pymysql.Error as err:
        print(f"Database connection error: {err}")
        return None

def fetch_stock_data(symbol):
    """Fetch stock data from Alpha Vantage API (using demo data for assignment)"""
    # For this assignment, we'll use mock data instead of real API calls
    # In production, you would use a real API like Alpha Vantage
    
    mock_data = {
        'AAPL': [150.0, 152.5, 151.8, 153.2, 154.1],
        'GOOGL': [2800.0, 2815.5, 2820.2, 2818.7, 2825.3],
        'MSFT': [300.0, 302.1, 301.5, 303.8, 304.2],
        'TSLA': [200.0, 198.5, 201.2, 199.8, 202.1],
        'AMZN': [3200.0, 3215.2, 3208.7, 3212.3, 3218.9]
    }
    
    return mock_data.get(symbol.upper(), [100.0, 101.5, 102.2, 101.8, 103.1])

def calculate_moving_average(prices, days=3):
    """Calculate moving average for prediction"""
    if len(prices) < days:
        return sum(prices) / len(prices)
    return sum(prices[-days:]) / days

def calculate_confidence(prices, prediction, current_price):
    """Calculate prediction confidence based on data quality and volatility"""
    if len(prices) < 3:
        return 60  # Low confidence for insufficient data
    
    # Calculate price volatility (standard deviation)
    mean_price = sum(prices) / len(prices)
    variance = sum((price - mean_price) ** 2 for price in prices) / len(prices)
    volatility = variance ** 0.5
    
    # Calculate confidence based on volatility and data consistency
    base_confidence = 75
    
    # Reduce confidence for high volatility
    volatility_factor = max(0, 1 - (volatility / mean_price) * 2)
    
    # Increase confidence for consistent trends
    recent_trend = (prices[-1] - prices[-3]) / prices[-3] if len(prices) >= 3 else 0
    trend_factor = max(0.8, 1 - abs(recent_trend) * 0.5)
    
    # Calculate final confidence
    confidence = base_confidence * volatility_factor * trend_factor
    
    # Ensure confidence is within reasonable bounds
    return max(60, min(95, round(confidence)))

def store_stock_data(symbol, prices):
    """Store stock data in database"""
    connection = get_db_connection()
    if not connection:
        print("Database connection failed, skipping data storage")
        return False
    
    try:
        cursor = connection.cursor()
        
        # Create table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stock_prices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                symbol VARCHAR(10) NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert stock data
        today = datetime.now().date()
        for i, price in enumerate(prices):
            date = today - timedelta(days=len(prices)-1-i)
            cursor.execute("""
                INSERT INTO stock_prices (symbol, price, date)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE price = %s
            """, (symbol.upper(), price, date, price))
        
        connection.commit()
        cursor.close()
        connection.close()
        print(f"Successfully stored data for {symbol}")
        return True
        
    except pymysql.Error as err:
        print(f"Database error: {err}")
        if connection:
            connection.close()
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/predict/<symbol>', methods=['GET'])
def predict_stock(symbol):
    """Predict stock price using moving average"""
    try:
        # Fetch historical data
        prices = fetch_stock_data(symbol)
        
        if not prices:
            return jsonify({'error': 'No data available for symbol'}), 404
        
        # Store data in database (optional - continue even if it fails)
        store_stock_data(symbol, prices)
        
        # Calculate prediction using 3-day moving average
        prediction = calculate_moving_average(prices, 3)
        
        # Calculate confidence
        confidence = calculate_confidence(prices, prediction, prices[-1])
        
        # Calculate additional metrics
        current_price = prices[-1]
        change_percent = ((prediction - current_price) / current_price) * 100
        
        response = {
            'symbol': symbol.upper(),
            'current_price': current_price,
            'predicted_price': round(prediction, 2),
            'change_percent': round(change_percent, 2),
            'confidence': confidence,
            'historical_prices': prices,
            'prediction_method': '3-day moving average',
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history/<symbol>', methods=['GET'])
def get_stock_history(symbol):
    """Get historical stock data from database"""
    connection = get_db_connection()
    if not connection:
        return jsonify({
            'symbol': symbol.upper(),
            'data': [],
            'count': 0,
            'message': 'Database not available - using mock data'
        })
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT symbol, price, date, created_at
            FROM stock_prices
            WHERE symbol = %s
            ORDER BY date DESC
            LIMIT 30
        """, (symbol.upper(),))
        
        data = cursor.fetchall()
        cursor.close()
        connection.close()
        
        return jsonify({
            'symbol': symbol.upper(),
            'data': data,
            'count': len(data)
        })
        
    except pymysql.Error as err:
        print(f"Database error in history: {err}")
        if connection:
            connection.close()
        return jsonify({
            'symbol': symbol.upper(),
            'data': [],
            'count': 0,
            'message': 'Database error - using mock data'
        })

@app.route('/api/symbols', methods=['GET'])
def get_available_symbols():
    """Get list of available stock symbols"""
    symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']
    return jsonify({'symbols': symbols})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
