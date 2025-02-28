import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Common emojis for quick access
  const commonEmojis = [
    '😊', '😂', '❤️', '👍', '🙏', '🎉', '✨', '🔥', '💯', '👏',
    '😍', '🤔', '😢', '😎', '🌹', '🌟', '📚', '🎵', '🎨', '✍️',
    '🕊️', '🌙', '☀️', '🌈', '🌊', '🍁', '🌷', '🌺', '🏔️', '🌃'
  ];
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-16 left-0 w-full max-w-xs mx-3 p-3 bg-background/95 backdrop-blur-md rounded-lg shadow-lg border border-urdu-accent/20 z-10"
      aria-label="Emoji picker"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Select an emoji</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-secondary"
          aria-label="Close emoji picker"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="text-xl p-2 hover:bg-secondary rounded-md transition-colors"
            aria-label={`Emoji ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;