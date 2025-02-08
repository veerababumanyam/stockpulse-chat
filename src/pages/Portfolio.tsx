
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/portfolio/Overview";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Portfolio</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">$100,000.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Today's Change</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-green-500">+$1,234.56</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Return</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-green-500">+12.34%</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Portfolio holdings will be displayed here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
