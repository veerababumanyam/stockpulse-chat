
interface MetricsSectionProps {
  metrics: Record<string, any>;
}

export const MetricsSection = ({ metrics }: MetricsSectionProps) => {
  if (!metrics || Object.keys(metrics).length === 0) return null;

  return (
    <div className="p-4 bg-purple-50 rounded-lg mt-4">
      <h4 className="text-lg font-semibold mb-3 text-slate-900">Key Metrics</h4>
      <div className="grid gap-2">
        {Object.entries(metrics).map(([key, value]: [string, any]) => (
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
};
