import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot, Check, CheckCheck } from 'lucide-react';

export interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read' | 'loading';
}

interface ChatMessageProps {
  message: MessageProps;
  isNew?: boolean;
}

const ChatMessage = ({ message, isNew = false }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isNew && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isNew]);
  
  const getStatusIcon = () => {
    if (!isUser) return null;
    
    switch (message.status) {
      case 'loading':
        return <span className="text-gray-400 animate-pulse">•••</span>;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" aria-label="Message sent" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" aria-label="Message delivered" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-urdu-accent" aria-label="Message read" />;
      default:
        return null;
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return (
    <div
      ref={messageRef}
      className={cn(
        "chat-bubble",
        isUser ? "user" : "bot",
        isNew && "animate-scale-in"
      )}
      role={isUser ? "listitem" : "listitem"}
      aria-label={`${isUser ? 'Your' : 'UrduGPT'} message at ${formattedTime}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-xs opacity-70 mb-2">
          {isUser ? (
            <>
              <User className="h-3 w-3" aria-hidden="true" />
              <span>You</span>
            </>
          ) : (
            <>
              <Bot className="h-3 w-3" aria-hidden="true" />
              <span>UrduGPT</span>
            </>
          )}
          <span aria-hidden="true">•</span>
          <time dateTime={new Date(message.timestamp).toISOString()}>{formattedTime}</time>
          {getStatusIcon()}
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;