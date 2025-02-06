
interface AdditionalInsightsSectionProps {
  insights: [string, any][];
}

export const AdditionalInsightsSection = ({ insights }: AdditionalInsightsSectionProps) => {
  if (!insights || insights.length === 0) return null;

  const formatValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(item => formatValue(item)).join(', ');
      }
      return Object.entries(value)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${formatValue(v)}`)
        .join(', ');
    }
    return String(value);
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg mt-4">
      <h4 className="text-lg font-semibold mb-3 text-slate-900">Additional Insights</h4>
      <div className="grid gap-2">
        {insights.map(([key, value]) => (
          <div key={key} className="p-2 bg-white rounded border border-green-100">
            <span className="block font-medium text-slate-900 mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-slate-700 whitespace-pre-wrap">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

