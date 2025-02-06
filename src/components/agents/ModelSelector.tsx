
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  model: string;
  availableModels: Array<{ provider: string; models: string[] }>;
  onModelSelect: (model: string) => void;
  openCombobox: boolean;
  setOpenCombobox: (open: boolean) => void;
}

export const ModelSelector = ({
  model,
  availableModels,
  onModelSelect,
  openCombobox,
  setOpenCombobox,
}: ModelSelectorProps) => {
  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCombobox}
          className="w-full justify-between"
        >
          {model || "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandEmpty>No model found.</CommandEmpty>
          {availableModels.length > 0 ? (
            availableModels.map(({ provider, models }) => (
              <CommandGroup key={provider} heading={provider}>
                {models.map((model) => (
                  <CommandItem
                    key={model}
                    value={model}
                    onSelect={(currentValue) => {
                      onModelSelect(currentValue);
                      setOpenCombobox(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        model === model ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {model}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          ) : (
            <CommandGroup heading="No Models">
              <CommandItem disabled>
                Please configure models in LLM Providers tab
              </CommandItem>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

