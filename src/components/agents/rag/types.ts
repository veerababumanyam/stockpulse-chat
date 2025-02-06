
export interface RAGConfig {
  enabled: boolean;
  chunkSize: number;
  overlap: number;
  embeddings: string;
  vectorStore: string;
  similarityMetric: string;
  maxResults: number;
  minRelevanceScore: number;
  reranking: boolean;
  preprocessing: {
    removeStopWords: boolean;
    stemming: boolean;
    lowercase: boolean;
  };
}

export const defaultConfig: RAGConfig = {
  enabled: false,
  chunkSize: 1000,
  overlap: 200,
  embeddings: 'openai',
  vectorStore: 'pinecone',
  similarityMetric: 'cosine',
  maxResults: 5,
  minRelevanceScore: 0.7,
  reranking: true,
  preprocessing: {
    removeStopWords: true,
    stemming: true,
    lowercase: true,
  }
};
