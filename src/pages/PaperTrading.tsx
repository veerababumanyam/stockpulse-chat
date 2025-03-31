
import { Navigation } from "@/components/Navigation";
import { useState } from "react";
import { PaperTradingHeader } from "@/components/paper-trading/PaperTradingHeader";
import { PaperTradingPortfolio } from "@/components/paper-trading/PaperTradingPortfolio";
import { PaperTradingActions } from "@/components/paper-trading/PaperTradingActions";
import { PaperTradingHistory } from "@/components/paper-trading/PaperTradingHistory";
import { usePaperTrading } from "@/hooks/usePaperTrading";

const PaperTrading = () => {
  const [activeTab, setActiveTab] = useState<"portfolio" | "history">("portfolio");
  const { portfolio, isLoading, error } = usePaperTrading();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto pt-20 p-4 space-y-6">
        <PaperTradingHeader />
        
        <div className="flex space-x-4 border-b">
          <button
            className={`pb-2 font-medium ${
              activeTab === "portfolio"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("portfolio")}
          >
            Paper Portfolio
          </button>
          <button
            className={`pb-2 font-medium ${
              activeTab === "history"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Trading History
          </button>
        </div>

        {activeTab === "portfolio" ? (
          <>
            <PaperTradingActions />
            <PaperTradingPortfolio portfolio={portfolio} isLoading={isLoading} error={error} />
          </>
        ) : (
          <PaperTradingHistory />
        )}
      </main>
    </div>
  );
};

export default PaperTrading;
