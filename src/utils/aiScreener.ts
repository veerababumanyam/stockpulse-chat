
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

    // Market Cap Classifications
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

    // Growth & Performance
    if (query_lower.includes('high growth') || query_lower.includes('fast growing')) {
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
        value: 0
      });
    }

    // Sector Mapping with Granular Control
    const sectorMapping: { [key: string]: string } = {
      'tech': 'Technology',
      'technology': 'Technology',
      'healthcare': 'Healthcare',
      'health': 'Healthcare',
      'finance': 'Financial',
      'financial': 'Financial',
      'consumer': 'Consumer Defensive',
      'retail': 'Consumer Cyclical',
      'energy': 'Energy',
      'industrial': 'Industrial',
      'materials': 'Basic Materials',
      'utilities': 'Utilities',
      'real estate': 'Real Estate',
      'telecom': 'Communication Services'
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

    // Value Metrics
    if (query_lower.includes('undervalued') || query_lower.includes('cheap')) {
      criteria.push({
        metric: 'priceToEarningsRatio',
        operator: 'less',
        value: 15
      });
    }

    // Volume/Liquidity
    if (query_lower.includes('high volume') || query_lower.includes('liquid')) {
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 500000
      });
    }

    // Performance Metrics
    if (query_lower.includes('momentum') || query_lower.includes('performing')) {
      criteria.push({
        metric: 'beta',
        operator: 'greater',
        value: 1
      });
    }

    // Add default criteria if none specified
    if (criteria.length === 0) {
      criteria.push({
        metric: 'marketCap',
        operator: 'greater',
        value: 100000000 // Basic minimum market cap filter
      });
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 10000 // Basic minimum volume filter
      });
    }

    console.log('Generated screening criteria:', criteria);
    return criteria;
  } catch (error) {
    console.error('Error generating criteria:', error);
    throw error;
  }
}
