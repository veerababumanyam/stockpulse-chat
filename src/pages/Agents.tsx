
import { Navigation } from "@/components/Navigation";

const Agents = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4">
        <h1 className="text-4xl font-bold mb-6">AI Agents</h1>
        <p className="text-muted-foreground">Access AI-powered market analysis tools.</p>
      </main>
    </div>
  );
};

export default Agents;
