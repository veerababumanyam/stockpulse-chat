
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
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
      <p className="text-sm">{content}</p>
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
    api: `https://llswqgpmjvxjdpmdnypq.supabase.co/functions/v1/stock-chat`,
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsc3dxZ3BtanZ4amRwbWRueXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MTk2MjksImV4cCI6MjA1NTI5NTYyOX0.cvX-MJEwdK9HV1rBaA61RgTBu-O7PIxEgNQWDRNBcIw',
      'Authorization': `Bearer ${session?.access_token || ''}`
    },
    body: {
      session: session
    },
    onError: (error) => {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const clearChat = useCallback(() => {
    setMessages([])
  }, [setMessages])

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full">
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
    <Card className="flex flex-col h-full">
      <CardHeader>
        <h3 className="text-lg font-semibold">AI Chat</h3>
        <p className="text-sm text-muted-foreground">
          Ask questions, get investment ideas, and more.
        </p>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
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
            handleSubmit(e);
          }} 
          className="w-full flex items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
          <Button type="button" variant="outline" onClick={clearChat}>Clear</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
