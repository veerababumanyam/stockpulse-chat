
import { Navigation } from "@/components/Navigation";

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">Watchlist</h1>
        <p className="text-muted-foreground">Track your favorite stocks and investments.</p>
      </main>
    </div>
  );
};

export default Watchlist;
