
export class AnalystRecommendationsAgent {
  static async analyze(symbol: string) {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Fetch both recommendations and estimates in parallel
      const [recommendationsResponse, estimatesResponse] = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/analyst-stock-recommendations/${symbol}?apikey=${fmp}`),
        fetch(`https://financialmodelingprep.com/api/v3/analyst-estimates/${symbol}?apikey=${fmp}`)
      ]);

      if (!recommendationsResponse.ok) {
        const errorData = await recommendationsResponse.json();
        throw new Error(errorData.Error || 'Failed to fetch analyst recommendations');
      }

      if (!estimatesResponse.ok) {
        const errorData = await estimatesResponse.json();
        throw new Error(errorData.Error || 'Failed to fetch analyst estimates');
      }

      const [recommendationsData, estimatesData] = await Promise.all([
        recommendationsResponse.json(),
        estimatesResponse.json()
      ]);
      
      if (!Array.isArray(recommendationsData) || recommendationsData.length === 0) {
        return {
          type: 'analyst',
          analysis: {
            recommendations: [],
            estimates: [],
            consensus: 'No analyst data available'
          }
        };
      }
      
      return {
        type: 'analyst',
        analysis: {
          recommendations: recommendationsData.slice(0, 5).map((rec: any) => ({
            date: new Date(rec.date).toLocaleDateString(),
            company: rec.analyst || rec.analystCompany,
            recommendation: rec.recommendation,
            targetPrice: rec.priceTarget
          })),
          estimates: estimatesData.slice(0, 3).map((est: any) => ({
            date: new Date(est.date).toLocaleDateString(),
            estimatedEPS: est.estimatedEps,
            actualEPS: est.actualEps,
            estimatedRevenue: est.estimatedRevenue,
            actualRevenue: est.actualRevenue
          })),
          consensus: this.getConsensusRecommendation(recommendationsData)
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
    const counts = {
      buy: 0,
      sell: 0,
      hold: 0
    };
    
    recommendations.forEach((rec: any) => {
      const recommendation = (rec.recommendation || '').toLowerCase();
      if (recommendation.includes('buy') || recommendation.includes('strong buy')) counts.buy++;
      else if (recommendation.includes('sell') || recommendation.includes('strong sell')) counts.sell++;
      else counts.hold++;
    });
    
    const total = counts.buy + counts.sell + counts.hold;
    const buyPercentage = (counts.buy / total) * 100;
    const sellPercentage = (counts.sell / total) * 100;
    
    if (buyPercentage > 60) return 'Strong Buy';
    if (buyPercentage > 40) return 'Buy';
    if (sellPercentage > 60) return 'Strong Sell';
    if (sellPercentage > 40) return 'Sell';
    return 'Hold';
  }
}
