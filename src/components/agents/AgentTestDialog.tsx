
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    setIsLoading(true);
    try {
      // Here we simulate the agent's analysis - in a real implementation,
      // this would call the actual agent's analyze method
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("OPENAI_API_KEY")}`,
        },
        body: JSON.stringify({
          model: agent.model,
          messages: [
            { role: "system", content: agent.systemPrompt },
            { role: "user", content: input },
          ],
          temperature: agent.temperature,
        }),
      });

      const data = await response.json();
      setOutput(data.choices[0].message.content);
      
      toast({
        title: "Test Completed",
        description: "Agent test executed successfully",
      });
    } catch (error) {
      console.error("Error testing agent:", error);
      toast({
        title: "Test Failed",
        description: "There was an error testing the agent",
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
