
import { Card, CardContent } from "@/components/ui/card";

export const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array(2).fill(0).map((_, i) => (
      <Card key={i} className="h-[400px] animate-pulse">
        <CardContent className="p-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-6" />
          <div className="space-y-6">
            {Array(5).fill(0).map((_, j) => (
              <div key={j} className="flex justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-20" />
                  <div className="h-4 bg-muted rounded w-32" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-16" />
                  <div className="h-4 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

