import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";

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

const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

const formatStockData = (stockData: StockData): string => {
  const { quote, profile } = stockData;
  return `
📈 ${profile.companyName} (${quote.symbol})

Current Price: $${quote.price.toFixed(2)}
Price Change: ${quote.change >= 0 ? '↗️' : '↘️'} $${Math.abs(quote.change).toFixed(2)} (${quote.changesPercentage.toFixed(2)}%)
Market Cap: ${formatLargeNumber(quote.marketCap)}
Volume: ${quote.volume.toLocaleString()}

Trading Range:
• Day: $${quote.dayLow.toFixed(2)} - $${quote.dayHigh.toFixed(2)}
• 52-Week: $${quote.yearLow.toFixed(2)} - $${quote.yearHigh.toFixed(2)}

Company Info:
• Sector: ${profile.sector}
• Industry: ${profile.industry}
• CEO: ${profile.ceo}

${profile.description}`;
};

export const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ openai: "", fmp: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load API keys on component mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      setApiKeys(parsedKeys);
    } else {
      toast({
        title: "API Keys Required",
        description: "Please set up your API keys in the Profile section",
        variant: "destructive",
      });
      navigate("/profile");
    }
  }, []);

  const fetchStockData = async (query: string): Promise<StockData | null> => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!apiKeys.openai || !apiKeys.fmp) {
      toast({
        title: "API Keys Required",
        description: "Please set up your API keys in the Profile section",
        variant: "destructive",
      });
      navigate("/profile");
      return;
    }

    const userMessage: Message = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const stockData = await fetchStockData(input);
      
      let context = "No specific stock data found for the query.";
      if (stockData) {
        context = formatStockData(stockData);
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

  return (
    <div className="h-[90vh] glass-panel flex flex-col">
      {/* Messages container with flex-grow */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-none">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              message.isUser 
                ? "bg-primary/10 ml-auto w-fit max-w-[95%]" 
                : "bg-muted/50 mr-auto w-fit max-w-[95%] whitespace-pre-line"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted/50 mr-auto w-fit max-w-[95%] mb-4 p-3 rounded-lg">
            Analyzing stock data...
          </div>
        )}
      </div>

      {/* Input form at the bottom */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm mt-auto"
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
