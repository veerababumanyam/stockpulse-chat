
const BASE_URL = 'https://query2.finance.yahoo.com/v8/finance';

export const fetchYahooStockData = async (symbol: string) => {
  try {
    const response = await fetch(`${BASE_URL}/chart/${symbol}?interval=1d&range=1d`);
    if (!response.ok) {
      throw new Error('Failed to fetch Yahoo Finance data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    throw error;
  }
};

export const fetchYahooQuotes = async (symbols: string[]) => {
  try {
    const response = await fetch(`${BASE_URL}/quote?symbols=${symbols.join(',')}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Yahoo Finance quotes');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Yahoo Finance API error:', error);
    throw error;
  }
};
