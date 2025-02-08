
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Overview = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Portfolio overview will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};
