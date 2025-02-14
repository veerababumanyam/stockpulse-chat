
interface NoApiKeyPanelProps {
  onSetupClick: () => void;
}

export const NoApiKeyPanel = ({ onSetupClick }: NoApiKeyPanelProps) => {
  return (
    <div className="glass-panel rounded-lg p-8 backdrop-blur-xl border border-border/50 animate-fade-in">
      <p className="text-lg text-muted-foreground mb-6">
        To access real-time market data and AI-powered analysis, you'll need to set up your API key first. Make sure your API key is active and not suspended.
      </p>
      <button
        onClick={onSetupClick}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-all duration-200 hover:shadow-lg font-medium"
      >
        Set up API Key
      </button>
    </div>
  );
};

