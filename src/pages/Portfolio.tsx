
import { Navigation } from "@/components/Navigation";

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Portfolio</h1>
        <p className="text-muted-foreground">Manage your investment portfolio here.</p>
      </main>
    </div>
  );
};

export default Portfolio;
