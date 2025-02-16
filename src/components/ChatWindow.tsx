import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from 'ai/react';
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { useCompletion } from 'ai/react';

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
  const [input, setInput] = useState('');
  const { messages, input: hookInput, handleInputChange, handleSubmit: hookHandleSubmit, setMessages } = useChat({
    api: "/api/chat",
  });
  const { completion, complete, setCompletion } = useCompletion();

  const handleSubmit = async (message: string) => {
    try {
      await hookHandleSubmit(message);
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  const clearChat = useCallback(() => {
    setMessages([])
  }, [setMessages])

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
              <ChatMessage key={message.id} role={message.role} content={message.content} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={hookInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(hookInput);
              }
            }}
            className="flex-1"
          />
          <Button type="submit" onClick={() => handleSubmit(hookInput)}>Send</Button>
          <Button type="button" variant="outline" onClick={clearChat}>Clear</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
