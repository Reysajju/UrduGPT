
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Bot, Check, CheckCheck } from 'lucide-react';

export interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read' | 'loading';
}

const ChatMessage = ({ message }: { message: MessageProps }) => {
  const isUser = message.role === 'user';
  
  const getStatusIcon = () => {
    if (!isUser) return null;
    
    switch (message.status) {
      case 'loading':
        return <span className="text-gray-400 animate-pulse">•••</span>;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-urdu-accent" />;
      default:
        return null;
    }
  };
  
  return (
    <div
      className={cn(
        "chat-bubble",
        isUser ? "user" : "bot"
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
          {isUser ? (
            <>
              <User className="h-3 w-3" />
              <span>You</span>
            </>
          ) : (
            <>
              <Bot className="h-3 w-3" />
              <span>UrduGPT</span>
            </>
          )}
          <span>•</span>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {getStatusIcon()}
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
