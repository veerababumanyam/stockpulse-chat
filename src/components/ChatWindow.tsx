
import { useState } from "react";
import { MessageSquare, Send, Key } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface Message {
  content: string;
  isUser: boolean;
}

interface ApiKeys {
  openai: string;
  fmp: string;
}

interface StockData {
  quote: {
    symbol: string;
    price: number;
    change: number;
    changesPercentage: number;
    dayLow: number;
    dayHigh: number;
    yearHigh: number;
    yearLow: number;
    marketCap: number;
    volume: number;
    avgVolume: number;
  };
  profile: {
    companyName: string;
    sector: string;
    industry: string;
    description: string;
    ceo: string;
    website: string;
    mktCap: number;
    volAvg: number;
  };
}

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", fmp: "" });
  const { toast } = useToast();

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeys.openai || !apiKeys.fmp) {
      toast({
        title: "Error",
        description: "Please enter both API keys",
        variant: "destructive",
      });
      return;
    }
    setShowApiKeyForm(false);
    toast({
      title: "Success",
      description: "API keys set successfully",
    });
  };

  const fetchStockData = async (query: string): Promise<StockData | null> => {
    try {
      // Clean and prepare the search query
      const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
      
      // Extract potential stock symbols or company names
      const words = cleanQuery.split(' ');
      const searchTerm = words.find(word => word.length >= 2) || cleanQuery;

      console.log('Searching for:', searchTerm);

      // Search for the stock
      const searchResponse = await fetch(
        `https://financialmodelingprep.com/api/v3/search?query=${searchTerm}&limit=1&apikey=${apiKeys.fmp}`
      );
      const searchResults = await searchResponse.json();
      
      if (searchResults && searchResults.length > 0) {
        const symbol = searchResults[0].symbol;
        console.log('Found symbol:', symbol);
        
        // Fetch detailed quote data
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // First fetch relevant stock data
      const stockData = await fetchStockData(input);
      
      // Prepare context with stock data
      let context = "No specific stock data found for the query.";
      if (stockData) {
        const { quote, profile } = stockData;
        context = `Current stock data for ${profile.companyName} (${quote.symbol}):
- Current Price: $${quote.price}
- Price Change: $${quote.change} (${quote.changesPercentage.toFixed(2)}%)
- Market Cap: $${(quote.marketCap / 1e9).toFixed(2)}B
- Volume: ${quote.volume.toLocaleString()}
- 52-Week Range: $${quote.yearLow} - $${quote.yearHigh}
- Sector: ${profile.sector}
- Industry: ${profile.industry}
- CEO: ${profile.ceo}
- Description: ${profile.description}`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.openai}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a stock market expert assistant. Analyze the provided stock data and answer user questions accurately and concisely. 
Include specific numbers and data points when relevant. If no stock data is found, provide general market insights or clarify the query.
Format numbers appropriately (e.g., millions as 'M', billions as 'B'). Always include relevant metrics like price, change percentage, and market cap when discussing a specific stock.`
            },
            {
              role: 'user',
              content: `Context: ${context}\n\nUser Question: ${input}`
            }
          ],
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get response');
      }

      const aiMessage: Message = {
        content: data.choices[0].message.content,
        isUser: false,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please check your API keys and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showApiKeyForm) {
    return (
      <div className="h-full glass-panel">
        <div className="flex items-center gap-2 p-4 border-b border-border/50">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">API Key Setup</h2>
        </div>
        <form onSubmit={handleApiKeySubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input
              type="password"
              value={apiKeys.openai}
              onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
              placeholder="Enter OpenAI API Key"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">FMP API Key</label>
            <Input
              type="password"
              value={apiKeys.fmp}
              onChange={(e) => setApiKeys(prev => ({ ...prev, fmp: e.target.value }))}
              placeholder="Enter FMP API Key"
            />
          </div>
          <Button type="submit" className="w-full">
            Set API Keys
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-full glass-panel">
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">StockPulse Chat</h2>
      </div>

      <div className="h-[calc(100vh-12rem)] overflow-y-auto p-4 scrollbar-none">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              message.isUser 
                ? "bg-primary/10 ml-auto max-w-[80%]" 
                : "bg-muted/50 mr-auto max-w-[80%]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted/50 mr-auto max-w-[80%] mb-4 p-3 rounded-lg">
            Analyzing stock data...
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about stocks..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
