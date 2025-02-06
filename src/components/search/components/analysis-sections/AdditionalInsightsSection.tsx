
interface AdditionalInsightsSectionProps {
  insights: [string, any][];
}

export const AdditionalInsightsSection = ({ insights }: AdditionalInsightsSectionProps) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="p-4 bg-green-50 rounded-lg mt-4">
      <h4 className="text-lg font-semibold mb-3 text-slate-900">Additional Insights</h4>
      <div className="grid gap-2">
        {insights.map(([key, value]) => (
          <div key={key} className="p-2 bg-white rounded border border-green-100">
            <span className="block font-medium text-slate-900 mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <span className="text-slate-700">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
