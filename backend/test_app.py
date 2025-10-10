import unittest
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app, calculate_moving_average, fetch_stock_data

class TestStockPredictionAPI(unittest.TestCase):
    
    def setUp(self):
        """Set up test client"""
        self.app = app.test_client()
        self.app.testing = True
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'healthy')
    
    def test_predict_stock(self):
        """Test stock prediction endpoint"""
        response = self.app.get('/api/predict/AAPL')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('symbol', data)
        self.assertIn('predicted_price', data)
        self.assertIn('current_price', data)
        self.assertEqual(data['symbol'], 'AAPL')
    
    def test_get_symbols(self):
        """Test available symbols endpoint"""
        response = self.app.get('/api/symbols')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('symbols', data)
        self.assertIsInstance(data['symbols'], list)
    
    def test_calculate_moving_average(self):
        """Test moving average calculation"""
        prices = [100, 102, 104, 103, 105]
        avg = calculate_moving_average(prices, 3)
        expected = (103 + 104 + 105) / 3  # Last 3 days
        self.assertEqual(avg, expected)
    
    def test_fetch_stock_data(self):
        """Test stock data fetching"""
        data = fetch_stock_data('AAPL')
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        self.assertTrue(all(isinstance(price, (int, float)) for price in data))
    
    def test_invalid_symbol(self):
        """Test prediction with invalid symbol"""
        response = self.app.get('/api/predict/INVALID')
        # Should still return 200 but with default mock data
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()
