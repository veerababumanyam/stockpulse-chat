
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { TechnicalAnalysisAgent } from './TechnicalAnalysisAgent';
import { FundamentalAnalysisAgent } from './FundamentalAnalysisAgent';
import { OrchestratorAgent } from './OrchestratorAgent';

interface BreakoutStock {
  symbol: string;
  companyName: string;
  price: number;
  breakoutSignals: string[];
  confidence: number;
  analysis: {
    technical: any;
    fundamental: any;
    comprehensive: any;
  };
}

export class BreakoutStocksAgent extends BaseAgent {
  static async analyze(): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      // Get market hours data
      const marketHoursResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/market-hours?apikey=${fmp}`
      );
      const marketHours = await marketHoursResponse.json();

      // Check if it's been one hour since market opening
      const now = new Date();
      const marketOpen = new Date(marketHours.marketOpen);
      const oneHourAfterOpen = new Date(marketOpen.getTime() + 60 * 60 * 1000);

      if (now < oneHourAfterOpen) {
        return {
          type: 'breakout-stocks',
          analysis: {
            stocks: [],
            message: 'Market analysis will begin one hour after market opening',
            lastUpdated: now.toISOString()
          }
        };
      }

      // Get all stocks
      const stocksResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/stock/list?apikey=${fmp}`
      );
      const stocks = await stocksResponse.json();

      const breakoutStocks: BreakoutStock[] = [];

      // Analyze each stock
      for (const stock of stocks.slice(0, 100)) { // Limit to first 100 for performance
        const technicalAnalysis = await TechnicalAnalysisAgent.analyze({ quote: stock });
        const fundamentalAnalysis = await FundamentalAnalysisAgent.analyze({ quote: stock });

        // Check for breakout signals
        const hasBreakoutPotential = this.evaluateBreakoutPotential(
          technicalAnalysis,
          fundamentalAnalysis
        );

        if (hasBreakoutPotential.isBreakout) {
          const comprehensiveAnalysis = await OrchestratorAgent.orchestrateAnalysis({
            quote: stock,
            profile: { companyName: stock.name }
          });

          breakoutStocks.push({
            symbol: stock.symbol,
            companyName: stock.name,
            price: stock.price,
            breakoutSignals: hasBreakoutPotential.signals,
            confidence: hasBreakoutPotential.confidence,
            analysis: {
              technical: technicalAnalysis,
              fundamental: fundamentalAnalysis,
              comprehensive: comprehensiveAnalysis
            }
          });
        }
      }

      return {
        type: 'breakout-stocks',
        analysis: {
          stocks: breakoutStocks,
          lastUpdated: now.toISOString()
        }
      };
    } catch (error) {
      console.error('Error in breakout stocks analysis:', error);
      return {
        type: 'breakout-stocks',
        analysis: {
          stocks: [],
          error: 'Failed to analyze breakout stocks',
          lastUpdated: new Date().toISOString()
        }
      };
    }
  }

  private static evaluateBreakoutPotential(technical: any, fundamental: any): {
    isBreakout: boolean;
    signals: string[];
    confidence: number;
  } {
    const signals: string[] = [];
    let confidenceScore = 0;

    // Technical signals
    if (technical?.analysis?.signals?.overallSignal === 'Strong Buy') {
      signals.push('Strong technical buy signal');
      confidenceScore += 30;
    }

    if (technical?.analysis?.volumeAnalysis?.includes('High Volume')) {
      signals.push('Increased trading volume');
      confidenceScore += 20;
    }

    // Fundamental signals
    if (fundamental?.analysis?.summary?.recommendation?.includes('Buy')) {
      signals.push('Strong fundamentals');
      confidenceScore += 25;
    }

    if (fundamental?.analysis?.growthMetrics?.revenueGrowth > 20) {
      signals.push('High revenue growth');
      confidenceScore += 15;
    }

    return {
      isBreakout: signals.length >= 2 && confidenceScore >= 50,
      signals,
      confidence: confidenceScore
    };
  }
}
