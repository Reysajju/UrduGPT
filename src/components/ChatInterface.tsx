import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export function ChatInterface({ messages, isTyping, onSendMessage, inputRef }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value.trim()) {
      onSendMessage(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-800 w-full max-w-full">
      <div className="p-3 sm:p-4 border-b border-gray-700">
        <h1 className="text-xl sm:text-2xl font-bold text-center urdu-text">UrduGPT</h1>
        <p className="text-center text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base urdu-text">آپ کے خیالات کو شاعری میں ڈھالنے کا ہنر</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8 sm:mt-10">
            <p className="text-base sm:text-lg mb-1 sm:mb-2">Dil ki baat share karein...</p>
            <p className="urdu-text text-lg sm:text-xl">دل کی بات شیئر کریں۔۔۔</p>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="urdu-text text-sm sm:text-base">شاعری لکھی جا رہی ہے۔۔۔</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-700">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Kuch poochiye... Shayari me jawab milega"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-white placeholder-gray-400 text-sm sm:text-base"
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Send size={18} className="text-blue-500" />
          </button>
        </div>
      </form>
    </div>
  );
}