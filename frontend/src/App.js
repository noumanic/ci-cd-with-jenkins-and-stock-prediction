import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  BarChart3, 
  Clock, 
  Activity,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import PredictionCard from './components/PredictionCard';
import LoadingSpinner from './components/LoadingSpinner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [symbol, setSymbol] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [availableSymbols, setAvailableSymbols] = useState(['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'NFLX']);

  useEffect(() => {
    loadAvailableSymbols();
  }, []);

  const loadAvailableSymbols = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/symbols`);
      const data = await response.json();
      if (response.ok) {
        setAvailableSymbols(data.symbols);
      }
    } catch (error) {
      console.log('Could not load available symbols');
    }
  };

  const predictStock = async () => {
    if (!symbol.trim()) {
      toast.error('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict/${symbol.trim().toUpperCase()}`);
      const data = await response.json();
      
      if (response.ok) {
        setPrediction(data);
        addToRecentPredictions(data);
        toast.success(`Prediction generated for ${data.symbol}!`);
      } else {
        toast.error(data.error || 'Failed to get prediction');
      }
    } catch (error) {
      toast.error('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToRecentPredictions = (data) => {
    setRecentPredictions(prev => {
      const newPredictions = [data, ...prev.filter(p => p.symbol !== data.symbol)];
      return newPredictions.slice(0, 5);
    });
  };

  const chartData = prediction ? {
    labels: prediction.historical_prices.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Stock Price',
        data: prediction.historical_prices,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Price: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500'
          },
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#667eea',
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#ffffff',
            border: '1px solid #667eea',
          },
        }}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-4 flex-1">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-3">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Stockify
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Harness the power of rule-based algorithms to predict stock prices with precision. 
            Get instant insights using advanced moving average calculations.
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && predictStock()}
                  placeholder="Enter stock symbol"
                  className="w-full pl-12 pr-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/30 transition-all duration-300 text-base"
                />
              </div>
              <motion.button
                whileHover={{ 
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                  y: -2
                }}
                whileTap={{ 
                  y: 0,
                  boxShadow: "0 5px 15px rgba(59, 130, 246, 0.2)"
                }}
                onClick={predictStock}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                <Target className="w-4 h-4" />
                Predict
                  </>
                )}
              </motion.button>
            </div>
            
            <div className="mt-3 text-sm text-gray-300">
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4" />
                  <span>Available symbols:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {availableSymbols.map((sym, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs font-mono hover:bg-blue-500/30 transition-colors cursor-pointer" onClick={() => setSymbol(sym)}>
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                💡 Tip: Enter a valid stock symbol and press Enter or click Predict
              </div>
            </div>
          </div>
        </motion.div>

        {/* Prediction Result */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mb-8"
            >
              <PredictionCard prediction={prediction} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chart and Recent Predictions Container */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Chart Section */}
          <AnimatePresence>
            {chartData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl h-96 flex flex-col">
                  <div className="flex items-center gap-3 mb-3 flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-white">Price History & Trend</h3>
                  </div>
                  <div className="flex-1 min-h-0">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Predictions */}
          {recentPredictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:w-80"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-2xl h-96">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">Recent Predictions</h3>
                </div>
                <div className="space-y-2 h-80 overflow-y-auto">
                  {recentPredictions.map((pred, index) => (
                    <motion.div
                      key={`${pred.symbol}-${pred.timestamp}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {pred.symbol.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{pred.symbol}</h4>
                          <p className="text-xs text-gray-300">${pred.predicted_price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${
                          pred.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {pred.change_percent >= 0 ? (
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 inline mr-1" />
                          )}
                          {pred.change_percent > 0 ? '+' : ''}{pred.change_percent.toFixed(2)}%
                        </div>
                        <p className="text-xs text-gray-400">
                          {new Date(pred.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
