import { useState, useEffect } from "react";
import { Send, Download } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { OrchestratorAgent } from "@/agents/OrchestratorAgent";
import { generateAnalysisPDF } from "@/utils/pdfGenerator";

interface Message {
  content: string;
  isUser: boolean;
  data?: any;
}

interface ApiKeys {
  openai: string;
  fmp: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
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

  const fetchStockData = async (query: string) => {
    try {
      const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      const words = cleanQuery.split(' ');
      const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

      console.log('Searching for:', searchTerm);

      const searchResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKeys.fmp}`
      );
      const searchResults = await searchResponse.json();
      
      if (searchResults && searchResults.length > 0) {
        const symbol = searchResults[0].symbol;
        console.log('Found symbol:', symbol);
        
        const [quoteResponse, profileResponse] = await Promise.all([
          fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apiKeys.fmp}`),
          fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKeys.fmp}`)
        ]);

        const [quoteData, profileData] = await Promise.all([
          quoteResponse.json(),
          profileResponse.json()
        ]);

        if (quoteData[0] && profileData[0]) {
          return {
            quote: quoteData[0],
            profile: profileData[0]
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw new Error('Failed to fetch stock data');
    }
  };

  const handleDownloadPDF = async (analysisData: any) => {
    try {
      await generateAnalysisPDF(analysisData);
      toast({
        title: "Success",
        description: "Analysis report downloaded successfully",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const stockData = await fetchStockData(input);
      
      if (!stockData) {
        throw new Error('No stock data found for the query');
      }

      const analysis = await OrchestratorAgent.orchestrateAnalysis(stockData);
      const { textOutput, formattedData } = analysis;

      const aiMessage: Message = {
        content: textOutput,
        isUser: false,
        data: formattedData
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze stock data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[90vh] glass-panel flex flex-col bg-[#F1F0FB]/80 border-[#E5DEFF]">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div
              className={`p-3 rounded-lg ${
                message.isUser 
                  ? "bg-[#8B5CF6]/10 ml-auto w-fit max-w-[95%]" 
                  : "bg-[#E5DEFF]/50 mr-auto w-fit max-w-[95%] whitespace-pre-line"
              }`}
            >
              {message.content}
            </div>
            {!message.isUser && message.data && (
              <Button
                onClick={() => handleDownloadPDF(message.data)}
                className="mt-2 bg-[#8B5CF6] hover:bg-[#7C3AED] flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </Button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-[#E5DEFF]/50 mr-auto w-fit max-w-[95%] mb-4 p-3 rounded-lg">
            Analyzing stock data...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[#E5DEFF]/50 bg-white/50 backdrop-blur-sm mt-auto"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about stocks..."
            disabled={isLoading}
            className="bg-white/70"
          />
          <Button type="submit" disabled={isLoading} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
