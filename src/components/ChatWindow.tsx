
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { generateAnalysisPDF } from "@/utils/pdfGenerator";
import { fetchStockData } from "@/utils/stockApi";
import { Message as MessageType, ApiKeys, AnalysisResult } from "@/types/chat";
import Message from "./chat/Message";
import ChatInput from "./chat/ChatInput";

const ChatWindow = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", fmp: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      setApiKeys(parsedKeys);
    }
  }, []);

  const handleDownloadPDF = async (analysisData: any) => {
    try {
      console.log('Starting PDF generation with data:', analysisData);
      if (!analysisData) {
        throw new Error('No analysis data available');
      }
      
      const success = await generateAnalysisPDF(analysisData);
      
      if (success) {
        toast({
          title: "Success",
          description: "Analysis report downloaded successfully",
        });
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const stockData = await fetchStockData(input, apiKeys.fmp);
      
      if (!stockData) {
        throw new Error('No stock data found for the query');
      }

      console.log('Retrieved stock data:', stockData);

      const analysis = await OrchestratorAgent.orchestrateAnalysis(stockData);
      console.log('Orchestrator analysis result:', analysis);
      
      if (!analysis || typeof analysis === 'string') {
        throw new Error('Invalid analysis response');
      }

      const analysisResult = analysis as unknown as AnalysisResult;
      console.log('Formatted analysis result:', analysisResult);

      const aiMessage: MessageType = {
        content: analysisResult.textOutput,
        isUser: false,
        data: analysisResult.formattedData
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze stock data",
        variant: "destructive",
      });

      const errorMessage: MessageType = {
        content: error instanceof Error ? error.message : "Failed to analyze stock data",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[90vh] glass-panel flex flex-col bg-[#F1F0FB]/80 border-[#E5DEFF]">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            onDownload={handleDownloadPDF}
          />
        ))}
        {isLoading && (
          <div className="bg-[#E5DEFF]/50 mr-auto w-fit max-w-[95%] mb-4 p-3 rounded-lg">
            Analyzing stock data...
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatWindow;
