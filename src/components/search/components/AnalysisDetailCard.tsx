
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignalsSection } from "./analysis-sections/SignalsSection";
import { MetricsSection } from "./analysis-sections/MetricsSection";
import { TrendsSection } from "./analysis-sections/TrendsSection";
import { AdditionalInsightsSection } from "./analysis-sections/AdditionalInsightsSection";

interface AnalysisDetailCardProps {
  agentName: string;
  result: any;
}

export const AnalysisDetailCard = ({ agentName, result }: AnalysisDetailCardProps) => {
  const renderAnalysisContent = (result: any) => {
    if (!result?.data?.analysis) return null;

    const { analysis } = result.data;
    
    const otherFields = Object.entries(analysis).filter(([key]) => 
      !['signals', 'metrics', 'trends'].includes(key)
    );

    return (
      <div className="space-y-4">
        <SignalsSection signals={analysis.signals} />
        <MetricsSection metrics={analysis.metrics} />
        <TrendsSection trends={analysis.trends} />
        <AdditionalInsightsSection insights={otherFields} />
      </div>
    );
  };

  return (
    <Card key={agentName} className="border-2 border-slate-100">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="text-xl text-slate-900 capitalize">
          {agentName.replace(/([A-Z])/g, ' $1').trim()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result?.error ? (
          <p className="text-red-500 p-4 bg-red-50 rounded-lg">
            {result.error}
          </p>
        ) : (
          renderAnalysisContent(result)
        )}
      </CardContent>
    </Card>
  );
};
