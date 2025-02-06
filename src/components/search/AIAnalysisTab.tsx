
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "./components/OverviewCard";
import { ProjectionsCard } from "./components/ProjectionsCard";
import { AnalysisDetailCard } from "./components/AnalysisDetailCard";
import type { AIAnalysisTabProps } from "./types/aiAnalysis";

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

  return (
    <div className="grid grid-cols-1 gap-6">
      <OverviewCard 
        recommendation={aiAnalysis.formattedData.recommendation}
        confidenceScore={aiAnalysis.formattedData.confidenceScore}
      />
      
      <ProjectionsCard 
        projections={aiAnalysis.formattedData.priceProjections}
      />

      {Object.entries(aiAnalysis.formattedData.results).map(([agentName, result]) => (
        <AnalysisDetailCard 
          key={agentName}
          agentName={agentName}
          result={result}
        />
      ))}
    </div>
  );
};
