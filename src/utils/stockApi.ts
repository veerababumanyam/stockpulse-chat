
export const fetchStockData = async (query: string, apiKey: string) => {
  try {
    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanQuery.split(' ');
    const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

    console.log('Searching for:', searchTerm);

    const searchResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKey}`
    );
    const searchResults = await searchResponse.json();
    
    if (searchResults && searchResults.length > 0) {
      const symbol = searchResults[0].symbol;
      console.log('Found symbol:', symbol);
      
      const [
        quoteResponse,
        profileResponse,
        metricsResponse,
        ratiosResponse,
        analystResponse,
        insiderResponse,
        upgradesResponse,
        technicalResponse,
        dividendResponse,
        earningsResponse
      ] = await Promise.all([
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
      ] = await Promise.all([
        quoteResponse.json(),
        profileResponse.json(),
        metricsResponse.json(),
        ratiosResponse.json(),
        analystResponse.json(),
        insiderResponse.json(),
        upgradesResponse.json(),
        technicalResponse.json(),
        dividendResponse.json(),
        earningsResponse.json()
      ]);

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
    return null;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
};
