
import { Badge } from "@/components/ui/badge";
import { TopicCount } from "./types";
import { getSentimentColor, getSentimentLabel } from "./utils";

interface TopicItemProps {
  topic: TopicCount;
}

export const TopicItem = ({ topic }: TopicItemProps) => {
  const isStockSymbol = /^[A-Z]{1,5}$/.test(topic.topic);

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        {isStockSymbol ? (
          <>
            <span className="font-bold">{topic.topic}</span>
            <Badge variant="outline" className="font-mono">
              Stock
            </Badge>
          </>
        ) : (
          <span className="font-medium">{topic.topic}</span>
        )}
        <Badge variant="outline">
          {topic.count} mentions
        </Badge>
      </div>
      <Badge 
        variant="secondary" 
        className={getSentimentColor(topic.sentiment)}
      >
        {getSentimentLabel(topic.sentiment)}
      </Badge>
    </div>
  );
};
