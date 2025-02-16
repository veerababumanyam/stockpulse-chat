
interface NoApiKeyPanelProps {
  onSetupClick: () => void;
}

export const NoApiKeyPanel = ({ onSetupClick }: NoApiKeyPanelProps) => {
  return (
    <div className="bg-card p-8 rounded-lg border shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Welcome to Your Financial Dashboard</h2>
      <div className="space-y-6">
        <p className="text-muted-foreground">
          To access real-time market data, you'll need to set up your Financial Modeling Prep (FMP) API key. 
          This will unlock features like:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Real-time market data</li>
          <li>Stock price tracking</li>
          <li>Financial metrics</li>
          <li>Market analysis</li>
        </ul>
        <div className="space-y-4">
          <p className="font-medium">How to get started:</p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Visit <a href="https://site.financialmodelingprep.com/developer" className="text-primary underline" target="_blank" rel="noopener noreferrer">financialmodelingprep.com</a> to get your API key</li>
            <li>Copy your new API key</li>
            <li>Click the button below to add it to your settings</li>
          </ol>
        </div>
        <button
          onClick={onSetupClick}
          className="mt-6 w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Set up API Key
        </button>
      </div>
    </div>
  );
};
