import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="chat-bubble bot w-auto inline-flex items-center space-x-2 animate-pulse" role="status" aria-label="Assistant is typing">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs opacity-70">
          <Bot className="h-3 w-3" />
          <span>Assistant</span>
          <span className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;