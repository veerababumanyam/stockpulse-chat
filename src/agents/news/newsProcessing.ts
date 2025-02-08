
import { ScrapedNews } from './types';
import { BaseAgent } from '../BaseAgent';

export const FINANCIAL_SOURCES = [
  'seekingalpha.com',
  'marketbeat.com',
  'thestreet.com',
  'fool.com',
  'cnbc.com',
  'reuters.com',
  'wsj.com',
  'investors.com',
  'marketwatch.com',
  'nasdaq.com',
  'finance.yahoo.com',
  'google.com/finance',
  'investing.com',
  'tradingview.com',
  'tipranks.com',
  'zacks.com',
  'morningstar.com',
  'barrons.com',
  'bloomberg.com'
];

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
      date: BaseAgent.formatDate(item.publishedDate),
      symbols: extractSymbolsFromNews(item),
      recommendation: extractRecommendationFromText(item.title + ' ' + item.text)
    }));
};

export const extractRecommendationFromText = (text: string): string | undefined => {
  const buyKeywords = ['buy', 'bullish', 'upgrade', 'outperform'];
  const sellKeywords = ['sell', 'bearish', 'downgrade', 'underperform'];
  const holdKeywords = ['hold', 'neutral', 'market perform'];

  text = text.toLowerCase();

  if (buyKeywords.some(keyword => text.includes(keyword))) return 'BUY';
  if (sellKeywords.some(keyword => text.includes(keyword))) return 'SELL';
  if (holdKeywords.some(keyword => text.includes(keyword))) return 'HOLD';
  return undefined;
};

export const extractSymbolsFromNews = (news: any): string[] => {
  const symbols: string[] = [];
  const content = (news.title + ' ' + news.text).toUpperCase();
  
  const matches = content.match(/\$[A-Z]{1,5}|[A-Z]{1,5}:|[A-Z]{1,5}\s(?=is|has|was|reported)/g) || [];
  
  matches.forEach(match => {
    const symbol = match.replace(/[$:\s]/g, '');
    if (symbol.length >= 2 && symbol.length <= 5 && !isCommonWord(symbol)) {
      symbols.push(symbol);
    }
  });
  
  return [...new Set(symbols)];
};

const isCommonWord = (word: string): boolean => {
  const commonWords = new Set([
    'THE', 'AND', 'FOR', 'NEW', 'NOW', 'HOW', 'WHY', 'WHO', 'WHAT', 'WHEN',
    'CEO', 'CFO', 'IPO', 'USA', 'FDA', 'SEC', 'ETF', 'GDP'
  ]);
  return commonWords.has(word);
};

