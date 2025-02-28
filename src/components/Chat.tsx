
import React, { useState, useRef, useEffect } from 'react';
import { MessageProps } from './ChatMessage';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Trash2, Info, Image, Mic, Smile } from 'lucide-react';
import { generateResponse } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { playMessageSentSound, playMessageReceivedSound } from '@/services/sound';

interface ChatProps {
  fullPage?: boolean;
}

const Chat = ({ fullPage = false }: ChatProps) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('urduGptChatHistory');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
        localStorage.removeItem('urduGptChatHistory');
      }
    }
    
    // Check if sound is enabled
    const soundSetting = localStorage.getItem('urduGptSoundEnabled');
    if (soundSetting !== null) {
      setSoundEnabled(JSON.parse(soundSetting));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('urduGptChatHistory', JSON.stringify(messages));
  }, [messages]);
  
  // Save sound setting to localStorage
  useEffect(() => {
    localStorage.setItem('urduGptSoundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Play sent sound if enabled
    if (soundEnabled) {
      playMessageSentSound();
    }

    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: Date.now(),
      status: 'loading'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Update message status to sent after a short delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'sent' } 
              : msg
          )
        );
      }, 500);

      const response = await generateResponse(
        input, 
        messages
      );

      // Update message status to delivered
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );

      const botMessage: MessageProps = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Play received sound if enabled
      if (soundEnabled) {
        playMessageReceivedSound();
      }

      // Update message status to read after a short delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === userMessage.id 
              ? { ...msg, status: 'read' } 
              : msg
          )
        );
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
      
      // Update failed message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('urduGptChatHistory');
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
    });
  };
  
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? "Sound disabled" : "Sound enabled",
      description: soundEnabled ? "Message sounds have been turned off." : "Message sounds have been turned on.",
    });
  };

  return (
    <div className={`flex flex-col glass-effect rounded-xl overflow-hidden border border-urdu-accent/20 h-full shadow-lg`}>
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-urdu-accent/20">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-lg">Chat with UrduGPT</h2>
          <div className="tooltip" data-tip="All chat history is stored locally in your browser">
            <Info size={16} className="text-white/50 hover:text-white cursor-help transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSound}
            className="text-sm text-white/70 hover:text-white"
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-sm text-white/70 hover:text-white flex items-center gap-1"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear chat</span>
          </Button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gradient-to-b from-secondary/30 to-background/80`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
            <p className="text-lg font-medium mb-2">Welcome to UrduGPT</p>
            <p className="text-sm max-w-md">
              Start a conversation with me and I'll respond with beautiful Urdu poetry.
              Your chat history is saved in your browser.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-secondary/30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-none md:flex">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-white/70 hover:text-white hover:bg-urdu-accent/20"
              aria-label="Attach image"
            >
              <Image size={18} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-white/70 hover:text-white hover:bg-urdu-accent/20"
              aria-label="Record audio"
            >
              <Mic size={18} />
            </Button>
          </div>
          
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-primary flex-1"
            disabled={isLoading}
          />
          
          <Button
            type="button" 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-white/70 hover:text-white hover:bg-urdu-accent/20 hidden md:flex"
            aria-label="Add emoji"
          >
            <Smile size={18} />
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary aspect-square p-2.5 rounded-full"
            aria-label="Send message"
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
