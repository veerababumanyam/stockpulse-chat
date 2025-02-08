
import { Card } from "@/components/ui/card";
import { TrendingUp, LineChart, BarChart3, DollarSign } from "lucide-react";

interface StatsSectionProps {
  resultsCount: number;
}

const StatsSection = ({ resultsCount }: StatsSectionProps) => {
  const stats = [
    {
      label: "Total Markets",
      value: "3",
      subtext: "NYSE, NASDAQ, AMEX",
      icon: <DollarSign className="h-4 w-4 text-primary" />,
    },
    {
      label: "Screened Results",
      value: resultsCount.toString(),
      subtext: "Matched Stocks",
      icon: <LineChart className="h-4 w-4 text-primary" />,
    },
    {
      label: "Market Coverage",
      value: "8,749",
      subtext: "Total Listed Stocks",
      icon: <BarChart3 className="h-4 w-4 text-primary" />,
    },
    {
      label: "Data Update",
      value: "Real-time",
      subtext: "Market Hours Only",
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="p-4 bg-background/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:bg-accent/5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtext}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection;

