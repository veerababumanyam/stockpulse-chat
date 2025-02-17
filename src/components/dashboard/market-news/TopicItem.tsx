
import { Badge } from "@/components/ui/badge";
import type { TopicItemProps } from "./types";

export const TopicItem = ({ topic }: TopicItemProps) => {
  return (
    <Badge variant="outline">
      {topic}
    </Badge>
  );
};
