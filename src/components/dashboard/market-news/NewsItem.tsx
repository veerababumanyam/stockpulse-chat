
import { Badge } from "@/components/ui/badge";
import { NewsItem } from "./types";
import { getSentimentColor, getSentimentLabel } from "./utils";

interface NewsItemProps {
  item: NewsItem;
}

export const NewsItemComponent = ({ item }: NewsItemProps) => {
  return (
    <div className="pb-4 border-b last:border-b-0">
      <a 
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-muted/50 rounded-lg p-2 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold mb-1">{item.title}</h4>
          <Badge 
            variant="secondary" 
            className={getSentimentColor(item.sentiment.score)}
          >
            {getSentimentLabel(item.sentiment.score)}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {new Date(item.date).toLocaleDateString()} • {item.source}
        </div>
        <p className="text-sm line-clamp-2">{item.text}</p>
      </a>
    </div>
  );
};
