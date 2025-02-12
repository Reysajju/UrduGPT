import React from 'react';
import { Copy, Check, CheckCheck } from 'lucide-react';
import type { Message } from '../types';
import { useClipboard } from '../hooks/useClipboard';
import { formatMessageDate } from '../utils/dateFormatter';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { copied, copyToClipboard } = useClipboard();
  const isUrduText = (text: string) => /[\u0600-\u06FF]/.test(text);

  const renderStatus = () => {
    if (message.role === 'assistant') return null;
    
    return (
      <div className="flex items-center gap-1 transition-all duration-300">
        {message.status === 'sent' && (
          <Check size={14} className="text-gray-400" />
        )}
        {message.status === 'delivered' && (
          <CheckCheck size={14} className="text-gray-400" />
        )}
        {message.status === 'read' && (
          <CheckCheck size={14} className="text-blue-500" />
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } px-1 sm:px-0`}
      itemScope
      itemType="https://schema.org/Message"
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-3xl rounded-lg px-3 sm:px-4 py-2 ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-white'
        }`}
      >
        <div className="flex items-start gap-2">
          <div 
            className={`flex-1 break-words ${
              isUrduText(message.content) 
                ? 'urdu-text text-base sm:text-lg md:text-xl' 
                : 'text-sm sm:text-base'
            }`}
            itemProp="text"
          >
            {message.content}
          </div>
          <div className="flex flex-col items-end gap-1 text-[10px] sm:text-xs text-gray-300 min-w-[48px]">
            <span>{formatMessageDate(message.timestamp)}</span>
            {renderStatus()}
          </div>
          <meta itemProp="dateCreated" content={message.timestamp.toISOString()} />
          <button
            onClick={() => copyToClipboard(message.content)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
          >
            {copied ? (
              <Check size={14} className="text-green-500" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}