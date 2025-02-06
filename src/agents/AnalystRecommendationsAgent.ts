
export class AnalystRecommendationsAgent {
  static async analyze(symbol: string) {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/analyst-recommendations/${symbol}?apikey=${fmp}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Error || 'Failed to fetch analyst recommendations');
      }

      const recommendationsData = await response.json();
      
      if (!Array.isArray(recommendationsData) || recommendationsData.length === 0) {
        return {
          type: 'analyst',
          analysis: {
            recommendations: [],
            consensus: 'No analyst recommendations available'
          }
        };
      }
      
      return {
        type: 'analyst',
        analysis: {
          recommendations: recommendationsData.slice(0, 5).map((rec: any) => ({
            date: new Date(rec.date).toLocaleDateString(),
            company: rec.analystCompany,
            recommendation: rec.recommendation,
            targetPrice: rec.targetPrice
          })),
          consensus: this.getConsensusRecommendation(recommendationsData)
        }
      };
    } catch (error) {
      console.error('Error fetching analyst recommendations:', error);
      return {
        type: 'analyst',
        analysis: {
          recommendations: [],
          consensus: 'Unable to fetch analyst recommendations'
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
      const recommendation = rec.recommendation.toLowerCase();
      if (recommendation.includes('buy')) counts.buy++;
      else if (recommendation.includes('sell')) counts.sell++;
      else counts.hold++;
    });
    
    if (counts.buy > counts.sell && counts.buy > counts.hold) return 'Strong Buy';
    if (counts.sell > counts.buy && counts.sell > counts.hold) return 'Strong Sell';
    return 'Hold';
  }
}
