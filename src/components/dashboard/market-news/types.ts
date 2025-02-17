
export interface NewsItemType {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  source: string;
  url: string;
  symbol: string;
  image: string | null;
}

export interface TopicItemProps {
  topic: string;
}
