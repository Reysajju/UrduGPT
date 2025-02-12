import React from 'react';
import { Copy, Check } from 'lucide-react';
import type { Message } from '../types';
import { useClipboard } from '../hooks/useClipboard';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { copied, copyToClipboard } = useClipboard();

  const isUrduText = (text: string) => /[\u0600-\u06FF]/.test(text);

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-3xl rounded-lg px-4 py-2 ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-white'
        }`}
      >
        <div className="flex items-start gap-2">
          <div 
            className={`flex-1 ${isUrduText(message.content) ? 'urdu-text text-xl' : ''}`}
          >
            {message.content}
          </div>
          <button
            onClick={() => copyToClipboard(message.content)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}