
import { Badge } from "@/components/ui/badge";

interface SignalsSectionProps {
  signals: Record<string, any>;
}

export const SignalsSection = ({ signals }: SignalsSectionProps) => {
  if (!signals || Object.keys(signals).length === 0) return null;

  return (
    <div className="p-4 bg-slate-50 rounded-lg">
      <h4 className="text-lg font-semibold mb-3 text-slate-900">Market Signals</h4>
      <div className="grid gap-2">
        {Object.entries(signals).map(([key, value]: [string, any]) => (
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
};
