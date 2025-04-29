const API_KEY = import.meta.env.VITE_COINRANKING_API_KEY;
const BASE_URL = 'https://api.coinranking.com/v2';

const headers = {
  'x-access-token': API_KEY,
};

export const fetchCoins = async (limit = 50, offset = 0, timePeriod = '24h') => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins?limit=${limit}&offset=${offset}&timePeriod=${timePeriod}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};

export const fetchCoinDetails = async (coinId) => {
  try {
    const response = await fetch(`${BASE_URL}/coin/${coinId}`, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

export const fetchCoinHistory = async (coinId, timePeriod = '24h') => {
  try {
    const response = await fetch(
      `${BASE_URL}/coin/${coinId}/history?timePeriod=${timePeriod}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coin history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin history:', error);
    throw error;
  }
};

export const searchCoins = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins?search=${query}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search coins');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};