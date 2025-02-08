import { Card } from "@/components/ui/card";

interface StatsSectionProps {
  resultsCount: number;
}

const StatsSection = ({ resultsCount }: StatsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
      {/* Stats section intentionally left empty */}
    </div>
  );
};

export default StatsSection;
