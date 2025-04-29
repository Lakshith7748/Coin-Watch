import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, BarChart2, DollarSign, Globe } from 'lucide-react';
import { formatLargeNumber } from '../utils/format';

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div 
    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
  >
    <div className="flex items-center">
      <div className="p-3 rounded-lg mr-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-white text-xl font-mono font-medium">{value}</p>
      </div>
    </div>
  </motion.div>
);

const GlobalStats = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 h-24"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Cryptocurrencies"
        value={stats.totalCoins.toString()}
        icon={<Activity size={24} />}
        delay={0.1}
      />
      <StatCard
        title="Total Markets"
        value={stats.totalMarkets.toString()}
        icon={<Globe size={24} />}
        delay={0.2}
      />
      <StatCard
        title="Total Exchanges"
        value={stats.totalExchanges.toString()}
        icon={<BarChart2 size={24} />}
        delay={0.3}
      />
      <StatCard
        title="Total Market Cap"
        value={formatLargeNumber(parseFloat(stats.totalMarketCap))}
        icon={<DollarSign size={24} />}
        delay={0.4}
      />
      <StatCard
        title="24h Volume"
        value={formatLargeNumber(parseFloat(stats.total24hVolume))}
        icon={<TrendingUp size={24} />}
        delay={0.5}
      />
    </div>
  );
};

export default GlobalStats;