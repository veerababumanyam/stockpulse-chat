
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { loadModels } from "@/utils/modelManagement";
import { ModelSelector } from "./ModelSelector";
import { TemperatureSlider } from "./TemperatureSlider";

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
    const { availableModels: models, flatModels: allModels } = loadModels(localStorage.getItem('llm-providers'));
    setAvailableModels(models);
    setFlatModels(allModels);
    
    if (!config.model && allModels.length > 0) {
      setConfig(prev => ({ ...prev, model: allModels[0] }));
    }
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
            <ModelSelector
              model={config.model || ""}
              availableModels={availableModels}
              onModelSelect={(model) => setConfig({ ...config, model })}
              openCombobox={openCombobox}
              setOpenCombobox={setOpenCombobox}
            />
          </div>
          <TemperatureSlider
            temperature={config.temperature || 0.7}
            onTemperatureChange={(value) => setConfig({ ...config, temperature: value })}
          />
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

