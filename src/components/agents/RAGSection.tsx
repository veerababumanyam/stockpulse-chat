
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, FileText, Database, Settings } from "lucide-react";
import { DocumentUpload } from "./rag/DocumentUpload";
import { DocumentList } from "./rag/DocumentList";
import { VectorDBConfig } from "./rag/VectorDBConfig";
import { AdvancedSettings } from "./rag/AdvancedSettings";
import { RAGConfig, defaultConfig } from "./rag/types";

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

  const handleUpload = (files: File[]) => {
    setDocuments(prev => [...prev, ...files]);
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
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

        <TabsContent value="upload">
          <DocumentUpload onUpload={handleUpload} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentList 
            documents={documents}
            onRemove={handleRemoveDocument}
          />
        </TabsContent>

        <TabsContent value="vectordb">
          <VectorDBConfig 
            config={config}
            onConfigChange={handleConfigChange}
          />
        </TabsContent>

        <TabsContent value="settings">
          <AdvancedSettings 
            config={config}
            onConfigChange={handleConfigChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
