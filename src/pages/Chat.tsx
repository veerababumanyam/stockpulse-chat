
import { Navigation } from "@/components/Navigation";
import ChatWindow from "@/components/ChatWindow";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>
      <div className="pt-[72px] px-4">
        <ErrorBoundary>
          <ChatWindow />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Chat;

