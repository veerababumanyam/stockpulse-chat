
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LLMProvider } from "@/types/llm";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  active: boolean;
}

interface AgentConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentConfig | null;
  onSave: (config: AgentConfig) => void;
}

export const AgentConfigDialog = ({
  open,
  onOpenChange,
  agent,
  onSave,
}: AgentConfigDialogProps) => {
  const [config, setConfig] = useState<Partial<AgentConfig>>({
    name: "",
    description: "",
    model: "",
    temperature: 0.7,
    systemPrompt: "",
    active: true,
  });

  const [openCombobox, setOpenCombobox] = useState(false);
  const [availableModels, setAvailableModels] = useState<Array<{ provider: string; models: string[] }>>([]);
  const [flatModels, setFlatModels] = useState<string[]>([]);

  useEffect(() => {
    const loadModels = () => {
      const savedProviders = localStorage.getItem('llm-providers');
      if (savedProviders) {
        try {
          const providers: LLMProvider[] = JSON.parse(savedProviders);
          const enabledProviders = providers.filter(p => p.isEnabled);
          const models = enabledProviders.map(provider => ({
            provider: provider.name,
            models: provider.selectedModels || []
          })).filter(p => p.models.length > 0);
          setAvailableModels(models);
          
          // Flatten models for searchable list
          const allModels = models.flatMap(provider => provider.models);
          setFlatModels(allModels);
          
          // If no model is selected and we have available models, select the first one
          if (!config.model && allModels.length > 0) {
            setConfig(prev => ({ ...prev, model: allModels[0] }));
          }
        } catch (error) {
          console.error('Error parsing providers:', error);
        }
      }
    };

    loadModels();
  }, [open]);

  useEffect(() => {
    if (agent) {
      setConfig(agent);
    } else {
      setConfig({
        name: "",
        description: "",
        model: flatModels[0] || "",
        temperature: 0.7,
        systemPrompt: "",
        active: true,
      });
    }
  }, [agent, flatModels]);

  const handleSave = () => {
    if (!config.name || !config.description || !config.systemPrompt || !config.model) {
      return;
    }
    onSave({
      id: agent?.id || "",
      name: config.name,
      description: config.description,
      model: config.model,
      temperature: config.temperature || 0.7,
      systemPrompt: config.systemPrompt,
      active: config.active || true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{agent ? "Edit Agent" : "Create New Agent"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Enter agent name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="Enter agent description"
            />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {config.model || "Select model..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search model..." />
                  <CommandEmpty>No model found.</CommandEmpty>
                  {availableModels.map(({ provider, models }) => (
                    <CommandGroup key={provider} heading={provider}>
                      {models.map((model) => (
                        <CommandItem
                          key={model}
                          value={model}
                          onSelect={(currentValue) => {
                            setConfig({ ...config, model: currentValue });
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              config.model === model ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {model}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Temperature ({config.temperature})</Label>
            <Slider
              value={[config.temperature || 0.7]}
              onValueChange={([value]) => setConfig({ ...config, temperature: value })}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={config.systemPrompt}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              placeholder="Enter system prompt"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Agent</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

