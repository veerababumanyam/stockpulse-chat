
import { BaseAgent, AnalysisResult } from './BaseAgent';

export class SectorRotationAgent extends BaseAgent {
  static async analyze(symbol: string): Promise<AnalysisResult> {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (!savedKeys) {
        throw new Error('API keys not found');
      }
      const { fmp } = JSON.parse(savedKeys);

      const [sectorData, stockProfile] = await Promise.all([
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/sector-performance?apikey=${fmp}`,
          fmp
        ),
        this.fetchData(
          `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${fmp}`,
          fmp
        )
      ]);

      return {
        type: 'sector-rotation',
        analysis: {
          currentPhase: this.determineSectorPhase(sectorData),
          sectorStrength: this.calculateSectorStrength(sectorData),
          rotationIndicators: this.identifyRotationIndicators(sectorData, stockProfile[0]),
          recommendations: this.generateRecommendations(sectorData, stockProfile[0])
        }
      };
    } catch (error) {
      console.error('Error in sector rotation analysis:', error);
      return {
        type: 'sector-rotation',
        analysis: {
          currentPhase: 'Unable to determine sector phase',
          sectorStrength: [],
          rotationIndicators: [],
          recommendations: []
        }
      };
    }
  }

  private static determineSectorPhase(sectorData: any[]): string {
    if (!Array.isArray(sectorData)) return 'Data unavailable';

    const sectorPerformances = sectorData.map(sector => ({
      name: sector.sector,
      performance: parseFloat(sector.changesPercentage)
    }));

    // Analyze sector performance patterns to determine market cycle phase
    const cyclicalSectors = ['Technology', 'Consumer Discretionary', 'Industrials'];
    const defensiveSectors = ['Utilities', 'Consumer Staples', 'Healthcare'];

    const cyclicalPerformance = this.calculateAveragePerformance(sectorPerformances, cyclicalSectors);
    const defensivePerformance = this.calculateAveragePerformance(sectorPerformances, defensiveSectors);

    if (cyclicalPerformance > defensivePerformance + 2) return 'Early Expansion';
    if (cyclicalPerformance > defensivePerformance) return 'Late Expansion';
    if (defensivePerformance > cyclicalPerformance + 2) return 'Contraction';
    return 'Transition';
  }

  private static calculateSectorStrength(sectorData: any[]): string[] {
    if (!Array.isArray(sectorData)) return [];

    return sectorData
      .sort((a, b) => parseFloat(b.changesPercentage) - parseFloat(a.changesPercentage))
      .map(sector => `${sector.sector}: ${parseFloat(sector.changesPercentage).toFixed(2)}% change`);
  }

  private static identifyRotationIndicators(sectorData: any[], stockProfile: any): string[] {
    if (!Array.isArray(sectorData) || !stockProfile) return [];

    const indicators = [];
    const companySector = stockProfile.sector;
    
    const sectorPerformance = sectorData.find(s => s.sector === companySector);
    if (sectorPerformance) {
      const performance = parseFloat(sectorPerformance.changesPercentage);
      if (performance > 5) {
        indicators.push(`Strong momentum in ${companySector} sector`);
      } else if (performance < -5) {
        indicators.push(`Weakness in ${companySector} sector`);
      }
    }

    // Analyze sector relationships
    const sectorRelationships = this.analyzeSectorRelationships(sectorData);
    indicators.push(...sectorRelationships);

    return indicators;
  }

  private static generateRecommendations(sectorData: any[], stockProfile: any): string[] {
    if (!Array.isArray(sectorData) || !stockProfile) return [];

    const recommendations = [];
    const phase = this.determineSectorPhase(sectorData);
    const companySector = stockProfile.sector;

    // Phase-based recommendations
    switch (phase) {
      case 'Early Expansion':
        recommendations.push('Consider increasing exposure to cyclical sectors');
        recommendations.push('Monitor growth opportunities in technology and consumer discretionary');
        break;
      case 'Late Expansion':
        recommendations.push('Consider taking profits in highly valued sectors');
        recommendations.push('Start building positions in defensive sectors');
        break;
      case 'Contraction':
        recommendations.push('Focus on defensive sectors with stable earnings');
        recommendations.push('Monitor for signs of sector rotation into early cycle sectors');
        break;
      case 'Transition':
        recommendations.push('Maintain balanced sector exposure');
        recommendations.push('Watch for emerging sector leadership');
        break;
    }

    // Company-specific recommendations
    const sectorPerf = sectorData.find(s => s.sector === companySector);
    if (sectorPerf) {
      const performance = parseFloat(sectorPerf.changesPercentage);
      if (performance > 5) {
        recommendations.push(`Consider taking profits in ${companySector} positions`);
      } else if (performance < -5) {
        recommendations.push(`Watch for recovery signals in ${companySector}`);
      }
    }

    return recommendations;
  }

  private static calculateAveragePerformance(performances: any[], sectors: string[]): number {
    const relevantPerformances = performances
      .filter(p => sectors.includes(p.name))
      .map(p => p.performance);

    if (relevantPerformances.length === 0) return 0;
    return relevantPerformances.reduce((sum, perf) => sum + perf, 0) / relevantPerformances.length;
  }

  private static analyzeSectorRelationships(sectorData: any[]): string[] {
    const relationships = [];
    
    // Analyze defensive vs cyclical sectors
    const defensiveSectors = sectorData.filter(s => 
      ['Utilities', 'Consumer Staples', 'Healthcare'].includes(s.sector)
    );
    const cyclicalSectors = sectorData.filter(s => 
      ['Technology', 'Consumer Discretionary', 'Industrials'].includes(s.sector)
    );

    const defensiveAvg = this.calculateAveragePerformance(
      defensiveSectors.map(s => ({ name: s.sector, performance: parseFloat(s.changesPercentage) })),
      ['Utilities', 'Consumer Staples', 'Healthcare']
    );

    const cyclicalAvg = this.calculateAveragePerformance(
      cyclicalSectors.map(s => ({ name: s.sector, performance: parseFloat(s.changesPercentage) })),
      ['Technology', 'Consumer Discretionary', 'Industrials']
    );

    if (Math.abs(cyclicalAvg - defensiveAvg) > 3) {
      relationships.push(
        `${cyclicalAvg > defensiveAvg ? 'Cyclical' : 'Defensive'} sectors showing relative strength`
      );
    }

    return relationships;
  }
}

