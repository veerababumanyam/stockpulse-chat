
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class InsiderTradingAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const insiderTrades = await this.fetchData(
        `https://financialmodelingprep.com/api/v4/insider-trading?symbol=${symbol}&limit=100&apikey=${fmp}`,
        fmp
      );

      return {
        type: 'insider-trading',
        analysis: {
          recentTransactions: this.analyzeRecentTransactions(insiderTrades),
          tradingPatterns: this.identifyTradingPatterns(insiderTrades),
          insightsSummary: this.generateInsightsSummary(insiderTrades)
        }
      };
    } catch (error) {
      console.error('Error in insider trading analysis:', error);
      return {
        type: 'insider-trading',
        analysis: {
          recentTransactions: [],
          tradingPatterns: {},
          insightsSummary: {}
        }
      };
    }
  }

  private static analyzeRecentTransactions(trades: any[]): any[] {
    if (!Array.isArray(trades)) return [];

    return trades
      .slice(0, 10)
      .map(trade => ({
        date: this.formatDate(trade.transactionDate),
        insider: trade.insiderName,
        position: trade.position,
        transactionType: trade.transactionType,
        shares: trade.numberOfShares,
        value: this.formatNumber(trade.transactionPrice * trade.numberOfShares)
      }));
  }

  private static identifyTradingPatterns(trades: any[]): any {
    if (!Array.isArray(trades)) return {};

    const buyCount = trades.filter(t => t.transactionType === 'BUY').length;
    const sellCount = trades.filter(t => t.transactionType === 'SELL').length;
    const totalValue = trades.reduce((sum, t) => sum + (t.transactionPrice * t.numberOfShares), 0);

    return {
      buyToSellRatio: buyCount / (sellCount || 1),
      transactionFrequency: this.calculateTransactionFrequency(trades),
      averageTransactionSize: totalValue / (trades.length || 1),
      dominantPattern: buyCount > sellCount ? 'Accumulation' : 'Distribution'
    };
  }

  private static generateInsightsSummary(trades: any[]): any {
    if (!Array.isArray(trades)) return {};

    const recentActivity = trades.slice(0, 30);
    const buyValue = recentActivity
      .filter(t => t.transactionType === 'BUY')
      .reduce((sum, t) => sum + (t.transactionPrice * t.numberOfShares), 0);
    const sellValue = recentActivity
      .filter(t => t.transactionType === 'SELL')
      .reduce((sum, t) => sum + (t.transactionPrice * t.numberOfShares), 0);

    return {
      netPosition: buyValue - sellValue,
      sentiment: this.calculateInsiderSentiment(recentActivity),
      significantTransactions: this.identifySignificantTransactions(recentActivity),
      recommendedActions: this.generateRecommendations(recentActivity)
    };
  }

  private static calculateTransactionFrequency(trades: any[]): string {
    if (trades.length === 0) return 'No recent activity';
    
    const daysSpan = Math.ceil(
      (new Date(trades[0].transactionDate).getTime() - 
       new Date(trades[trades.length - 1].transactionDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    
    const frequency = trades.length / (daysSpan || 1);
    
    if (frequency > 0.5) return 'High';
    if (frequency > 0.2) return 'Medium';
    return 'Low';
  }

  private static calculateInsiderSentiment(trades: any[]): string {
    const buyValue = trades
      .filter(t => t.transactionType === 'BUY')
      .reduce((sum, t) => sum + (t.transactionPrice * t.numberOfShares), 0);
    const sellValue = trades
      .filter(t => t.transactionType === 'SELL')
      .reduce((sum, t) => sum + (t.transactionPrice * t.numberOfShares), 0);

    const ratio = buyValue / (sellValue || 1);
    
    if (ratio > 1.5) return 'Very Bullish';
    if (ratio > 1) return 'Bullish';
    if (ratio > 0.5) return 'Neutral';
    return 'Bearish';
  }

  private static identifySignificantTransactions(trades: any[]): any[] {
    const threshold = 1000000; // $1M threshold for significant transactions
    
    return trades
      .filter(t => t.transactionPrice * t.numberOfShares > threshold)
      .map(t => ({
        date: this.formatDate(t.transactionDate),
        insider: t.insiderName,
        type: t.transactionType,
        value: this.formatNumber(t.transactionPrice * t.numberOfShares)
      }));
  }

  private static generateRecommendations(trades: any[]): string[] {
    const sentiment = this.calculateInsiderSentiment(trades);
    const recommendations = [];

    if (sentiment === 'Very Bullish' || sentiment === 'Bullish') {
      recommendations.push(
        'Consider following insider buying patterns',
        'Monitor for continued accumulation'
      );
    } else if (sentiment === 'Bearish') {
      recommendations.push(
        'Exercise caution',
        'Watch for additional selling pressure'
      );
    } else {
      recommendations.push(
        'Monitor insider activity patterns',
        'Wait for clearer signals'
      );
    }

    return recommendations;
  }
}
