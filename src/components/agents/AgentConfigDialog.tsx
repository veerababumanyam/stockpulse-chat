
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
    model: "gpt-4o-mini",
    temperature: 0.7,
    systemPrompt: "",
    active: true,
  });

  useEffect(() => {
    if (agent) {
      setConfig(agent);
    } else {
      setConfig({
        name: "",
        description: "",
        model: "gpt-4o-mini",
        temperature: 0.7,
        systemPrompt: "",
        active: true,
      });
    }
  }, [agent]);

  const handleSave = () => {
    if (!config.name || !config.description || !config.systemPrompt) {
      return;
    }
    onSave({
      id: agent?.id || "",
      name: config.name,
      description: config.description,
      model: config.model || "gpt-4o-mini",
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
                <SelectGroup>
                  <SelectLabel>OpenAI Models</SelectLabel>
                  <SelectItem value="gpt-4o-mini">GPT-4-Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4o-vision">GPT-4 Vision</SelectItem>
                  <SelectItem value="gpt-4o-1106">GPT-4 Turbo (1106)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Deepseek Models</SelectLabel>
                  <SelectItem value="deepseek-chat">Deepseek Chat</SelectItem>
                  <SelectItem value="deepseek-coder">Deepseek Coder</SelectItem>
                  <SelectItem value="deepseek-reasoner">Deepseek Reasoner</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Specialized Models</SelectLabel>
                  <SelectItem value="finance-gpt">Finance GPT</SelectItem>
                  <SelectItem value="market-analyst">Market Analyst</SelectItem>
                  <SelectItem value="risk-assessor">Risk Assessor</SelectItem>
                  <SelectItem value="technical-analyst">Technical Analyst</SelectItem>
                </SelectGroup>
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

