
import { Navigation } from "@/components/Navigation";

const Screener = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Stock Screener</h1>
        <p className="text-muted-foreground">Find stocks based on your criteria.</p>
      </main>
    </div>
  );
};

export default Screener;
