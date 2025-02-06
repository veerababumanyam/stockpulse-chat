
import { Label } from "@/components/ui/label";

interface AgentConfig {
  model: string;
  temperature: number;
  systemPrompt: string;
}

export const AgentConfigDisplay = ({ agent }: { agent: AgentConfig }) => {
  return (
    <div className="space-y-2">
      <Label>Agent Configuration</Label>
      <div className="text-sm space-y-1">
        <p><strong>Model:</strong> {agent.model}</p>
        <p><strong>Temperature:</strong> {agent.temperature}</p>
        <p><strong>System Prompt:</strong> {agent.systemPrompt}</p>
      </div>
    </div>
  );
};
