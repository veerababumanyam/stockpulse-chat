
import { isCommonWord } from './wordFilters';

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
