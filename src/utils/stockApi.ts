
import { supabase } from "@/integrations/supabase/client";

export const fetchStockData = async (query: string) => {
  try {
    // Get FMP API key from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to use the stock API');
    }

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service', 'fmp')
      .maybeSingle();

    if (apiKeyError) {
      throw new Error('Error fetching API key from database');
    }

    if (!apiKeyData) {
      throw new Error('FMP API key is missing. Please set up your API key in the API Keys page');
    }

    const apiKey = apiKeyData.api_key;

    if (apiKey.startsWith('hf_')) {
      throw new Error('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key. Visit https://site.financialmodelingprep.com/developer to get your API key.');
    }

    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanQuery.split(' ');
    const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

    console.log('Searching for:', searchTerm);

    // Test the API key first
    const testResponse = await fetch(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${apiKey}`);
    const testData = await testResponse.json();

    if (testResponse.status === 401 || testResponse.status === 403) {
      if (testData?.["Error Message"]?.includes("Invalid API KEY")) {
        throw new Error('Invalid FMP API key. Please check your API key or get a new one at https://site.financialmodelingprep.com/developer');
      }
      if (testData?.["Error Message"]?.includes("suspended")) {
        throw new Error('Your FMP API key is suspended. Please check your account status at financialmodelingprep.com');
      }
      throw new Error('API key validation failed. Please check your FMP API key.');
    }

    // First, get the correct symbol from search
    const searchResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKey}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch search results');
    }

    const searchResults = await searchResponse.json();
    if (!searchResults || searchResults.length === 0) {
      throw new Error('No results found for the given search term');
    }

    const symbol = searchResults[0].symbol;
    console.log('Found symbol:', symbol);

    // Now fetch all data for the correct symbol
    const [quoteData, profileData, metricsData] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`).then(r => r.json()),
      fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`).then(r => r.json()),
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${apiKey}`).then(r => r.json()),
    ]);

    if (!quoteData || quoteData.length === 0) {
      throw new Error(`No quote data found for symbol ${symbol}`);
    }

    if (!profileData || profileData.length === 0) {
      throw new Error(`No profile data found for symbol ${symbol}`);
    }

    return {
      quote: quoteData[0],
      profile: profileData[0],
      metrics: metricsData[0] || {},
      ratios: {}, // Simplified to reduce API calls
      analyst: [], // Simplified to reduce API calls
      insider: [],
      upgrades: [],
      technical: []
    };

  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export async function fetchStockScreenerResults(criteria: any[]): Promise<any[]> {
  try {
    // Get FMP API key from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to use the stock screener');
    }

    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('api_key')
      .eq('service', 'fmp')
      .maybeSingle();

    if (apiKeyError) {
      throw new Error('Error fetching API key from database');
    }

    if (!apiKeyData) {
      throw new Error('FMP API key not found. Please set up your API key in the API Keys page');
    }

    const fmp = apiKeyData.api_key;

    if (fmp.startsWith('hf_')) {
      throw new Error('Invalid API key format. Please provide a valid Financial Modeling Prep (FMP) API key.');
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
      const errorData = await response.json();
      if (errorData?.["Error Message"]?.includes("Invalid API KEY")) {
        throw new Error('Invalid FMP API key. Please check your API key or get a new one at https://site.financialmodelingprep.com/developer');
      }
      throw new Error(`Failed to fetch screening results: ${response.statusText}`);
    }

    const screenerData = await response.json();
    
    if (!Array.isArray(screenerData)) {
      console.error('Unexpected API response format:', screenerData);
      throw new Error('Invalid API response format');
    }

    // Filter and sort results
    const filteredResults = screenerData
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
