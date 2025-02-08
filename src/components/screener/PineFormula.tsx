
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <Card className="w-full bg-background/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle>Pine Formula - ADR Calculation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">ADR Length</label>
            <Input
              type="number"
              value={values.adrLen}
              onChange={handleChange("adrLen")}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Close Price</label>
            <Input
              type="number"
              value={values.close || ""}
              onChange={handleChange("close")}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">High Price</label>
            <Input
              type="number"
              value={values.high || ""}
              onChange={handleChange("high")}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Low Price</label>
            <Input
              type="number"
              value={values.low || ""}
              onChange={handleChange("low")}
              className="bg-background/50"
            />
          </div>
        </div>
        <Button onClick={calculateADR} className="w-full">
          Calculate ADR
        </Button>
      </CardContent>
    </Card>
  );
};

