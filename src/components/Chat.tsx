import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageProps } from './ChatMessage';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Trash2, Info, Image, Mic, Smile, Volume2, VolumeX } from 'lucide-react';
import { generateResponse } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { playMessageSentSound, playMessageReceivedSound } from '@/services/sound';
import EmojiPicker from './EmojiPicker';
import FileUploader from './FileUploader';
import VoiceRecorder from './VoiceRecorder';
import FileDropZone from './FileDropZone';

interface ChatProps {
  fullPage?: boolean;
}

const Chat = ({ fullPage = false }: ChatProps) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);

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
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle new message highlighting
  useEffect(() => {
    if (newMessageId) {
      const timer = setTimeout(() => {
        setNewMessageId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [newMessageId]);

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
    setNewMessageId(userMessage.id);

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
      setNewMessageId(botMessage.id);
      
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
      setShowEmojiPicker(false);
      setShowFileUploader(false);
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

  const handleEmojiSelect = (emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleFileUpload = (fileContent: string) => {
    if (fileContent) {
      setInput(prev => prev + (prev ? '\n\n' : '') + fileContent);
      setShowFileUploader(false);
      inputRef.current?.focus();
      
      toast({
        title: "File content added",
        description: "The file content has been added to your message.",
      });
    }
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript) {
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      inputRef.current?.focus();
      
      toast({
        title: "Voice input added",
        description: "Your speech has been converted to text.",
      });
    }
    setIsRecording(false);
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (showEmojiPicker) setShowEmojiPicker(false);
    if (showFileUploader) setShowFileUploader(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (isRecording) setIsRecording(false);
    if (showFileUploader) setShowFileUploader(false);
  };

  const toggleFileUploader = () => {
    setShowFileUploader(!showFileUploader);
    if (showEmojiPicker) setShowEmojiPicker(false);
    if (isRecording) setIsRecording(false);
  };

  const handleFileDrop = (file: File) => {
    // Show file uploader with the dropped file
    setShowFileUploader(true);
    
    // Process the file in the FileUploader component
    if (file) {
      // Create a fake event with the file
      const dummyEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      // Call the FileUploader's handleFileChange method
      const fileUploader = document.querySelector('input[type="file"]');
      if (fileUploader) {
        const event = new Event('change', { bubbles: true });
        Object.defineProperty(event, 'target', { value: { files: [file] } });
        fileUploader.dispatchEvent(event);
      }
    }
  };

  return (
    <FileDropZone onFileDrop={handleFileDrop}>
      <div 
        className={`flex flex-col glass-effect rounded-xl overflow-hidden border border-urdu-accent/20 h-full shadow-lg`}
        aria-label="Chat with UrduGPT"
      >
        {/* Skip to content link for accessibility */}
        <a href="#chat-input" className="skip-to-content">
          Skip to chat input
        </a>
        
        <div className="flex justify-between items-center p-4 border-b border-white/10 bg-urdu-accent/20">
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-lg">Chat with UrduGPT</h2>
            <div className="tooltip" data-tip="All chat history is stored locally in your browser">
              <Info size={16} className="text-white/50 hover:text-white cursor-help transition-colors" aria-hidden="true" />
              <span className="sr-only">All chat history is stored locally in your browser</span>
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
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="sr-only">{soundEnabled ? "Disable sound" : "Enable sound"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-sm text-white/70 hover:text-white flex items-center gap-1"
              aria-label="Clear chat history"
            >
              <Trash2 size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Clear chat</span>
            </Button>
          </div>
        </div>

        <div 
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gradient-to-b from-secondary/30 to-background/80`}
          role="log"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
              <p className="text-lg font-medium mb-2">Welcome to UrduGPT</p>
              <p className="text-sm max-w-md">
                Start a conversation with me and I'll respond with beautiful Urdu poetry.
                Your chat history is saved in your browser.
              </p>
              <p className="text-sm mt-4 text-urdu-accent">
                Tip: You can drag and drop files anywhere on this page!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isNew={message.id === newMessageId}
              />
            ))
          )}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="p-3 border-t border-white/10 bg-secondary/30 relative"
          aria-label="Chat input form"
        >
          {showEmojiPicker && (
            <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
          )}
          
          {showFileUploader && (
            <FileUploader onFileContent={handleFileUpload} onClose={() => setShowFileUploader(false)} />
          )}
          
          {isRecording && (
            <VoiceRecorder onTranscript={handleVoiceInput} onClose={() => setIsRecording(false)} />
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-none md:flex">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-white/70 hover:text-white hover:bg-urdu-accent/20"
                aria-label="Attach image or document"
                onClick={toggleFileUploader}
              >
                <Image size={18} aria-hidden="true" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className={`rounded-full ${isRecording ? 'text-urdu-accent animate-pulse' : 'text-white/70'} hover:text-white hover:bg-urdu-accent/20`}
                aria-label={isRecording ? "Stop recording" : "Record audio"}
                onClick={toggleVoiceRecording}
              >
                <Mic size={18} aria-hidden="true" />
                <span className="sr-only">{isRecording ? "Stop recording" : "Record audio"}</span>
              </Button>
            </div>
            
            <Input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="input-primary flex-1"
              disabled={isLoading}
              aria-label="Type your message"
              aria-describedby="chat-submit"
            />
            
            <Button
              type="button" 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${showEmojiPicker ? 'text-urdu-accent' : 'text-white/70'} hover:text-white hover:bg-urdu-accent/20 hidden md:flex`}
              aria-label="Add emoji"
              onClick={toggleEmojiPicker}
            >
              <Smile size={18} aria-hidden="true" />
              <span className="sr-only">Add emoji</span>
            </Button>
            
            <Button
              id="chat-submit"
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary aspect-square p-2.5 rounded-full"
              aria-label="Send message"
            >
              <Send size={18} aria-hidden="true" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </FileDropZone>
  );
};

export default Chat;