
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export const OllamaConfig = () => {
  const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
  const { toast } = useToast();

  useEffect(() => {
    const savedUrl = localStorage.getItem('ollamaBaseUrl');
    if (savedUrl) {
      setBaseUrl(savedUrl);
    }
  }, []);

  const handleSave = () => {
    try {
      new URL(baseUrl);
      localStorage.setItem('ollamaBaseUrl', baseUrl);
      toast({
        title: "Success",
        description: "Ollama base URL has been updated",
      });
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including protocol (http:// or https://)",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="ollama-url">Ollama Base URL</Label>
        <div className="flex gap-2">
          <Input
            id="ollama-url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:11434"
            className="flex-1"
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter the base URL where your Ollama instance is running. Usually this is localhost:11434 for local installations.
        </p>
      </div>
    </div>
  );
};

