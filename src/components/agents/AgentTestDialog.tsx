
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  active: boolean;
}

interface AgentTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: AgentConfig;
}

export const AgentTestDialog = ({
  open,
  onOpenChange,
  agent,
}: AgentTestDialogProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    if (!input) {
      toast({
        title: "Input Required",
        description: "Please enter test input for the agent",
        variant: "destructive",
      });
      return;
    }

    // Get the provider from the model name (assuming format like "gpt-4", "claude-2", etc.)
    const getProviderFromModel = (model: string): string => {
      if (model.includes("gpt")) return "openai";
      if (model.includes("claude")) return "anthropic";
      if (model.includes("gemini")) return "gemini";
      if (model.includes("deepseek")) return "deepseek";
      return "openrouter";
    };

    // Get API key based on the provider
    const savedKeys = localStorage.getItem('apiKeys');
    if (!savedKeys) {
      toast({
        title: "API Key Required",
        description: "Please set up your API keys in the API Keys page",
        variant: "destructive",
      });
      return;
    }

    const provider = getProviderFromModel(agent.model);
    const apiKeys = JSON.parse(savedKeys);
    const apiKey = apiKeys[provider];

    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: `Please set up your ${provider.toUpperCase()} API key in the API Keys page`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = provider === "openai" 
        ? "https://api.openai.com/v1/chat/completions"
        : provider === "anthropic"
        ? "https://api.anthropic.com/v1/messages"
        : provider === "gemini"
        ? "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"
        : `https://api.${provider}.com/v1/chat/completions`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (provider === "openai") {
        headers.Authorization = `Bearer ${apiKey}`;
      } else if (provider === "anthropic") {
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
      } else {
        headers.Authorization = `Bearer ${apiKey}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(
          provider === "anthropic" 
            ? {
                model: agent.model,
                messages: [{ role: "user", content: input }],
                system: agent.systemPrompt,
                max_tokens: 1000,
              }
            : {
                model: agent.model,
                messages: [
                  { role: "system", content: agent.systemPrompt },
                  { role: "user", content: input },
                ],
                temperature: agent.temperature,
              }
        ),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = provider === "anthropic" 
        ? data.content[0].text 
        : data.choices[0].message.content;

      setOutput(content);
      
      toast({
        title: "Test Completed",
        description: "Agent test executed successfully",
      });
    } catch (error) {
      console.error("Error testing agent:", error);
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "There was an error testing the agent",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Test Agent: {agent.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Agent Configuration</Label>
            <div className="text-sm space-y-1">
              <p><strong>Model:</strong> {agent.model}</p>
              <p><strong>Temperature:</strong> {agent.temperature}</p>
              <p><strong>System Prompt:</strong> {agent.systemPrompt}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="input">Test Input</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter test input for the agent..."
              rows={3}
            />
          </div>
          <Button 
            onClick={handleTest} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              "Run Test"
            )}
          </Button>
          {output && (
            <div className="space-y-2">
              <Label>Output</Label>
              <Textarea
                value={output}
                readOnly
                className="h-[200px] resize-none"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

