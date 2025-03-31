
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  PaperTradingTransaction, 
  PaperTradingPosition,
} from '@/types/paper-trading';
import { v4 as uuidv4 } from 'uuid';

// Initial paper trading cash balance
const INITIAL_CASH = 100000;

export const usePaperTrading = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [portfolio, setPortfolio] = useState<PaperTradingPosition[]>([]);
  const [transactions, setTransactions] = useState<PaperTradingTransaction[]>([]);
  const [cashBalance, setCashBalance] = useState(INITIAL_CASH);
  const [portfolioValue, setPortfolioValue] = useState(INITIAL_CASH);
  const [todayChange, setTodayChange] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);

  // Load paper trading data from localStorage on mount
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        // Check for session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('You must be logged in to use paper trading');
        }

        // Load data from localStorage
        const storedPortfolio = localStorage.getItem(`paperTrading_portfolio_${session.user.id}`);
        const storedTransactions = localStorage.getItem(`paperTrading_transactions_${session.user.id}`);
        const storedCash = localStorage.getItem(`paperTrading_cash_${session.user.id}`);
        
        if (storedPortfolio) {
          setPortfolio(JSON.parse(storedPortfolio));
        }
        
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
        
        if (storedCash) {
          setCashBalance(parseFloat(storedCash));
        } else {
          // Initialize cash if not found
          setCashBalance(INITIAL_CASH);
          localStorage.setItem(`paperTrading_cash_${session.user.id}`, INITIAL_CASH.toString());
        }

        // Calculate portfolio value and changes
        calculatePortfolioMetrics();
      } catch (err) {
        console.error('Error loading paper trading data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load paper trading data'));
      } finally {
        setIsLoading(false);
        setIsLoadingHistory(false);
      }
    };

    loadPortfolio();
  }, []);

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = useCallback(() => {
    // For a real implementation, we would fetch current prices
    // For now, we'll use simple mock data
    let totalValue = cashBalance;
    let dayChange = 0;
    let overallReturn = 0;

    const updatedPortfolio = portfolio.map(position => {
      // Mock price change - in a real app we would fetch the current price
      const priceChange = position.currentPrice * 0.01 * (Math.random() > 0.5 ? 1 : -1);
      const newPrice = position.currentPrice + priceChange;
      const newValue = position.shares * newPrice;
      const positionReturn = newValue - (position.shares * position.averageCost);
      const positionReturnPercentage = ((newPrice / position.averageCost) - 1) * 100;
      
      totalValue += newValue;
      dayChange += position.shares * priceChange;
      overallReturn += positionReturn;

      return {
        ...position,
        currentPrice: newPrice,
        currentValue: newValue,
        totalReturn: positionReturn,
        totalReturnPercentage: positionReturnPercentage
      };
    });

    setPortfolio(updatedPortfolio);
    setPortfolioValue(totalValue);
    setTodayChange(dayChange);
    setTotalReturn(overallReturn);
  }, [portfolio, cashBalance]);

  // Refresh portfolio data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      calculatePortfolioMetrics();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [calculatePortfolioMetrics]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        
        localStorage.setItem(`paperTrading_portfolio_${session.user.id}`, JSON.stringify(portfolio));
        localStorage.setItem(`paperTrading_transactions_${session.user.id}`, JSON.stringify(transactions));
        localStorage.setItem(`paperTrading_cash_${session.user.id}`, cashBalance.toString());
      } catch (err) {
        console.error('Error saving paper trading data:', err);
      }
    };

    saveData();
  }, [portfolio, transactions, cashBalance]);

  // Place a buy order
  const placeBuyOrder = useCallback(async (symbol: string, shares: number) => {
    try {
      setIsLoading(true);
      
      // Mock price fetching - in a real app, we would fetch the current price
      // For now, we'll use a random price between $10 and $500
      const currentPrice = Math.random() * 490 + 10;
      const orderValue = currentPrice * shares;
      
      // Check if user has enough cash
      if (orderValue > cashBalance) {
        throw new Error('Insufficient funds for this purchase');
      }
      
      // Update cash balance
      const newCashBalance = cashBalance - orderValue;
      setCashBalance(newCashBalance);
      
      // Add transaction
      const transaction: PaperTradingTransaction = {
        id: uuidv4(),
        symbol,
        shares,
        type: 'buy',
        date: new Date().toISOString(),
        pricePerShare: currentPrice
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      // Update portfolio
      const existingPosition = portfolio.find(p => p.symbol === symbol);
      
      if (existingPosition) {
        // Update existing position
        const newShares = existingPosition.shares + shares;
        const newAverageCost = (existingPosition.shares * existingPosition.averageCost + shares * currentPrice) / newShares;
        
        setPortfolio(prev => prev.map(p => 
          p.symbol === symbol
            ? {
                ...p,
                shares: newShares,
                averageCost: newAverageCost,
                currentValue: newShares * currentPrice,
              }
            : p
        ));
      } else {
        // Add new position
        const newPosition: PaperTradingPosition = {
          symbol,
          shares,
          averageCost: currentPrice,
          currentPrice,
          currentValue: shares * currentPrice,
          totalReturn: 0,
          totalReturnPercentage: 0
        };
        
        setPortfolio(prev => [...prev, newPosition]);
      }
      
      // Calculate new portfolio metrics
      calculatePortfolioMetrics();
      
      toast({
        title: "Order Executed",
        description: `Successfully purchased ${shares} shares of ${symbol} at ${formatPrice(currentPrice)}`,
      });
    } catch (err) {
      console.error('Error placing buy order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cashBalance, portfolio, toast, calculatePortfolioMetrics]);
  
  // Place a sell order
  const placeSellOrder = useCallback(async (symbol: string, shares: number) => {
    try {
      setIsLoading(true);
      
      // Find position
      const position = portfolio.find(p => p.symbol === symbol);
      
      if (!position) {
        throw new Error(`You don't own any shares of ${symbol}`);
      }
      
      if (position.shares < shares) {
        throw new Error(`You only own ${position.shares} shares of ${symbol}`);
      }
      
      // Mock current price - in a real app we would fetch the current price
      const currentPrice = position.currentPrice;
      const saleValue = currentPrice * shares;
      
      // Update cash balance
      const newCashBalance = cashBalance + saleValue;
      setCashBalance(newCashBalance);
      
      // Add transaction
      const transaction: PaperTradingTransaction = {
        id: uuidv4(),
        symbol,
        shares,
        type: 'sell',
        date: new Date().toISOString(),
        pricePerShare: currentPrice
      };
      
      setTransactions(prev => [transaction, ...prev]);
      
      // Update portfolio
      const remainingShares = position.shares - shares;
      
      if (remainingShares === 0) {
        // Remove position completely
        setPortfolio(prev => prev.filter(p => p.symbol !== symbol));
      } else {
        // Update position
        setPortfolio(prev => prev.map(p => 
          p.symbol === symbol
            ? {
                ...p,
                shares: remainingShares,
                currentValue: remainingShares * currentPrice,
              }
            : p
        ));
      }
      
      // Calculate new portfolio metrics
      calculatePortfolioMetrics();
      
      toast({
        title: "Order Executed",
        description: `Successfully sold ${shares} shares of ${symbol} at ${formatPrice(currentPrice)}`,
      });
    } catch (err) {
      console.error('Error placing sell order:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [cashBalance, portfolio, toast, calculatePortfolioMetrics]);

  // Helper function for formatting prices
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return {
    portfolio,
    transactions,
    cashBalance,
    portfolioValue,
    todayChange,
    totalReturn,
    isLoading,
    isLoadingHistory,
    error,
    placeBuyOrder,
    placeSellOrder
  };
};
