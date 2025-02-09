
import { BaseAgent, AnalysisResult } from './BaseAgent';
import { processNewsData, extractKeyHighlights } from './news/utils/newsProcessing';
import { calculateSentiment, calculateSentimentScore, calculateSentimentTrend, calculateSentimentDistribution } from './news/utils/sentimentAnalysis';
import { extractKeywords, identifyTrends } from './news/utils/trendAnalysis';
import { determineSignal, calculateImpactConfidence, identifyKeyFactors } from './news/utils/marketImpact';

export class NewsAnalysisAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const newsResponse = await this.fetchData(
        `https://financialmodelingprep.com/api/v3/stock_news?tickers=${symbol}&limit=50&apikey=${fmp}`,
        fmp
      );

      const processedNews = processNewsData(newsResponse);
      const sentiments = processedNews.map(news => news.sentiment);
      const recentSentiments = sentiments.slice(0, 10);
      const olderSentiments = sentiments.slice(10);

      const sentimentAnalysis = {
        score: calculateSentimentScore(sentiments),
        trend: calculateSentimentTrend(recentSentiments, olderSentiments),
        confidence: this.calculateConfidenceScore(processedNews.length),
        distribution: calculateSentimentDistribution(sentiments)
      };

      const trendsAnalysis = identifyTrends(
        extractKeywords(processedNews),
        processedNews
      );

      const significantNews = processedNews.filter(news => 
        Math.abs(news.sentiment.score) > 0.5
      );

      const marketImpact = {
        signal: determineSignal(sentimentAnalysis, significantNews),
        confidence: calculateImpactConfidence(sentimentAnalysis, significantNews),
        keyFactors: identifyKeyFactors(significantNews)
      };

      return {
        type: 'news-analysis',
        analysis: {
          sentimentAnalysis,
          trendsAnalysis,
          marketImpact,
          keyHighlights: extractKeyHighlights(processedNews)
        }
      };
    } catch (error) {
      console.error('Error in news analysis:', error);
      return {
        type: 'news-analysis',
        analysis: {
          sentimentAnalysis: { score: 0, trend: 'neutral' },
          trendsAnalysis: [],
          marketImpact: { signal: 'neutral', confidence: 0 },
          keyHighlights: []
        }
      };
    }
  }

  private static calculateConfidenceScore(sampleSize: number): number {
    let confidence = 50;
    confidence += Math.min(sampleSize * 2, 30);
    return Math.min(confidence, 100);
  }
}
