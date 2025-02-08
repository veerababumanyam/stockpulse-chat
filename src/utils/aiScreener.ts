
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

    // Sample prompt for the LLM
    const systemPrompt = `
    You are a financial expert AI that converts natural language stock screening requirements into technical screening criteria.
    Output should be a JSON array of criteria objects with properties:
    - metric: The FMP API parameter name
    - operator: "greater", "less", "equal", or "between"
    - value: number or [min, max] array for "between" operator
    
    Common translations:
    - "high growth" → revenueGrowthQuarterlyYoy > 20
    - "profitable" → netIncomeGrowth > 0
    - "dividend paying" → dividendYield > 0
    - "large cap" → marketCap > 10000000000
    - "tech sector" → sector = "Technology"
    
    Only use valid FMP API parameters.
    `;

    // TODO: Replace with actual LLM integration
    // For now, using a simplified keyword mapping
    const criteria: ScreeningCriteria[] = [];
    const query_lower = query.toLowerCase();

    if (query_lower.includes('high growth')) {
      criteria.push({
        metric: 'revenueGrowthQuarterlyYoy',
        operator: 'greater',
        value: 20
      });
    }

    if (query_lower.includes('profitable')) {
      criteria.push({
        metric: 'netIncomeGrowth',
        operator: 'greater',
        value: 0
      });
    }

    if (query_lower.includes('tech') || query_lower.includes('technology')) {
      criteria.push({
        metric: 'sector',
        operator: 'equal',
        value: 'Technology' as any
      });
    }

    if (query_lower.includes('dividend')) {
      criteria.push({
        metric: 'dividendYield',
        operator: 'greater',
        value: 0
      });
    }

    return criteria;
  } catch (error) {
    console.error('Error generating screening criteria:', error);
    throw error;
  }
}
