
import React from 'react';
import { Loader2 } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="chat-bubble bot w-auto inline-flex items-center space-x-2 animate-pulse">
      <div className="flex space-x-1 items-center">
        <div className="text-xs opacity-70">UrduGPT is composing Urdu poetry (اردو شاعری)</div>
        <Loader2 className="h-4 w-4 animate-spin opacity-70" />
      </div>
    </div>
  );
};

export default TypingIndicator;
