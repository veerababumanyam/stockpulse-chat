
import { useState } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AISearchSection from "./sections/AISearchSection";
import { ScreenerResult } from "./types";
import ScreenerResults from "./ScreenerResults";

const ScreenerHeader = () => {
  const [results, setResults] = useState<ScreenerResult[]>([]);

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in">
        <AISearchSection onResultsFound={setResults} />
        <ScreenerResults results={results} />
      </div>
    </ErrorBoundary>
  );
};

export default ScreenerHeader;
