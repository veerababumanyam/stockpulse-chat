
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIAnalysisTabProps {
  aiAnalysis: any;
  isLoading: boolean;
}

export const AIAnalysisTab = ({ aiAnalysis, isLoading }: AIAnalysisTabProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {aiAnalysis && aiAnalysis.results ? (
        Object.entries(aiAnalysis.results).map(([agentName, result]: [string, any]) => (
          <Card key={agentName}>
            <CardHeader>
              <CardTitle className="capitalize">
                {agentName.replace(/([A-Z])/g, ' $1').trim()} Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result?.error ? (
                <p className="text-destructive">{result.error}</p>
              ) : (
                <div className="space-y-4">
                  {result?.data?.analysis?.signals && (
                    <div>
                      <h4 className="font-medium mb-2">Signals</h4>
                      {Object.entries(result.data.analysis.signals).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="capitalize text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <Badge variant={
                            typeof value === 'string' && value.toLowerCase().includes('buy') ? 'default' :
                            typeof value === 'string' && value.toLowerCase().includes('sell') ? 'destructive' :
                            'secondary'
                          }>
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {result?.data?.analysis?.metrics && (
                    <div>
                      <h4 className="font-medium mb-2">Metrics</h4>
                      {Object.entries(result.data.analysis.metrics).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="capitalize text-muted-foreground">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span>{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {result?.data?.analysis?.trends && Array.isArray(result.data.analysis.trends) && (
                    <div>
                      <h4 className="font-medium mb-2">Trends</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {result.data.analysis.trends.map((trend: string, index: number) => (
                          <li key={index} className="text-muted-foreground">{trend}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {isLoading ? "AI analysis is being generated..." : "No AI analysis available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
