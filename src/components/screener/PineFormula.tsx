
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { ADRCalculation } from "./types";

interface PineFormulaProps {
  onCalculate: (values: ADRCalculation) => void;
}

export const PineFormula: React.FC<PineFormulaProps> = ({ onCalculate }) => {
  const [values, setValues] = useState<ADRCalculation>({
    adrLen: 20,
    close: 0,
    high: 0,
    low: 0,
  });

  const handleChange = (field: keyof ADRCalculation) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: parseFloat(e.target.value) || 0,
    }));
  };

  const calculateADR = () => {
    onCalculate(values);
  };

  return (
    <Card className="mt-8 bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Calculator className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>ADR% Calculator</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate Average Daily Range Percentage for any stock
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">ADR Length (Days)</label>
            <Input
              type="number"
              value={values.adrLen}
              onChange={handleChange("adrLen")}
              className="bg-background/50"
              min="1"
              max="100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Close Price ($)</label>
            <Input
              type="number"
              value={values.close || ""}
              onChange={handleChange("close")}
              className="bg-background/50"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">High Price ($)</label>
            <Input
              type="number"
              value={values.high || ""}
              onChange={handleChange("high")}
              className="bg-background/50"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Low Price ($)</label>
            <Input
              type="number"
              value={values.low || ""}
              onChange={handleChange("low")}
              className="bg-background/50"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <Button
          onClick={calculateADR}
          className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculate ADR%
        </Button>
      </CardContent>
    </Card>
  );
};
