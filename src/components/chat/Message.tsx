
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { Message as MessageType } from "@/types/chat";

interface MessageProps {
  message: MessageType;
  onDownload?: (data: any) => void;
}

const Message = ({ message, onDownload }: MessageProps) => {
  return (
    <div className="mb-4">
      <div
        className={`p-3 rounded-lg inline-block max-w-[95%] ${
          message.isUser 
            ? "bg-[#8B5CF6]/10 ml-auto" 
            : "bg-[#E5DEFF]/50 mr-auto whitespace-pre-line"
        }`}
      >
        {message.content}
      </div>
      
      {!message.isUser && message.data && (
        <div className="mt-2">
          <Button
            onClick={() => onDownload?.(message.data)}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Analysis Report
          </Button>
        </div>
      )}
    </div>
  );
};

export default Message;

