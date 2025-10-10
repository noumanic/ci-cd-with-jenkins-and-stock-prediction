import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import StockifyLogo from './StockifyLogo';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-white/5 backdrop-blur-lg border-t border-white/20 mt-auto"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <StockifyLogo size={32} />
              <h3 className="text-xl font-bold gradient-text">Stockify</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Advanced rule-based stock prediction platform powered by moving average algorithms 
              and real-time market analysis. Make informed investment decisions with confidence.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/noumanic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com/noumanic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:noumanhafeez.nh11@gmail.com" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Developer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center md:text-left"
          >
            <h4 className="text-white font-semibold mb-4">Developer</h4>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 text-white font-semibold mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>MNH 21I-0416</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">
                Student Developer
              </p>
              <p className="text-xs text-gray-400">
                MLOPS Fall 2025 Assignment
              </p>
              <p className="text-xs text-gray-400">
                CI/CD with Jenkins & Stock Prediction
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="border-t border-white/10 mt-8 pt-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                   <p className="text-sm text-gray-400 text-center md:text-left">
                     © 2025 Stockify. All rights reserved. Rule-Based Stock Prediction Platform
                   </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Version 1.0.0</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
