import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, Clock, Menu, X } from 'lucide-react';

const Header = ({ onTimePeriodChange, timePeriod }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const timePeriods = [
    { value: '3h', label: '3H', displayText: 'Last 3H' },
    { value: '24h', label: '24H', displayText: 'Last 24H' },
    { value: '7d', label: '7D', displayText: 'Last 7D' },
    { value: '30d', label: '30D', displayText: 'Last 30D' },
    { value: '3m', label: '3M', displayText: 'Last 3M' },
    { value: '1y', label: '1Y', displayText: 'Last Year' },
    { value: '5y', label: '5Y', displayText: 'Last 5 Years' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPeriod = timePeriods.find(period => period.value === timePeriod);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <motion.div 
            className="flex items-center mr-4 text-blue-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bitcoin size={28} className="mr-2" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              CryptoVision
            </h1>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-1 ml-6">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm mr-2">{currentPeriod?.displayText || 'Time Period'}:</span>
            <div className="flex bg-gray-800 rounded-lg p-1">
              {timePeriods.map((period) => (
                <motion.button
                  key={period.value}
                  className={`px-3 py-1 text-xs rounded-md ${
                    timePeriod === period.value
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => onTimePeriodChange(period.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {period.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <motion.button 
            className="p-2 text-gray-300 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden bg-gray-800 px-4 py-3 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-3">
            <Clock size={16} className="text-gray-400 mr-2" />
            <span className="text-gray-400 text-sm">{currentPeriod?.displayText || 'Time Period'}:</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timePeriods.map((period) => (
              <motion.button
                key={period.value}
                className={`px-3 py-2 text-xs rounded-md ${
                  timePeriod === period.value
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => {
                  onTimePeriodChange(period.value);
                  setIsMobileMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
              >
                {period.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;