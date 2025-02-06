
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatLargeNumber, getRecommendationColor } from "@/utils/formatting";

interface AnalysisTabProps {
  stockData: any;
}

export const AnalysisTab = ({ stockData }: AnalysisTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stockData.upgrades && stockData.upgrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyst Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {stockData.upgrades.map((upgrade: any, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{upgrade.gradingCompany}</p>
                      <p className="text-sm text-muted-foreground">{upgrade.publishedDate}</p>
                    </div>
                    <Badge className={getRecommendationColor(upgrade.newGrade)}>
                      {upgrade.newGrade}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    Previous: {upgrade.previousGrade} → New: {upgrade.newGrade}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {stockData.insider && stockData.insider.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Insider Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {stockData.insider.slice(0, 10).map((trade: any, index: number) => (
                <div key={index} className="mb-4 p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{trade.reportingName}</p>
                      <p className="text-sm text-muted-foreground">{trade.transactionDate}</p>
                    </div>
                    <Badge variant={trade.transactionType === 'Buy' ? 'default' : 'destructive'}>
                      {trade.transactionType}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    Shares: {formatLargeNumber(trade.transactionShares)} @ ${trade.transactionPrice}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
