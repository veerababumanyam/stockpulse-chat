
import { Send } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="p-4 border-t border-[#E5DEFF]/50 bg-white/50 backdrop-blur-sm mt-auto"
    >
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask about stocks..."
          disabled={isLoading}
          className="bg-white/70"
        />
        <Button type="submit" disabled={isLoading} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
