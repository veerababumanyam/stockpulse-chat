
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
      
      const [quoteResponse, profileResponse] = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKey}`),
        fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKey}`)
      ]);

      const [quoteData, profileData] = await Promise.all([
        quoteResponse.json(),
        profileResponse.json()
      ]);

      if (quoteData[0] && profileData[0]) {
        return {
          quote: quoteData[0],
          profile: profileData[0]
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Failed to fetch stock data');
  }
};
