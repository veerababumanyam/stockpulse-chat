
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw } from "lucide-react";
import { LLMProvider } from "@/types/llm";

interface ModelSelectionDialogProps {
  provider: LLMProvider;
  isLoading: boolean;
  onModelSelection: (providerId: string, model: string, isSelected: boolean) => void;
  onRefresh: () => Promise<void>;
}

export const ModelSelectionDialog = ({
  provider,
  isLoading,
  onModelSelection,
  onRefresh
}: ModelSelectionDialogProps) => {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Configure Models for {provider.name}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Select the models you want to use with your AI agents
          </p>
          <Button
            onClick={onRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {provider.models.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No models available. Click the "Refresh" button to fetch available models.
          </p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {provider.models.map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${provider.id}-${model}`}
                    checked={(provider.selectedModels || []).includes(model)}
                    onCheckedChange={(checked) => 
                      onModelSelection(provider.id, model, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`${provider.id}-${model}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {model}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </DialogContent>
  );
};
