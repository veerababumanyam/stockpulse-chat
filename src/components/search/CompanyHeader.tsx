
import { Badge } from "@/components/ui/badge";

interface CompanyHeaderProps {
  profile: any;
  quote: any;
  getPriceChangeColor: (change: number) => string;
  formatLargeNumber: (num: number) => string;
}

export const CompanyHeader = ({ profile, quote, getPriceChangeColor, formatLargeNumber }: CompanyHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-6">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold">{profile.companyName}</h1>
          <Badge variant="outline">{quote.symbol}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge>{profile.sector}</Badge>
          <Badge variant="outline">{profile.industry}</Badge>
          <Badge variant="secondary">{profile.country}</Badge>
        </div>
      </div>
      <div className="mt-4 md:mt-0 text-right">
        <p className="text-3xl font-bold">${quote.price.toFixed(2)}</p>
        <p className={`text-lg ${getPriceChangeColor(quote.change)}`}>
          {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changesPercentage.toFixed(2)}%)
        </p>
        <p className="text-sm text-muted-foreground">
          Volume: {formatLargeNumber(quote.volume)}
        </p>
      </div>
    </div>
  );
};
