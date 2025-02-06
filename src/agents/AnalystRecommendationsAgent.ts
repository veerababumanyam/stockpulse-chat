
export class AnalystRecommendationsAgent {
  static async analyze(symbol: string) {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [recommendationsResponse, estimatesResponse] = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/analyst-stock-recommendations/${symbol}?apikey=${fmp}`),
        fetch(`https://financialmodelingprep.com/api/v3/analyst-estimates/${symbol}?apikey=${fmp}`)
      ]);

      if (!recommendationsResponse.ok || !estimatesResponse.ok) {
        throw new Error('Failed to fetch analyst data');
      }

      const [recommendationsData, estimatesData] = await Promise.all([
        recommendationsResponse.json(),
        estimatesResponse.json()
      ]);
      
      // Filter out recommendations with missing essential data
      const filteredRecommendations = (recommendationsData || [])
        .filter((rec: any) => rec.date && (rec.recommendation || rec.targetPrice))
        .slice(0, 5)
        .map((rec: any) => ({
          date: new Date(rec.date).toLocaleDateString(),
          company: rec.analyst || rec.analystCompany || 'Unknown Analyst',
          recommendation: rec.recommendation || 'No Recommendation',
          targetPrice: rec.priceTarget
        }));

      // Filter out estimates with missing essential data
      const filteredEstimates = (estimatesData || [])
        .filter((est: any) => est.date && (est.estimatedEps || est.estimatedRevenue))
        .slice(0, 3)
        .map((est: any) => ({
          date: new Date(est.date).toLocaleDateString(),
          estimatedEPS: est.estimatedEps,
          actualEPS: est.actualEps,
          estimatedRevenue: est.estimatedRevenue,
          actualRevenue: est.actualRevenue
        }));
      
      return {
        type: 'analyst',
        analysis: {
          recommendations: filteredRecommendations,
          estimates: filteredEstimates,
          consensus: filteredRecommendations.length > 0 
            ? this.getConsensusRecommendation(recommendationsData)
            : 'No analyst recommendations available'
        }
      };
    } catch (error) {
      console.error('Error fetching analyst data:', error);
      return {
        type: 'analyst',
        analysis: {
          recommendations: [],
          estimates: [],
          consensus: 'Unable to fetch analyst data'
        }
      };
    }
  }

  private static getConsensusRecommendation(recommendations: any[]): string {
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      return 'No consensus available';
    }

    const counts = {
      buy: 0,
      sell: 0,
      hold: 0
    };
    
    recommendations.forEach((rec: any) => {
      const recommendation = (rec.recommendation || '').toLowerCase();
      if (recommendation.includes('buy') || recommendation.includes('strong buy')) counts.buy++;
      else if (recommendation.includes('sell') || recommendation.includes('strong sell')) counts.sell++;
      else if (recommendation.includes('hold') || recommendation.includes('neutral')) counts.hold++;
    });
    
    const total = counts.buy + counts.sell + counts.hold;
    if (total === 0) return 'No consensus available';

    const buyPercentage = (counts.buy / total) * 100;
    const sellPercentage = (counts.sell / total) * 100;
    
    if (buyPercentage > 60) return 'Strong Buy';
    if (buyPercentage > 40) return 'Buy';
    if (sellPercentage > 60) return 'Strong Sell';
    if (sellPercentage > 40) return 'Sell';
    return 'Hold';
  }
}
