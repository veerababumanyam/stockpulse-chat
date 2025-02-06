
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Info, Settings2 } from "lucide-react";
import { LLMProvider } from "@/types/llm";
import { ModelSelectionDialog } from "./ModelSelectionDialog";

interface ProviderCardProps {
  provider: LLMProvider;
  isLoading: boolean;
  onToggle: (providerId: string) => void;
  onModelSelection: (providerId: string, model: string, isSelected: boolean) => void;
  onRefresh: () => Promise<void>;
}

export const ProviderCard = ({
  provider,
  isLoading,
  onToggle,
  onModelSelection,
  onRefresh
}: ProviderCardProps) => {
  if (!provider) {
    return null;
  }

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{provider.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {provider.description}
            </p>
          </div>
          <Switch
            checked={provider.isEnabled}
            onCheckedChange={() => onToggle(provider.id)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Key Capabilities
            </h3>
            <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
              {provider.capabilities?.map((capability, index) => (
                <li key={index}>{capability}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Available Models</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    Configure Models
                  </Button>
                </DialogTrigger>
                <ModelSelectionDialog
                  provider={provider}
                  isLoading={isLoading}
                  onModelSelection={onModelSelection}
                  onRefresh={onRefresh}
                />
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(provider.selectedModels) && provider.selectedModels.map((model) => (
                <Badge key={model} variant="secondary">
                  {model}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
