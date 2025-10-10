import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, Clock, Smartphone, Activity, TrendingUp } from 'lucide-react';
import StockifyLogo from './StockifyLogo';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <StockifyLogo size={40} />
            <div>
              <h1 className="text-2xl font-bold gradient-text">Stockify</h1>
              <p className="text-xs text-gray-300">Rule-Based Stock Prediction</p>
            </div>
          </motion.div>

          {/* Features */}
          <div className="hidden lg:flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Activity className="w-4 h-4 text-green-400" />
              <span>Real-time Analysis</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Target className="w-4 h-4 text-blue-400" />
              <span>Rule-Based Predictions</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Historical Data</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>Interactive Charts</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Smartphone className="w-4 h-4 text-pink-400" />
              <span>Responsive Design</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
