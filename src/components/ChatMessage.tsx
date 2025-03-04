import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Bot, Check, CheckCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageReactions from './MessageReactions';

export interface MessageProps {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read' | 'loading';
  media?: {
    type: string;
    data: string;
  };
}

interface ChatMessageProps {
  message: MessageProps;
  isNew?: boolean;
  reactions?: string[];
  onReact?: (messageId: string, reaction: string) => void;
  onCopy?: (content: string) => void;
}

const ChatMessage = ({ 
  message, 
  isNew = false, 
  reactions = [],
  onReact,
  onCopy
}: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const messageRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  
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
        "chat-bubble group",
        isUser ? "user" : "bot",
        isNew && "animate-scale-in",
        "hover:shadow-md transition-shadow duration-200"
      )}
      role={isUser ? "listitem" : "listitem"}
      aria-label={`${isUser ? 'Your' : 'Assistant'} message at ${formattedTime}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs opacity-70 mb-2">
          <div className="flex items-center gap-2">
            {isUser ? (
              <>
                <User className="h-3 w-3" aria-hidden="true" />
                <span>You</span>
              </>
            ) : (
              <>
                <Bot className="h-3 w-3" aria-hidden="true" />
                <span>Assistant</span>
              </>
            )}
            <span aria-hidden="true">•</span>
            <time dateTime={new Date(message.timestamp).toISOString()}>{formattedTime}</time>
            {getStatusIcon()}
          </div>
          
          {showActions && onReact && onCopy && (
            <div className="flex items-center gap-1">
              <MessageReactions 
                messageId={message.id} 
                onReact={onReact}
                onCopy={onCopy}
                content={message.content}
              />
            </div>
          )}
        </div>
        
        {/* Display media if present */}
        {message.media && message.media.data && (
          <div className="mb-3">
            {message.media.type === 'image' ? (
              <div className="rounded-md overflow-hidden max-w-xs mx-auto mb-2">
                <img 
                  src={message.media.data} 
                  alt="Attached" 
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            ) : message.media.type === 'audio' && (
              <div className="rounded-md overflow-hidden max-w-xs mx-auto mb-2">
                <audio 
                  src={message.media.data} 
                  controls 
                  className="w-full"
                  preload="metadata"
                />
              </div>
            )}
          </div>
        )}
        
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {reactions.map((reaction, index) => (
              <span 
                key={`${reaction}-${index}`}
                className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-background/50 text-xs"
              >
                {reaction}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;