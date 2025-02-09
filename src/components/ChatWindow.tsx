
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
      console.log('Loading API keys:', { 
        hasFMP: !!parsedKeys.fmp,
        hasOpenAI: !!parsedKeys.openai,
        hasDeepseek: !!parsedKeys.deepseek 
      });
      
      if (!parsedKeys.fmp) {
        toast({
          title: "FMP API Key Required",
          description: "Please set your Financial Modeling Prep API key in the API Keys page",
          variant: "destructive",
        });
        navigate("/api-keys");
        return;
      }
      setApiKeys(parsedKeys);
    } else {
      toast({
        title: "API Keys Required",
        description: "Please set your API keys in the API Keys page",
        variant: "destructive",
      });
      navigate("/api-keys");
    }
  }, [navigate, toast]);

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
      console.log('Starting analysis for symbol:', input);
      console.log('API Keys status:', { 
        fmp: !!apiKeys.fmp,
        openai: !!apiKeys.openai,
        deepseek: !!apiKeys.deepseek 
      });

      if (!apiKeys.fmp) {
        throw new Error('FMP API key is required. Please set it in the API Keys page.');
      }

      const stockData = await fetchStockData(input, apiKeys.fmp);
      console.log('Fetched stock data:', stockData);
      
      if (!stockData || !stockData.quote) {
        throw new Error('No stock data found for the given symbol. Please check if the symbol is correct.');
      }

      console.log('Starting orchestrator analysis with data:', {
        symbol: stockData.quote.symbol,
        companyName: stockData.profile?.companyName
      });
      
      const analysis = await OrchestratorAgent.orchestrateAnalysis(stockData);
      console.log('Orchestrator analysis complete:', analysis);

      if (!analysis || !analysis.textOutput) {
        throw new Error('Invalid analysis response from OrchestratorAgent');
      }

      const aiMessage: MessageType = {
        content: analysis.textOutput,
        isUser: false,
        data: analysis.formattedData
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${stockData.quote.symbol}`,
      });

    } catch (error) {
      console.error('Error in chat handling:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze stock data";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setMessages(prev => [...prev, {
        content: `Error: ${errorMessage}. Please try again with a valid stock symbol.`,
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[90vh] glass-panel flex flex-col bg-[#F1F0FB]/80 dark:bg-gray-900/80 border-[#E5DEFF] dark:border-gray-700">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
            onDownload={handleDownloadPDF}
          />
        ))}
        {isLoading && (
          <div className="bg-[#E5DEFF]/50 dark:bg-gray-800/50 mr-auto w-fit max-w-[95%] mb-4 p-3 rounded-lg text-gray-900 dark:text-gray-100">
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

