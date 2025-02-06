
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface RAGConfig {
  enabled: boolean;
  chunkSize: number;
  overlap: number;
  embeddings: string;
  vectorStore: string;
}

export const RAGSection = () => {
  const [config, setConfig] = useState<RAGConfig>(() => {
    const savedConfig = localStorage.getItem('rag-config');
    return savedConfig ? JSON.parse(savedConfig) : {
      enabled: false,
      chunkSize: 1000,
      overlap: 200,
      embeddings: 'openai',
      vectorStore: 'pinecone'
    };
  });

  const { toast } = useToast();

  const handleConfigChange = (updates: Partial<RAGConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('rag-config', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Configuration Updated",
      description: "RAG settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">RAG Configuration</h2>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => handleConfigChange({ enabled: checked })}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chunk-size">Chunk Size</Label>
                <Input
                  id="chunk-size"
                  type="number"
                  value={config.chunkSize}
                  onChange={(e) => handleConfigChange({ chunkSize: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overlap">Overlap</Label>
                <Input
                  id="overlap"
                  type="number"
                  value={config.overlap}
                  onChange={(e) => handleConfigChange({ overlap: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="embeddings">Embeddings Model</Label>
              <Input
                id="embeddings"
                value={config.embeddings}
                onChange={(e) => handleConfigChange({ embeddings: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vector-store">Vector Store</Label>
              <Input
                id="vector-store"
                value={config.vectorStore}
                onChange={(e) => handleConfigChange({ vectorStore: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
