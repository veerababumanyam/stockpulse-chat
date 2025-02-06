
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AIAnalysis {
  textOutput: string;
  formattedData: {
    symbol: string;
    companyName: string;
    recommendation: string;
    confidenceScore: number;
    priceProjections: {
      threeMonths: number;
      sixMonths: number;
      twelveMonths: number;
      twentyFourMonths: number;
    };
    results: Record<string, any>;
  };
}

interface AIAnalysisTabProps {
  aiAnalysis: AIAnalysis | null;
  isLoading: boolean;
}

export const AIAnalysisTab = ({ aiAnalysis, isLoading }: AIAnalysisTabProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    );
  }

  if (!aiAnalysis?.formattedData?.results) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No AI analysis available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRecommendationColor = (recommendation: string) => {
    const lowercaseRec = recommendation.toLowerCase();
    if (lowercaseRec.includes('buy') || lowercaseRec.includes('bullish')) {
      return 'bg-emerald-500 hover:bg-emerald-600';
    }
    if (lowercaseRec.includes('sell') || lowercaseRec.includes('bearish')) {
      return 'bg-red-500 hover:bg-red-600';
    }
    return 'bg-yellow-500 hover:bg-yellow-600';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderAnalysisContent = (result: any) => {
    if (!result?.data?.analysis) return null;

    const { analysis } = result.data;
    const sections = [];

    // Handle signals with improved visual hierarchy
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

    // Handle metrics with improved visualization
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

    // Handle trends with improved readability
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

    // Handle other analysis fields with improved organization
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
    <div className="grid grid-cols-1 gap-6">
      {/* Overview Card with enhanced visual hierarchy */}
      <Card className="border-2 border-purple-100">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-slate-50">
          <CardTitle className="text-2xl text-slate-900">Investment Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-lg text-slate-700">Recommendation</span>
              <Badge 
                className={cn("text-white", 
                  getRecommendationColor(aiAnalysis.formattedData.recommendation)
                )}
              >
                {aiAnalysis.formattedData.recommendation}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-lg text-slate-700">Confidence Score</span>
              <span className={cn("text-lg font-semibold", 
                getConfidenceColor(aiAnalysis.formattedData.confidenceScore)
              )}>
                {aiAnalysis.formattedData.confidenceScore}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Projections Card with enhanced visualization */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
          <CardTitle className="text-2xl text-slate-900">Price Projections</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(aiAnalysis.formattedData.priceProjections).map(([period, price]) => (
              <div 
                key={period} 
                className="p-4 bg-blue-50 rounded-lg flex flex-col items-center"
              >
                <span className="text-sm text-slate-600 mb-1">
                  {period.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-2xl font-bold text-blue-700">
                  ${price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Analysis Cards with improved section organization */}
      {Object.entries(aiAnalysis.formattedData.results).map(([agentName, result]) => (
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
      ))}
    </div>
  );
};

