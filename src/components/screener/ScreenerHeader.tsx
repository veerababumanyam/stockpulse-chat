
import { useState } from "react";
import HeaderSection from "./sections/HeaderSection";
import AISearchSection from "./sections/AISearchSection";
import StatsSection from "./sections/StatsSection";
import ScreenerResults from "./ScreenerResults";
import { ScreenerResult } from "./types";

const ScreenerHeader = () => {
  const [results, setResults] = useState<ScreenerResult[]>([]);

  return (
    <div className="space-y-4">
      <HeaderSection />
      <AISearchSection onResultsFound={setResults} />
      <StatsSection resultsCount={results.length} />
      <ScreenerResults results={results} />
    </div>
  );
};

export default ScreenerHeader;
