
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceProjections } from "../types/aiAnalysis";

interface ProjectionsCardProps {
  projections: PriceProjections;
}

export const ProjectionsCard = ({ projections }: ProjectionsCardProps) => {
  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50">
        <CardTitle className="text-2xl text-slate-900">Price Projections</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(projections).map(([period, price]) => (
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
  );
};
