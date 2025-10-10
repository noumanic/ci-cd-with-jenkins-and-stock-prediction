import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Clock, 
  Brain,
  Activity,
  Zap
} from 'lucide-react';

const PredictionCard = ({ prediction }) => {
  const isPositive = prediction.change_percent >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl relative overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl"></div>
      
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl"
      />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
            >
              {prediction.symbol.charAt(0)}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">{prediction.symbol}</h2>
              <p className="text-gray-300 text-sm">Stock Prediction Analysis</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isPositive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="font-semibold">
              {isPositive ? 'BULLISH' : 'BEARISH'}
            </span>
          </motion.div>
        </div>

        {/* Main Prediction Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Current Price</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              ${prediction.current_price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1">Latest market value</p>
          </motion.div>

          {/* Predicted Price */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Predicted Price</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              ${prediction.predicted_price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 mt-1">AI forecast</p>
          </motion.div>

          {/* Change Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Change</h3>
            </div>
            <p className={`text-3xl font-bold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositive ? '+' : ''}{prediction.change_percent.toFixed(2)}%
            </p>
            <p className="text-sm text-gray-400 mt-1">Expected movement</p>
          </motion.div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prediction Method */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Prediction Method</h3>
            </div>
            <p className="text-white font-medium">{prediction.prediction_method}</p>
            <p className="text-sm text-gray-400 mt-2">
              Advanced rule-based algorithmic analysis using historical data patterns
            </p>
          </motion.div>

          {/* Timestamp */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">Generated</h3>
            </div>
            <p className="text-white font-medium">
              {new Date(prediction.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Real-time analysis timestamp
            </p>
          </motion.div>
        </div>

        {/* Confidence Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Prediction Confidence</span>
            </div>
            <span className="text-green-400 font-bold">{prediction.confidence || 75}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${prediction.confidence || 75}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Based on historical accuracy and market volatility analysis
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PredictionCard;
