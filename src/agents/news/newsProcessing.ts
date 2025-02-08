
import { ScrapedNews } from './types';
import { FINANCIAL_SOURCES } from './constants/financialSources';
import { extractSymbolsFromNews } from './utils/symbolExtractor';
import { extractRecommendationFromText } from './utils/recommendationExtractor';

export const processNewsData = (news: any[]): ScrapedNews[] => {
  if (!Array.isArray(news)) return [];
  
  return news
    .filter(item => FINANCIAL_SOURCES.some(source => 
      item.site?.toLowerCase().includes(source)
    ))
    .map(item => ({
      title: item.title,
      url: item.url,
      source: item.site,
      summary: item.text?.substring(0, 200) + '...',
      date: new Date(item.publishedDate).toLocaleDateString(),
      symbols: extractSymbolsFromNews(item),
      recommendation: extractRecommendationFromText(item.title + ' ' + item.text)
    }));
};
