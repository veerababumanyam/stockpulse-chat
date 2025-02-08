
export interface NewsItem {
  title: string;
  text: string;
  date: string;
  source: string;
  url: string;
  sentiment: {
    score: number;
    magnitude: number;
  };
}

export interface TopicCount {
  topic: string;
  count: number;
  sentiment: number;
}
