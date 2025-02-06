
export const fetchStockData = async (query: string, apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('FMP API key is missing');
    }

    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanQuery.split(' ');
    const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

    console.log('Searching for:', searchTerm);

    // Test the API key and connectivity first
    const testResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/is-the-market-open?apikey=${apiKey}`
    );
    
    if (!testResponse.ok) {
      if (testResponse.status === 403) {
        throw new Error('Invalid or expired FMP API key');
      }
      throw new Error(`FMP API connectivity issue: ${testResponse.statusText}`);
    }

    const searchResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKey}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search for stock');
    }

    const searchResults = await searchResponse.json();
    
    if (!searchResults || searchResults.length === 0) {
      throw new Error('No results found for the given search term');
    }

    const symbol = searchResults[0].symbol;
    console.log('Found symbol:', symbol);
    
    // Create an array of essential API requests first
    const essentialRequests = [
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`)
    ];

    // Wait for essential data first
    const [quoteResponse, profileResponse] = await Promise.all(essentialRequests);
    
    if (!quoteResponse.ok || !profileResponse.ok) {
      throw new Error('Failed to fetch essential stock data');
    }

    const [quoteData, profileData] = await Promise.all([
      quoteResponse.json(),
      profileResponse.json()
    ]);

    // If we have essential data, try to fetch additional data
    const additionalRequests = [
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/analyst-estimates/${symbol}?limit=4&apikey=${apiKey}`),
    ];

    // Use Promise.allSettled to handle partial failures
    const additionalResponses = await Promise.allSettled(additionalRequests);
    
    const [metricsResponse, ratiosResponse, analystResponse] = await Promise.all(
      additionalResponses.map(async (response) => {
        if (response.status === 'fulfilled' && response.value.ok) {
          return response.value.json();
        }
        console.warn('Failed to fetch some additional data');
        return null;
      })
    );

    // Return data with fallbacks for missing information
    return {
      quote: quoteData[0],
      profile: profileData[0],
      metrics: metricsResponse?.[0] || {},
      ratios: ratiosResponse?.[0] || {},
      analyst: analystResponse || [],
      insider: [],
      upgrades: [],
      technical: [],
      dividend: [],
      earnings: []
    };

  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};
