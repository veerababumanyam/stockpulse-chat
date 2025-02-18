
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { useChat } from 'ai/react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => (
  <div className={cn(
    "mb-2 flex items-start gap-2 text-sm",
    role === 'user' ? 'justify-end' : 'justify-start'
  )}>
    {role === 'assistant' ? <Bot className="h-4 w-4 text-muted-foreground" /> : <User className="h-4 w-4 text-muted-foreground" />}
    <div className={cn(
      "rounded-md px-3 py-2 shadow-sm",
      role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
    )}>
      <p className="text-sm whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

const ChatWindow: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (!session) {
        navigate('/auth');
        toast({
          title: "Authentication required",
          description: "Please sign in to use the chat feature",
          variant: "destructive"
        });
      }
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
    api: `${window.location.origin}/functions/v1/stock-chat`,
    headers: {
      'Authorization': `Bearer ${session?.access_token || ''}`,
      'Content-Type': 'application/json'
    },
    body: {
      session: session
    },
    onError: (error) => {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const clearChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  if (isLoading) {
    return (
      <Card className="flex flex-col h-[calc(100vh-100px)]">
        <CardContent className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-100px)]">
      <CardHeader>
        <h3 className="text-lg font-semibold">AI Chat</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions about stocks, get investment ideas, and more.
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-2">
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                role={message.role as 'user' | 'assistant'} 
                content={message.content} 
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            handleSubmit(e);
          }} 
          className="w-full flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Ask me anything about stocks..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>Send</Button>
          <Button type="button" variant="outline" onClick={clearChat}>Clear</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
