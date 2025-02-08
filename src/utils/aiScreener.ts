
type ScreeningCriteria = {
  metric: string;
  operator: 'greater' | 'less' | 'equal' | 'between';
  value: number | [number, number];
};

export async function generateScreeningCriteria(query: string): Promise<ScreeningCriteria[]> {
  try {
    const savedKeys = localStorage.getItem('apiKeys');
    if (!savedKeys) {
      throw new Error('API keys not found. Please set up your API keys in the settings.');
    }

    const { fmp } = JSON.parse(savedKeys);
    if (!fmp) {
      throw new Error('FMP API key not found. Please add your Financial Modeling Prep API key in settings.');
    }

    const query_lower = query.toLowerCase();
    const criteria: ScreeningCriteria[] = [];

    // Market Cap Criteria
    if (query_lower.includes('large cap')) {
      criteria.push({
        metric: 'marketCap',
        operator: 'greater',
        value: 10000000000
      });
    } else if (query_lower.includes('mid cap')) {
      criteria.push({
        metric: 'marketCap',
        operator: 'between',
        value: [2000000000, 10000000000]
      });
    } else if (query_lower.includes('small cap')) {
      criteria.push({
        metric: 'marketCap',
        operator: 'less',
        value: 2000000000
      });
    }

    // Sector-based filtering
    const sectorMapping: { [key: string]: string } = {
      'tech': 'Technology',
      'technology': 'Technology',
      'healthcare': 'Healthcare',
      'health': 'Healthcare',
      'finance': 'Financial',
      'financial': 'Financial',
      'consumer': 'Consumer Defensive',
      'retail': 'Consumer Cyclical'
    };

    for (const [key, value] of Object.entries(sectorMapping)) {
      if (query_lower.includes(key)) {
        criteria.push({
          metric: 'sector',
          operator: 'equal',
          value: value as any
        });
      }
    }

    // Performance and Growth Metrics
    if (query_lower.includes('high growth')) {
      criteria.push({
        metric: 'revenueGrowth',
        operator: 'greater',
        value: 20
      });
    }

    if (query_lower.includes('profitable')) {
      criteria.push({
        metric: 'netProfitMargin',
        operator: 'greater',
        value: 10
      });
    }

    // Value Metrics
    if (query_lower.includes('undervalued')) {
      criteria.push({
        metric: 'priceToEarningsRatio',
        operator: 'less',
        value: 15
      });
    }

    // Volume/Liquidity
    if (query_lower.includes('high volume')) {
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 500000
      });
    }

    // Add default criteria if none specified
    if (criteria.length === 0) {
      criteria.push({
        metric: 'marketCap',
        operator: 'greater',
        value: 100000000 // Minimum market cap
      });
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 10000 // Minimum volume
      });
    }

    console.log('Generated criteria:', criteria);
    return criteria;
  } catch (error) {
    console.error('Error generating criteria:', error);
    throw error;
  }
}
