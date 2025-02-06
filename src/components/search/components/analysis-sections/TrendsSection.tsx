
import { formatPrice, formatVolume, formatPercentage } from "@/utils/formatting";

interface TrendData {
  priceAction?: {
    currentPrice: number;
    ma50: number;
    ma200: number;
    relativeStrengthIndex: string | number;
    volume: number;
    avgVolume: number;
  };
  pricePredictions?: {
    threeMonths: { price: number; confidence: number };
    sixMonths: { price: number; confidence: number };
    twelveMonths: { price: number; confidence: number };
    twentyFourMonths: { price: number; confidence: number };
  };
}

interface TrendsSectionProps {
  trends: TrendData;
}

export const TrendsSection = ({ trends }: TrendsSectionProps) => {
  if (!trends?.priceAction && !trends?.pricePredictions) return null;

  return (
    <div className="space-y-6">
      {trends.priceAction && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-slate-900">Price Action</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-lg font-semibold">{formatPrice(trends.priceAction.currentPrice)}</p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-gray-600">50-Day MA</p>
              <p className="text-lg font-semibold">{formatPrice(trends.priceAction.ma50)}</p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-gray-600">200-Day MA</p>
              <p className="text-lg font-semibold">{formatPrice(trends.priceAction.ma200)}</p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-gray-600">RSI</p>
              <p className="text-lg font-semibold">
                {typeof trends.priceAction.relativeStrengthIndex === 'number' 
                  ? trends.priceAction.relativeStrengthIndex.toFixed(2)
                  : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-lg font-semibold">{formatVolume(trends.priceAction.volume)}</p>
            </div>
            <div className="p-3 bg-white rounded shadow-sm">
              <p className="text-sm text-gray-600">Avg Volume</p>
              <p className="text-lg font-semibold">{formatVolume(trends.priceAction.avgVolume)}</p>
            </div>
          </div>
        </div>
      )}
      
      {trends.pricePredictions && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-3 text-slate-900">Price Predictions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(trends.pricePredictions).map(([period, data]) => (
              <div key={period} className="p-3 bg-white rounded shadow-sm">
                <p className="text-sm text-gray-600">
                  {period.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-lg font-semibold">{formatPrice(data.price)}</p>
                <p className="text-xs text-gray-500">
                  Confidence: {data.confidence}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
