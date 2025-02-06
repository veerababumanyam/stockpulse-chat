
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewCard } from "./components/OverviewCard";
import { ProjectionsCard } from "./components/ProjectionsCard";
import { AnalysisDetailCard } from "./components/AnalysisDetailCard";
import { generateAnalysisPDF } from "@/utils/pdfGenerator";
import { useToast } from "@/components/ui/use-toast";
import type { AIAnalysisTabProps } from "./types/aiAnalysis";

export const AIAnalysisTab = ({ aiAnalysis, isLoading }: AIAnalysisTabProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!aiAnalysis?.formattedData) {
      toast({
        title: "Error",
        description: "No analysis data available to download",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateAnalysisPDF(aiAnalysis.formattedData);
      toast({
        title: "Success",
        description: "Analysis report downloaded successfully",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={handleDownload}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Analysis Report
        </Button>
      </div>

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
    </div>
  );
};

