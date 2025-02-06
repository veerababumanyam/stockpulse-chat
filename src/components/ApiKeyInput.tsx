
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('fmp_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('fmp_api_key', apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 glass-panel rounded-xl">
      <h3 className="text-lg font-semibold">Financial Modeling Prep API Key</h3>
      <div className="space-y-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your FMP API key"
          className="bg-white/70"
        />
      </div>
      <Button type="submit" className="w-full">Save API Key</Button>
    </form>
  );
};

export default ApiKeyInput;
