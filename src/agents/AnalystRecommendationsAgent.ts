
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

      console.log('Analyst recommendations:', recommendationsData);
      console.log('Analyst estimates:', estimatesData);
      
      // Filter out recommendations with missing essential data
      const latestRecommendations = recommendationsData?.[0] || {};
      
      return {
        type: 'analyst',
        analysis: {
          signals: {
            overallSignal: this.getConsensusRecommendation(latestRecommendations),
          },
          recommendations: {
            strongBuy: latestRecommendations.strongBuy || 0,
            buy: latestRecommendations.buy || 0,
            hold: latestRecommendations.hold || 0,
            sell: latestRecommendations.sell || 0,
            strongSell: latestRecommendations.strongSell || 0
          },
          consensus: this.getConsensusRecommendation(latestRecommendations)
        }
      };
    } catch (error) {
      console.error('Error fetching analyst data:', error);
      return {
        type: 'analyst',
        analysis: {
          signals: {
            overallSignal: 'HOLD'
          },
          recommendations: {},
          consensus: 'HOLD'
        }
      };
    }
  }

  private static getConsensusRecommendation(recommendations: any): string {
    const strongBuy = recommendations.strongBuy || 0;
    const buy = recommendations.buy || 0;
    const hold = recommendations.hold || 0;
    const sell = recommendations.sell || 0;
    const strongSell = recommendations.strongSell || 0;

    const total = strongBuy + buy + hold + sell + strongSell;
    if (total === 0) return 'HOLD';

    const buyRatio = ((strongBuy * 2 + buy) / (total * 2)) * 100;
    const sellRatio = ((strongSell * 2 + sell) / (total * 2)) * 100;

    if (buyRatio > 60) return 'STRONG BUY';
    if (buyRatio > 40) return 'BUY';
    if (sellRatio > 60) return 'STRONG SELL';
    if (sellRatio > 40) return 'SELL';
    return 'HOLD';
  }
}

