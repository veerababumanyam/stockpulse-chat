
interface DashboardHeaderProps {
  handleSetupApiKey: () => void;
}

export const DashboardHeader = ({ handleSetupApiKey }: DashboardHeaderProps) => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Market Overview
        </span>
      </h1>
      <p className="text-xl text-muted-foreground font-light animate-fade-in delay-100">
        Track market movements and get AI-powered insights
      </p>
    </div>
  );
};

