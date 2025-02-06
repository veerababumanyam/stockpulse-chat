
import { ResultFormatter } from './ResultFormatter';
import { SignalAnalyzer } from './SignalAnalyzer';
import { generatePricePrediction } from './pricePrediction';

export class OutputFormatter {
  private static formatHighlight(text: string): string {
    return `*** ${text} ***`;
  }

  static formatOutput(data: any): any {
    const consolidatedSignal = SignalAnalyzer.getConsolidatedSignal(data);
    const currentPrice = data.results.technical?.data?.analysis?.priceAction?.currentPrice || 0;
    
    const priceProjections = {
      threeMonths: generatePricePrediction(currentPrice, 3, 90),
      sixMonths: generatePricePrediction(currentPrice, 6, 85),
      twelveMonths: generatePricePrediction(currentPrice, 12, 80),
      twentyFourMonths: generatePricePrediction(currentPrice, 24, 75)
    };

    const formattedData = {
      symbol: data.symbol,
      companyName: data.companyName,
      recommendation: consolidatedSignal,
      confidenceScore: this.calculateOverallConfidence(data),
      priceProjections: {
        threeMonths: priceProjections.threeMonths.price,
        sixMonths: priceProjections.sixMonths.price,
        twelveMonths: priceProjections.twelveMonths.price,
        twentyFourMonths: priceProjections.twentyFourMonths.price
      },
      results: data.results
    };

    const textOutput = `
📊 Analysis Report for ${data.companyName} (${data.symbol})

🎯 CONSOLIDATED RECOMMENDATION
============================
${this.formatHighlight(consolidatedSignal)}
Confidence Score: ${formattedData.confidenceScore}%

📈 PRICE PROJECTIONS
============================
3 Months: $${priceProjections.threeMonths.price} (Confidence: ${priceProjections.threeMonths.confidence}%)
6 Months: $${priceProjections.sixMonths.price} (Confidence: ${priceProjections.sixMonths.confidence}%)
12 Months: $${priceProjections.twelveMonths.price} (Confidence: ${priceProjections.twelveMonths.confidence}%)
24 Months: $${priceProjections.twentyFourMonths.price} (Confidence: ${priceProjections.twentyFourMonths.confidence}%)

📈 TECHNICAL ANALYSIS
============================
${ResultFormatter.formatSection(data.results.technical?.data, 'Technical indicators and price action')}

💰 FUNDAMENTAL ANALYSIS
============================
${ResultFormatter.formatSection(data.results.fundamental?.data, 'Financial health and metrics')}

📊 SENTIMENT ANALYSIS
============================
${ResultFormatter.formatSection(data.results.sentiment?.data, 'Market sentiment indicators')}

⚠️ RISK ASSESSMENT
============================
${ResultFormatter.formatSection(data.results.risk?.data, 'Risk factors and metrics')}

💎 VALUATION ANALYSIS
============================
${ResultFormatter.formatSection(data.results.valuation?.data, 'Fair value assessment')}

📈 FORECASTING
============================
${ResultFormatter.formatSection(data.results.timeSeries?.data, 'Time series predictions')}

🔄 DOWNLOAD REPORT
============================
Use the "Download PDF" button below to save a detailed report.`;

    return { textOutput, formattedData };
  }

  private static calculateOverallConfidence(data: any): number {
    let totalConfidence = 0;
    let validIndicators = 0;

    // Technical Analysis Confidence
    if (data.results.technical?.data?.analysis?.confidenceScore) {
      totalConfidence += data.results.technical.data.analysis.confidenceScore;
      validIndicators++;
    }

    // Fundamental Analysis Confidence
    if (data.results.fundamental?.data?.analysis?.confidenceScore) {
      totalConfidence += data.results.fundamental.data.analysis.confidenceScore;
      validIndicators++;
    }

    // Sentiment Analysis Confidence
    if (data.results.sentiment?.data?.analysis?.confidenceScore) {
      totalConfidence += data.results.sentiment.data.analysis.confidenceScore;
      validIndicators++;
    }

    return validIndicators > 0 
      ? Math.round(totalConfidence / validIndicators) 
      : 70; // Default confidence score
  }
}
