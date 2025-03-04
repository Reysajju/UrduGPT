import React, { useState } from 'react';
import { Smile, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface MessageReactionsProps {
  messageId: string;
  onReact: (messageId: string, reaction: string) => void;
  onCopy: (content: string) => void;
  content: string;
}

const MessageReactions: React.FC<MessageReactionsProps> = ({ 
  messageId, 
  onReact, 
  onCopy,
  content 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const reactions = [
    { name: '👍' },
    { name: '❤️' },
    { name: '⭐' },
    { name: '🔖' },
  ];

  const handleReact = (reaction: string) => {
    onReact(messageId, reaction);
    setIsVisible(false);
    toast({
      title: "Reaction added",
      description: `You reacted with ${reaction}`,
    });
  };

  const handleCopy = () => {
    onCopy(content);
    setIsVisible(false);
    toast({
      title: "Copied to clipboard",
      description: "Message content copied to clipboard",
    });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Message actions"
      >
        <Smile size={14} />
      </Button>
      
      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 p-1 bg-background border border-border rounded-lg shadow-lg flex items-center gap-1 z-10">
          {reactions.map((reaction) => (
            <Button
              key={reaction.name}
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-accent"
              onClick={() => handleReact(reaction.name)}
              aria-label={`React with ${reaction.name}`}
            >
              {reaction.name}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-accent"
            onClick={handleCopy}
            aria-label="Copy message"
          >
            <Copy size={14} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageReactions;