
import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import HeaderSection from "./sections/HeaderSection";
import AISearchSection from "./sections/AISearchSection";
import StatsSection from "./sections/StatsSection";
import ScreenerResults from "./ScreenerResults";
import { ScreenerResult } from "./types";

const ScreenerHeader = () => {
  const [results, setResults] = useState<ScreenerResult[]>([]);

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <HeaderSection />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AISearchSection onResultsFound={setResults} />
          <StatsSection resultsCount={results.length} />
        </div>
        <ScreenerResults results={results} />
      </div>
    </ErrorBoundary>
  );
};

export default ScreenerHeader;

