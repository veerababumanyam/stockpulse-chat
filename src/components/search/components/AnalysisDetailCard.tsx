
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisDetailCardProps {
  agentName: string;
  result: any;
}

export const AnalysisDetailCard = ({ agentName, result }: AnalysisDetailCardProps) => {
  const renderAnalysisContent = (result: any) => {
    if (!result?.data?.analysis) return null;

    const { analysis } = result.data;
    const sections = [];

    if (analysis.signals && Object.keys(analysis.signals).length > 0) {
      sections.push(
        <div key="signals" className="p-4 bg-slate-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-slate-900">Market Signals</h4>
          <div className="grid gap-2">
            {Object.entries(analysis.signals).map(([key, value]: [string, any]) => (
              <div 
                key={key} 
                className="flex justify-between items-center p-2 bg-white rounded border border-slate-200"
              >
                <span className="capitalize text-slate-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <Badge variant={
                  typeof value === 'string' && value.toLowerCase().includes('buy') ? 'default' :
                  typeof value === 'string' && value.toLowerCase().includes('sell') ? 'destructive' :
                  'secondary'
                } className="ml-2">
                  {value}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (analysis.metrics && Object.keys(analysis.metrics).length > 0) {
      sections.push(
        <div key="metrics" className="p-4 bg-purple-50 rounded-lg mt-4">
          <h4 className="text-lg font-semibold mb-3 text-slate-900">Key Metrics</h4>
          <div className="grid gap-2">
            {Object.entries(analysis.metrics).map(([key, value]: [string, any]) => (
              <div 
                key={key} 
                className="flex justify-between items-center p-2 bg-white rounded border border-purple-100"
              >
                <span className="capitalize text-slate-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-semibold text-purple-700">
                  {typeof value === 'number' ? value.toFixed(2) : value.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (analysis.trends && Array.isArray(analysis.trends) && analysis.trends.length > 0) {
      sections.push(
        <div key="trends" className="p-4 bg-blue-50 rounded-lg mt-4">
          <h4 className="text-lg font-semibold mb-3 text-slate-900">Market Trends</h4>
          <div className="space-y-2">
            {analysis.trends.map((trend: string, index: number) => (
              <div key={index} className="p-2 bg-white rounded border border-blue-100">
                <p className="text-slate-700">{trend}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    const otherFields = Object.entries(analysis).filter(([key]) => 
      !['signals', 'metrics', 'trends'].includes(key)
    );

    if (otherFields.length > 0) {
      sections.push(
        <div key="other" className="p-4 bg-green-50 rounded-lg mt-4">
          <h4 className="text-lg font-semibold mb-3 text-slate-900">Additional Insights</h4>
          <div className="grid gap-2">
            {otherFields.map(([key, value]) => (
              <div key={key} className="p-2 bg-white rounded border border-green-100">
                <span className="block font-medium text-slate-900 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-slate-700">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return sections.length > 0 ? (
      <div className="space-y-4">
        {sections}
      </div>
    ) : (
      <p className="text-muted-foreground">No detailed analysis available</p>
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
