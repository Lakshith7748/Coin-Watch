import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/format';
import MiniChart from './MiniChart';

const CoinList = ({ coins, isLoading, onSelectCoin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'rank',
    direction: 'ascending',
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedCoins = React.useMemo(() => {
    if (!sortConfig.key) return coins;
    
    return [...coins].sort((a, b) => {
      if (sortConfig.key === 'price' || sortConfig.key === 'marketCap') {
        return sortConfig.direction === 'ascending'
          ? parseFloat(a[sortConfig.key]) - parseFloat(b[sortConfig.key])
          : parseFloat(b[sortConfig.key]) - parseFloat(a[sortConfig.key]);
      }
      
      if (sortConfig.key === 'change') {
        return sortConfig.direction === 'ascending'
          ? parseFloat(a.change) - parseFloat(b.change)
          : parseFloat(b.change) - parseFloat(a.change);
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [coins, sortConfig]);

  const filteredCoins = React.useMemo(() => {
    return sortedCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedCoins, searchTerm]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="mt-6 bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700 shadow-xl">
        <div className="p-4 bg-gray-800/90 border-b border-gray-700">
          <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900/80">
                {['#', 'Coin', 'Price', 'Change', 'Market Cap', 'Last 7d'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-b border-gray-700 animate-pulse">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 py-4">
                      <div className="h-5 bg-gray-700 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-gray-800/80 backdrop-blur-md rounded-lg overflow-hidden border border-gray-700 shadow-xl">
      <div className="p-4 bg-gray-800/90 border-b border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search coins..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-900/80">
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleSort('rank')}
              >
                <div className="flex items-center">
                  #
                  {sortConfig.key === 'rank' && (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp size={14} className="ml-1" /> : 
                      <ArrowDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Coin
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp size={14} className="ml-1" /> : 
                      <ArrowDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleSort('change')}
              >
                <div className="flex items-center">
                  24h Change
                  {sortConfig.key === 'change' && (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp size={14} className="ml-1" /> : 
                      <ArrowDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleSort('marketCap')}
              >
                <div className="flex items-center">
                  Market Cap
                  {sortConfig.key === 'marketCap' && (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp size={14} className="ml-1" /> : 
                      <ArrowDown size={14} className="ml-1" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Last 7d
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredCoins.map((coin) => (
              <motion.tr 
                key={coin.uuid} 
                className="border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors"
                onClick={() => onSelectCoin(coin.uuid)}
                variants={item}
                whileHover={{ 
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  transition: { duration: 0.2 }
                }}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-300">{coin.rank}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={coin.iconUrl} alt={coin.name} className="w-6 h-6 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-white">{coin.name}</div>
                      <div className="text-xs text-gray-400">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono font-medium text-white">{formatCurrency(parseFloat(coin.price))}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div 
                    className={`text-sm font-medium ${
                      parseFloat(coin.change) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatPercentage(parseFloat(coin.change))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-white">{formatCurrency(parseFloat(coin.marketCap))}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <MiniChart 
                    data={coin.sparkline.map(price => parseFloat(price))} 
                    change={parseFloat(coin.change)}
                  />
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinList;