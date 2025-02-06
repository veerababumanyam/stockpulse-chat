
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RAGConfig } from "./types";

interface VectorDBConfigProps {
  config: RAGConfig;
  onConfigChange: (updates: Partial<RAGConfig>) => void;
}

export const VectorDBConfig = ({ config, onConfigChange }: VectorDBConfigProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vector Database Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vector Store</Label>
              <Select
                value={config.vectorStore}
                onValueChange={(value) => onConfigChange({ vectorStore: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pinecone">Pinecone</SelectItem>
                  <SelectItem value="qdrant">Qdrant</SelectItem>
                  <SelectItem value="weaviate">Weaviate</SelectItem>
                  <SelectItem value="milvus">Milvus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Similarity Metric</Label>
              <Select
                value={config.similarityMetric}
                onValueChange={(value) => onConfigChange({ similarityMetric: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cosine">Cosine Similarity</SelectItem>
                  <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                  <SelectItem value="dot">Dot Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
