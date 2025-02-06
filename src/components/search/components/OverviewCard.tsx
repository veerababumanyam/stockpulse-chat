
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRecommendationColor, getConfidenceColor } from "../utils/analysisUtils";

interface OverviewCardProps {
  recommendation: string;
  confidenceScore: number;
}

export const OverviewCard = ({ recommendation, confidenceScore }: OverviewCardProps) => {
  return (
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
                getRecommendationColor(recommendation)
              )}
            >
              {recommendation}
            </Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="text-lg text-slate-700">Confidence Score</span>
            <span className={cn("text-lg font-semibold", 
              getConfidenceColor(confidenceScore)
            )}>
              {confidenceScore}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
