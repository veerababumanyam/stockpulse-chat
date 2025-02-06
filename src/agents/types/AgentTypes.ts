
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

export interface DynamicAgent {
  analyze: (input: any) => Promise<any>;
}

export class BaseAnalysisAgent implements DynamicAgent {
  async analyze(input: any): Promise<any> {
    return { status: 'Not implemented' };
  }
}

