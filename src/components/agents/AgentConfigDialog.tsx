
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const [availableModels, setAvailableModels] = useState<Array<{ provider: string; models: string[] }>>([]);

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
          
          // If no model is selected and we have available models, select the first one
          if (!config.model && models.length > 0 && models[0].models.length > 0) {
            setConfig(prev => ({ ...prev, model: models[0].models[0] }));
          }
        } catch (error) {
          console.error('Error parsing providers:', error);
        }
      }
    };

    loadModels();
  }, [open]); // Reload when dialog opens

  useEffect(() => {
    if (agent) {
      setConfig(agent);
    } else {
      setConfig({
        name: "",
        description: "",
        model: availableModels[0]?.models[0] || "",
        temperature: 0.7,
        systemPrompt: "",
        active: true,
      });
    }
  }, [agent, availableModels]);

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
            <Label htmlFor="model">Model</Label>
            <Select
              value={config.model}
              onValueChange={(value) => setConfig({ ...config, model: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(({ provider, models }) => (
                  <SelectGroup key={provider}>
                    <SelectLabel>{provider}</SelectLabel>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
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

