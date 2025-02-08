
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

    // Map query terms to specific sectors
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
      'communication': 'Communication Services',
      'real estate': 'Real Estate'
    };

    // Sector Analysis
    for (const [key, value] of Object.entries(sectorMapping)) {
      if (query_lower.includes(key)) {
        criteria.push({
          metric: 'sector',
          operator: 'equal',
          value: value as any
        });
        break;
      }
    }

    // Market Cap Criteria - More granular ranges
    if (query_lower.includes('mega cap')) {
      criteria.push({
        metric: 'marketCap',
        operator: 'greater',
        value: 200000000000
      });
    } else if (query_lower.includes('large cap')) {
      criteria.push({
        metric: 'marketCap',
        operator: 'between',
        value: [10000000000, 200000000000]
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

    // Growth and Performance Metrics
    if (query_lower.includes('explosive growth') || query_lower.includes('hyper growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 50
      });
      criteria.push({
        metric: 'earningsGrowth',
        operator: 'greater',
        value: 30
      });
    } else if (query_lower.includes('high growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 30
      });
    } else if (query_lower.includes('growing') || query_lower.includes('growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 15
      });
    }

    // Profitability Metrics
    if (query_lower.includes('highly profitable')) {
      criteria.push({
        metric: 'netProfitMargin',
        operator: 'greater',
        value: 25
      });
      criteria.push({
        metric: 'returnOnEquity',
        operator: 'greater',
        value: 20
      });
    } else if (query_lower.includes('profitable')) {
      criteria.push({
        metric: 'netProfitMargin',
        operator: 'greater',
        value: 10
      });
    }

    // Dividend Metrics
    if (query_lower.includes('high dividend')) {
      criteria.push({
        metric: 'dividendYield',
        operator: 'greater',
        value: 4
      });
    } else if (query_lower.includes('dividend')) {
      criteria.push({
        metric: 'dividendYield',
        operator: 'greater',
        value: 1
      });
    }

    // Valuation Metrics
    if (query_lower.includes('undervalued')) {
      criteria.push({
        metric: 'priceToEarningsRatio',
        operator: 'less',
        value: 15
      });
      criteria.push({
        metric: 'priceToBookRatio',
        operator: 'less',
        value: 3
      });
    } else if (query_lower.includes('value')) {
      criteria.push({
        metric: 'priceToEarningsRatio',
        operator: 'less',
        value: 20
      });
    }

    // Volume and Liquidity
    if (query_lower.includes('high volume') || query_lower.includes('liquid')) {
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 1000000
      });
    }

    // Technical Indicators
    if (query_lower.includes('uptrend') || query_lower.includes('bullish')) {
      criteria.push({
        metric: 'pricePercentageChange',
        operator: 'greater',
        value: 5
      });
    } else if (query_lower.includes('downtrend') || query_lower.includes('bearish')) {
      criteria.push({
        metric: 'pricePercentageChange',
        operator: 'less',
        value: -5
      });
    }

    // Risk Metrics
    if (query_lower.includes('low risk') || query_lower.includes('stable')) {
      criteria.push({
        metric: 'beta',
        operator: 'less',
        value: 1
      });
    } else if (query_lower.includes('high risk') || query_lower.includes('volatile')) {
      criteria.push({
        metric: 'beta',
        operator: 'greater',
        value: 1.5
      });
    }

    // Add default criteria if none are specified
    if (criteria.length === 0) {
      criteria.push(
        {
          metric: 'marketCap',
          operator: 'greater',
          value: 100000000 // Minimum $100M market cap
        },
        {
          metric: 'volume',
          operator: 'greater',
          value: 50000 // Minimum 50k daily volume
        }
      );
    }

    console.log('Generated screening criteria:', criteria);
    return criteria;
  } catch (error) {
    console.error('Error generating screening criteria:', error);
    throw error;
  }
}
