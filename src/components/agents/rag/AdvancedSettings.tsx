
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RAGConfig } from "./types";

interface AdvancedSettingsProps {
  config: RAGConfig;
  onConfigChange: (updates: Partial<RAGConfig>) => void;
}

export const AdvancedSettings = ({ config, onConfigChange }: AdvancedSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chunk-size">Chunk Size</Label>
              <Input
                id="chunk-size"
                type="number"
                value={config.chunkSize}
                onChange={(e) => onConfigChange({ chunkSize: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overlap">Chunk Overlap</Label>
              <Input
                id="overlap"
                type="number"
                value={config.overlap}
                onChange={(e) => onConfigChange({ overlap: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-results">Max Results</Label>
              <Input
                id="max-results"
                type="number"
                value={config.maxResults}
                onChange={(e) => onConfigChange({ maxResults: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-score">Minimum Relevance Score</Label>
              <Input
                id="min-score"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={config.minRelevanceScore}
                onChange={(e) => onConfigChange({ minRelevanceScore: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Embeddings Model</Label>
            <Select
              value={config.embeddings}
              onValueChange={(value) => onConfigChange({ embeddings: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI Embeddings</SelectItem>
                <SelectItem value="huggingface">HuggingFace Embeddings</SelectItem>
                <SelectItem value="cohere">Cohere Embeddings</SelectItem>
                <SelectItem value="sentence-transformers">Sentence Transformers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Preprocessing Options</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Remove Stop Words</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter out common words
                  </p>
                </div>
                <Switch
                  checked={config.preprocessing.removeStopWords}
                  onCheckedChange={(checked) =>
                    onConfigChange({
                      preprocessing: { ...config.preprocessing, removeStopWords: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Stemming</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce words to their root form
                  </p>
                </div>
                <Switch
                  checked={config.preprocessing.stemming}
                  onCheckedChange={(checked) =>
                    onConfigChange({
                      preprocessing: { ...config.preprocessing, stemming: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
