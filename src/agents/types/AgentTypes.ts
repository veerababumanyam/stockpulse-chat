
export interface AgentResult {
  data: any;
  error?: string;
}

export type AgentResults = Map<string, AgentResult>;

export interface AnalysisOutput {
  symbol: string;
  companyName: string;
  results: Record<string, any>;
}
