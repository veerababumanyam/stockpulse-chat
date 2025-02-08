
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

    // Create a comprehensive system prompt for the LLM
    const systemPrompt = `
    You are a financial expert AI that converts natural language stock screening requirements into technical screening criteria.
    Analyze the query and extract precise screening parameters.
    Output should be a JSON array of criteria objects with properties:
    - metric: The FMP API parameter name
    - operator: "greater", "less", "equal", or "between"
    - value: number or [min, max] array for "between" operator
    
    Common translations:
    Market Cap:
    - "large cap" → marketCapMoreThan=10000000000
    - "mid cap" → marketCapBetween=[2000000000,10000000000]
    - "small cap" → marketCapLessThan=2000000000

    Growth:
    - "high growth" → revenueGrowthQuarterlyYoy>20
    - "rapid growth" → revenueGrowthQuarterlyYoy>30
    - "hyper growth" → revenueGrowthQuarterlyYoy>50

    Profitability:
    - "profitable" → netIncomeGrowth>0
    - "highly profitable" → netProfitMargin>20
    - "improving profits" → netIncomeGrowth>10

    Dividends:
    - "dividend paying" → dividendYield>0
    - "high dividend" → dividendYield>3
    - "dividend growth" → dividendGrowth>0

    Valuation:
    - "undervalued" → priceToEarningsRatio<15
    - "value stock" → priceToBookRatio<1
    - "cheap stock" → priceToEarningsRatio<10

    Sectors:
    - "tech" or "technology" → sector=Technology
    - "healthcare" → sector=Healthcare
    - "financial" → sector=Financial
    
    Only use valid FMP API parameters.
    `;

    // For now, using enhanced keyword mapping (TODO: Replace with actual LLM integration)
    const criteria: ScreeningCriteria[] = [];
    const query_lower = query.toLowerCase();

    // Market Cap
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

    // Growth
    if (query_lower.includes('hyper growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 50
      });
    } else if (query_lower.includes('rapid growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 30
      });
    } else if (query_lower.includes('high growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 20
      });
    }

    // Profitability
    if (query_lower.includes('highly profitable')) {
      criteria.push({
        metric: 'netProfitMargin',
        operator: 'greater',
        value: 20
      });
    } else if (query_lower.includes('improving profits')) {
      criteria.push({
        metric: 'netIncomeGrowth',
        operator: 'greater',
        value: 10
      });
    } else if (query_lower.includes('profitable')) {
      criteria.push({
        metric: 'netIncomeGrowth',
        operator: 'greater',
        value: 0
      });
    }

    // Dividends
    if (query_lower.includes('high dividend')) {
      criteria.push({
        metric: 'dividendYield',
        operator: 'greater',
        value: 3
      });
    } else if (query_lower.includes('dividend')) {
      criteria.push({
        metric: 'dividendYield',
        operator: 'greater',
        value: 0
      });
    }

    // Valuation
    if (query_lower.includes('undervalued')) {
      criteria.push({
        metric: 'priceToEarningsRatio',
        operator: 'less',
        value: 15
      });
    } else if (query_lower.includes('value stock')) {
      criteria.push({
        metric: 'priceToBookRatio',
        operator: 'less',
        value: 1
      });
    }

    // Sectors
    if (query_lower.includes('tech') || query_lower.includes('technology')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Technology' as any
      });
    } else if (query_lower.includes('healthcare')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Healthcare' as any
      });
    } else if (query_lower.includes('financial')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Financial' as any
      });
    }

    return criteria;
  } catch (error) {
    console.error('Error generating screening criteria:', error);
    throw error;
  }
}
