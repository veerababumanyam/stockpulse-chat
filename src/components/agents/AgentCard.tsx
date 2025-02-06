
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, TestTube2 } from "lucide-react";
import { AgentTestDialog } from "./AgentTestDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  active: boolean;
}

interface AgentCardProps {
  agent: AgentConfig;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export const AgentCard = ({ agent, onEdit, onToggle, onDelete }: AgentCardProps) => {
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{agent.name}</CardTitle>
          <Switch 
            checked={agent.active}
            onCheckedChange={onToggle}
            aria-label="Toggle agent status"
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{agent.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Model:</span>
            <span>{agent.model}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Temperature:</span>
            <span>{agent.temperature}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsTestDialogOpen(true)}
          >
            <TestTube2 className="w-4 h-4" />
            Test
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this agent? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
      <AgentTestDialog
        open={isTestDialogOpen}
        onOpenChange={setIsTestDialogOpen}
        agent={agent}
      />
    </Card>
  );
};
