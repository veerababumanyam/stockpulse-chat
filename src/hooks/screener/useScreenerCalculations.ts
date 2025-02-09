
import { useToast } from "@/hooks/use-toast";

export const useScreenerCalculations = () => {
  const { toast } = useToast();

  const calculateADR = (values: { adrLen: number; high: number; low: number; close: number; }) => {
    const { adrLen, high, low, close } = values;
    const adr = (high - low) / adrLen;
    const adrPercentage = (adr / close) * 100;

    toast({
      title: "ADR Calculation Results",
      description: `ADR: ${adr.toFixed(2)}, ADR Percentage: ${adrPercentage.toFixed(2)}%`,
    });
  };

  return {
    calculateADR,
  };
};
