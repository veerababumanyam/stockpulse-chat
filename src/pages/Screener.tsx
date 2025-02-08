
import { Navigation } from "@/components/Navigation";
import ScreenerHeader from "@/components/screener/ScreenerHeader";

const Screener = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <ScreenerHeader />
      </main>
    </div>
  );
};

export default Screener;
