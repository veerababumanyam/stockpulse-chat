
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, FileText, Database, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RAGConfig {
  enabled: boolean;
  chunkSize: number;
  overlap: number;
  embeddings: string;
  vectorStore: string;
  similarityMetric: string;
  maxResults: number;
  minRelevanceScore: number;
  reranking: boolean;
  preprocessing: {
    removeStopWords: boolean;
    stemming: boolean;
    lowercase: boolean;
  };
}

const defaultConfig: RAGConfig = {
  enabled: false,
  chunkSize: 1000,
  overlap: 200,
  embeddings: 'openai',
  vectorStore: 'pinecone',
  similarityMetric: 'cosine',
  maxResults: 5,
  minRelevanceScore: 0.7,
  reranking: true,
  preprocessing: {
    removeStopWords: true,
    stemming: true,
    lowercase: true,
  }
};

export const RAGSection = () => {
  const [config, setConfig] = useState<RAGConfig>(() => {
    const savedConfig = localStorage.getItem('rag-config');
    if (!savedConfig) return defaultConfig;
    
    // Merge saved config with default config to ensure all properties exist
    const parsed = JSON.parse(savedConfig);
    return {
      ...defaultConfig,
      ...parsed,
      preprocessing: {
        ...defaultConfig.preprocessing,
        ...(parsed.preprocessing || {})
      }
    };
  });

  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ];

    const validFiles = Array.from(files).filter(file => 
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Some files were skipped. Only PDF, TXT, DOCX, and MD files are supported.",
        variant: "destructive",
      });
    }

    setDocuments(prev => [...prev, ...validFiles]);

    // Simulated upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    toast({
      title: "Upload Complete",
      description: `${validFiles.length} documents have been uploaded successfully.`,
    });
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">Configure your RAG system and manage documents</p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => handleConfigChange({ enabled: checked })}
        />
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="vectordb" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Vector Store
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.docx,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    <span className="font-medium">Click to upload or drag and drop</span>
                    <span className="text-sm text-muted-foreground">
                      PDF, TXT, DOCX, MD (Max 100MB per file)
                    </span>
                  </Label>
                </div>
                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" />
                        <span>{doc.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDocuments(prev => prev.filter((_, i) => i !== index));
                          toast({
                            title: "Document Removed",
                            description: "The document has been removed from the knowledge base.",
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No documents uploaded yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vectordb" className="space-y-4">
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
                      onValueChange={(value) => handleConfigChange({ vectorStore: value })}
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
                      onValueChange={(value) => handleConfigChange({ similarityMetric: value })}
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
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
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
                      onChange={(e) => handleConfigChange({ chunkSize: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overlap">Chunk Overlap</Label>
                    <Input
                      id="overlap"
                      type="number"
                      value={config.overlap}
                      onChange={(e) => handleConfigChange({ overlap: parseInt(e.target.value) })}
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
                      onChange={(e) => handleConfigChange({ maxResults: parseInt(e.target.value) })}
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
                      onChange={(e) => handleConfigChange({ minRelevanceScore: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Embeddings Model</Label>
                  <Select
                    value={config.embeddings}
                    onValueChange={(value) => handleConfigChange({ embeddings: value })}
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
                          handleConfigChange({
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
                          handleConfigChange({
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
