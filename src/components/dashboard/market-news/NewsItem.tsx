
import { Badge } from "@/components/ui/badge";
import type { NewsItemType } from "./types";

interface NewsItemProps {
  news: NewsItemType;
}

export const NewsItem = ({ news }: NewsItemProps) => {
  return (
    <div className="pb-4 border-b last:border-b-0">
      <a 
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-muted/50 rounded-lg p-2 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold mb-1">{news.title}</h4>
          <Badge variant="secondary" className="ml-2">
            {news.symbol}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {new Date(news.publishedAt).toLocaleDateString()} • {news.source}
        </div>
        <p className="text-sm line-clamp-2">{news.description}</p>
      </a>
    </div>
  );
};
