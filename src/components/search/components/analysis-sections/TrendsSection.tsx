
interface TrendsSectionProps {
  trends: string[];
}

export const TrendsSection = ({ trends }: TrendsSectionProps) => {
  if (!trends || trends.length === 0) return null;

  return (
    <div className="p-4 bg-blue-50 rounded-lg mt-4">
      <h4 className="text-lg font-semibold mb-3 text-slate-900">Market Trends</h4>
      <div className="space-y-2">
        {trends.map((trend: string, index: number) => (
          <div key={index} className="p-2 bg-white rounded border border-blue-100">
            <p className="text-slate-700">{trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
