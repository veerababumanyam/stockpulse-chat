
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

    // Growth Metrics
    if (query_lower.includes('explosive growth') || query_lower.includes('hyper growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 50
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

    // Profitability
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

    // Dividends
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

    // Valuation
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
    } else if (query_lower.includes('value stock')) {
      criteria.push({
        metric: 'priceToEarningsRatio',
        operator: 'less',
        value: 20
      });
    }

    // Sectors
    if (query_lower.includes('tech') || query_lower.includes('technology')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Technology' as any
      });
    } else if (query_lower.includes('healthcare') || query_lower.includes('health')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Healthcare' as any
      });
    } else if (query_lower.includes('finance') || query_lower.includes('financial')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Financial' as any
      });
    }

    // Performance & Momentum
    if (query_lower.includes('outperforming') || query_lower.includes('top performing')) {
      criteria.push({
        metric: 'performanceHalfYear',
        operator: 'greater',
        value: 15
      });
    }
    
    // Volume & Liquidity
    if (query_lower.includes('high volume') || query_lower.includes('liquid')) {
      criteria.push({
        metric: 'volume',
        operator: 'greater',
        value: 1000000
      });
    }

    // Volatility & Beta
    if (query_lower.includes('low volatility') || query_lower.includes('stable')) {
      criteria.push({
        metric: 'beta',
        operator: 'less',
        value: 1
      });
    } else if (query_lower.includes('high volatility')) {
      criteria.push({
        metric: 'beta',
        operator: 'greater',
        value: 1.5
      });
    }

    // If no criteria matched, add some basic filters
    if (criteria.length === 0) {
      criteria.push(
        {
          metric: 'marketCap',
          operator: 'greater',
          value: 100000000 // Min $100M market cap
        },
        {
          metric: 'volume',
          operator: 'greater',
          value: 50000 // Min 50k daily volume
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
