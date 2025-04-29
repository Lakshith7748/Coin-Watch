import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, DollarSign, Activity, Clock, Globe } from 'lucide-react';
import { fetchCoinDetails, fetchCoinHistory } from '../api/coinranking';
import { formatCurrency, formatLargeNumber, formatPercentage, formatDate } from '../utils/format';
import PriceChart from './PriceChart';

const CoinDetails = ({ coinId, timePeriod, onBackClick }) => {
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch coin details and history in parallel
        const [detailsResponse, historyResponse] = await Promise.all([
          fetchCoinDetails(coinId),
          fetchCoinHistory(coinId, timePeriod)
        ]);
        
        setCoin(detailsResponse.data.coin);
        setHistory(historyResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching coin details:', error);
        setError('Failed to load coin details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [coinId, timePeriod]);

  if (isLoading) {
    return (
      <div className="py-8">
        <motion.button
          onClick={onBackClick}
          className="flex items-center text-gray-400 hover:text-white mb-6"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </motion.button>
        
        <div className="h-72 bg-gray-800/80 backdrop-blur-md rounded-lg animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-60 bg-gray-800/80 backdrop-blur-md rounded-lg animate-pulse"></div>
          <div className="h-60 bg-gray-800/80 backdrop-blur-md rounded-lg animate-pulse"></div>
          <div className="h-60 bg-gray-800/80 backdrop-blur-md rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <motion.button
          onClick={onBackClick}
          className="flex items-center text-gray-400 hover:text-white mb-6"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </motion.button>
        
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!coin) return null;

  return (
    <div className="py-8">
      <motion.button
        onClick={onBackClick}
        className="flex items-center text-gray-400 hover:text-white mb-6"
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </motion.button>
      
      <motion.div 
        className="bg-gray-800/80 backdrop-blur-md rounded-lg p-6 mb-6 border border-gray-700 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src={coin.iconUrl} 
              alt={coin.name} 
              className="w-12 h-12 mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {coin.name} 
                <span className="text-gray-400 ml-2 text-lg">{coin.symbol}</span>
              </h1>
              <p className="text-gray-400">Rank #{coin.rank}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-mono font-medium">
              {formatCurrency(parseFloat(coin.price))}
            </div>
            <div 
              className={`inline-flex items-center ${
                parseFloat(coin.change) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {parseFloat(coin.change) >= 0 ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              {formatPercentage(parseFloat(coin.change))}
              <span className="ml-1 text-gray-400">({timePeriod})</span>
            </div>
          </div>
        </div>
        
        <div className="h-72">
          {history && (
            <PriceChart 
              history={history.history} 
              change={parseFloat(coin.change)}
              timePeriod={timePeriod}
            />
          )}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium">Market Stats</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Market Cap</span>
              <span className="font-mono">{formatLargeNumber(parseFloat(coin.marketCap))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">24h Volume</span>
              <span className="font-mono">{formatLargeNumber(parseFloat(coin.volume24h) || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Circulating Supply</span>
              <span className="font-mono">
                {coin.supply?.circulating 
                  ? `${Number(coin.supply.circulating).toLocaleString()} ${coin.symbol}`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Total Supply</span>
              <span className="font-mono">
                {coin.supply?.total 
                  ? `${Number(coin.supply.total).toLocaleString()} ${coin.symbol}`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">All-time High</span>
              <span className="font-mono">
                {coin.allTimeHigh?.price 
                  ? formatCurrency(parseFloat(coin.allTimeHigh.price))
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium">About {coin.name}</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-300 text-sm leading-relaxed max-h-72 overflow-y-auto pr-2">
              {coin.description || `No description available for ${coin.name}.`}
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-medium">Additional Information</h2>
          </div>
          <div className="p-6">
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Number of Markets</span>
              <span className="font-mono">{coin.numberOfMarkets || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Number of Exchanges</span>
              <span className="font-mono">{coin.numberOfExchanges || 'N/A'}</span>
            </div>
            {coin.allTimeHigh && (
              <div className="flex justify-between py-2 border-b border-gray-700/50">
                <span className="text-gray-400">ATH Date</span>
                <span className="font-mono">
                  {formatDate(coin.allTimeHigh.timestamp) || 'N/A'}
                </span>
              </div>
            )}
            {coin.listedAt && (
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Listed At</span>
                <span className="font-mono">{formatDate(coin.listedAt) || 'N/A'}</span>
              </div>
            )}
          </div>
          
          {coin.links && coin.links.length > 0 && (
            <>
              <div className="px-6 py-3 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Links</h3>
              </div>
              <div className="px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                  {coin.links.slice(0, 5).map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-900/50 rounded-full text-xs text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink size={10} className="mr-1" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CoinDetails;