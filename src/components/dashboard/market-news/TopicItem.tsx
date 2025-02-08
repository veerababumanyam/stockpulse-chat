
import { Badge } from "@/components/ui/badge";
import { TopicCount } from "./types";
import { getSentimentColor, getSentimentLabel } from "./utils";

interface TopicItemProps {
  topic: TopicCount;
}

export const TopicItem = ({ topic }: TopicItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="font-medium">{topic.topic}</span>
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
