import React, { useState, useEffect } from 'react';
import { fetchCoins } from './api/coinranking';
import Header from './components/Header';
import GlobalStats from './components/GlobalStats';
import CoinList from './components/CoinList';
import CoinDetails from './components/CoinDetails';

function App() {
  const [coins, setCoins] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('24h');
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCoins(50, 0, timePeriod);
        setCoins(data.data.coins);
        setStats(data.data.stats);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch cryptocurrency data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time data
    const intervalId = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(intervalId);
  }, [timePeriod]);

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  const handleSelectCoin = (coinId) => {
    setSelectedCoinId(coinId);
  };

  const handleBackToDashboard = () => {
    setSelectedCoinId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="stars"></div>
      <Header 
        onTimePeriodChange={handleTimePeriodChange} 
        timePeriod={timePeriod} 
      />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {error ? (
          <div className="mt-20 text-center">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 inline-block">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        ) : selectedCoinId ? (
          <CoinDetails 
            coinId={selectedCoinId} 
            timePeriod={timePeriod}
            onBackClick={handleBackToDashboard}
          />
        ) : (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Cryptocurrency Dashboard
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Track real-time cryptocurrency prices, market caps, and trends with our advanced analytics dashboard.
              </p>
            </div>

            <GlobalStats stats={stats} isLoading={isLoading} />
            
            <CoinList 
              coins={coins} 
              isLoading={isLoading} 
              onSelectCoin={handleSelectCoin} 
            />
          </>
        )}
      </main>

      <footer className="py-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Data provided by <a href="https://coinranking.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Coinranking</a></p>
          <p className="mt-2">Made by Achuta Lakshith</p>
        </div>
      </footer>
    </div>
  );
}

export default App;