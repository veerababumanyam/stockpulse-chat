
export const fetchStockData = async (query: string, apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('FMP API key is missing');
    }

    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanQuery.split(' ');
    const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

    console.log('Searching for:', searchTerm);

    // Test the API key with a simple request first
    const testResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`
    );
    
    if (!testResponse.ok) {
      if (testResponse.status === 403) {
        throw new Error('Invalid or expired FMP API key');
      }
      throw new Error(`FMP API error: ${testResponse.statusText}`);
    }

    const searchResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKey}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search for stock');
    }

    const searchResults = await searchResponse.json();
    
    if (searchResults && searchResults.length > 0) {
      const symbol = searchResults[0].symbol;
      console.log('Found symbol:', symbol);
      
      // Create an array of promises for parallel requests
      const responses = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/analyst-estimates/${symbol}?limit=4&apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/insider-trading/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/upgrades-downgrades/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/technical_indicator/daily/${symbol}?period=10&type=rsi&apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/earnings-surprises/${symbol}?apikey=${apiKey}`)
      ]);

      // Check if any response failed
      for (const response of responses) {
        if (!response.ok) {
          console.error('API response error:', response.statusText);
          throw new Error(`API request failed: ${response.statusText}`);
        }
      }

      const [
        quoteData,
        profileData,
        metricsData,
        ratiosData,
        analystData,
        insiderData,
        upgradesData,
        technicalData,
        dividendData,
        earningsData
      ] = await Promise.all(responses.map(r => r.json()));

      if (quoteData[0] && profileData[0]) {
        return {
          quote: quoteData[0],
          profile: profileData[0],
          metrics: metricsData[0] || {},
          ratios: ratiosData[0] || {},
          analyst: analystData || [],
          insider: insiderData || [],
          upgrades: upgradesData || [],
          technical: technicalData || [],
          dividend: dividendData.historical || [],
          earnings: earningsData || []
        };
      }
    }
    throw new Error('No results found for the given search term');
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
