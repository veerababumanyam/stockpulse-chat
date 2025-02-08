export const fetchStockData = async (query: string, apiKey: string) => {
  try {
    if (!apiKey) {
      throw new Error('FMP API key is missing');
    }

    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanQuery.split(' ');
    const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

    console.log('Searching for:', searchTerm);

    // Only fetch essential data in parallel
    const [searchResponse, quoteData] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKey}`),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${searchTerm}?apikey=${apiKey}`)
    ]);

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch search results');
    }

    const searchResults = await searchResponse.json();
    if (!searchResults || searchResults.length === 0) {
      throw new Error('No results found for the given search term');
    }

    const symbol = searchResults[0].symbol;
    console.log('Found symbol:', symbol);
    
    // Fetch additional data only if needed
    const [profileData, metricsData] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`).then(r => r.json()),
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${apiKey}`).then(r => r.json()),
    ]);

    const quoteResult = await quoteData.json();

    return {
      quote: quoteResult[0],
      profile: profileData[0],
      metrics: metricsData[0] || {},
      ratios: {}, // Simplified to reduce API calls
      analyst: [], // Simplified to reduce API calls
      insider: [],
      upgrades: [],
      technical: [],
      dividend: []
    };

  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export async function fetchStockScreenerResults(criteria: any[]): Promise<any[]> {
  try {
    const savedKeys = localStorage.getItem('apiKeys');
    if (!savedKeys) {
      throw new Error('FMP API key not found');
    }

    const { fmp } = JSON.parse(savedKeys);
    if (!fmp) {
      throw new Error('FMP API key not found');
    }

    // Build base URL with common parameters
    let url = `https://financialmodelingprep.com/api/v3/stock-screener?apikey=${fmp}`;
    
    // Add exchange filter for major exchanges
    url += '&exchange=NYSE,NASDAQ';
    
    // Add trading status filter for active stocks
    url += '&isActivelyTrading=true';
    
    // Process criteria and build query parameters
    criteria.forEach(({ metric, operator, value }) => {
      if (metric === 'sector') {
        url += `&sector=${encodeURIComponent(value)}`;
      } else if (operator === 'between' && Array.isArray(value)) {
        url += `&${metric}MoreThan=${value[0]}&${metric}LessThan=${value[1]}`;
      } else if (operator === 'greater') {
        url += `&${metric}MoreThan=${value}`;
      } else if (operator === 'less') {
        url += `&${metric}LessThan=${value}`;
      }
    });

    console.log('Fetching screener results from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch screening results: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid API response format');
    }

    // Filter and sort results
    const filteredResults = data
      .filter((stock: any) => 
        stock && 
        stock.symbol && 
        stock.companyName && 
        stock.marketCap > 0 &&
        stock.volume > 0
      )
      .sort((a: any, b: any) => b.marketCap - a.marketCap)
      .map((stock: any) => ({
        ...stock,
        change: stock.changesPercentage || 0,
        changePercent: stock.changesPercentage || 0
      }));

    console.log('Filtered results count:', filteredResults.length);
    return filteredResults;
  } catch (error) {
    console.error('Error fetching stock screener results:', error);
    throw error;
  }
}
