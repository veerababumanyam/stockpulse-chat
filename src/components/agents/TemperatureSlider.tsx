
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TemperatureSliderProps {
  temperature: number;
  onTemperatureChange: (value: number) => void;
}

export const TemperatureSlider = ({
  temperature,
  onTemperatureChange,
}: TemperatureSliderProps) => {
  return (
    <div className="space-y-2">
      <Label>Temperature ({temperature})</Label>
      <Slider
        value={[temperature]}
        onValueChange={([value]) => onTemperatureChange(value)}
        min={0}
        max={1}
        step={0.1}
      />
    </div>
  );
};

