import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageProps } from './ChatMessage';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Image, Mic, Smile, Volume2, VolumeX, ArrowUp, Menu, X } from 'lucide-react';
import { generateResponse } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { playMessageSentSound, playMessageReceivedSound } from '@/services/sound';
import EmojiPicker from './EmojiPicker';
import FileUploader from './FileUploader';
import VoiceRecorder from './VoiceRecorder';
import FileDropZone from './FileDropZone';
import ChatSidebar, { ChatConversation } from './ChatSidebar';
import ScrollToTopButton from './ScrollToTopButton';
import MediaUploader from './MediaUploader';

interface ChatProps {
  fullPage?: boolean;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const Chat = ({ fullPage = false, sidebarOpen = false, onToggleSidebar }: ChatProps) => {
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
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(sidebarOpen);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({});
  const [currentMedia, setCurrentMedia] = useState<{ type: string; data: string } | null>(null);

  // Update sidebar state when prop changes
  useEffect(() => {
    setIsSidebarOpen(sidebarOpen);
  }, [sidebarOpen]);

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

    // Load conversations
    const savedConversations = localStorage.getItem('urduGptConversations');
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (error) {
        console.error('Failed to parse saved conversations:', error);
      }
    }

    // Load current chat ID
    const savedChatId = localStorage.getItem('urduGptCurrentChatId');
    if (savedChatId) {
      setCurrentChatId(savedChatId);
    }

    // Load message reactions
    const savedReactions = localStorage.getItem('urduGptMessageReactions');
    if (savedReactions) {
      try {
        setMessageReactions(JSON.parse(savedReactions));
      } catch (error) {
        console.error('Failed to parse saved reactions:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('urduGptChatHistory', JSON.stringify(messages));
    
    // Update conversation preview if we have a current chat
    if (currentChatId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentChatId 
            ? { 
                ...conv, 
                preview: lastMessage.content.substring(0, 60) + (lastMessage.content.length > 60 ? '...' : ''),
                timestamp: Date.now()
              } 
            : conv
        )
      );
    }
  }, [messages, currentChatId]);
  
  // Save sound setting to localStorage
  useEffect(() => {
    localStorage.setItem('urduGptSoundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('urduGptConversations', JSON.stringify(conversations));
  }, [conversations]);

  // Save current chat ID to localStorage
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem('urduGptCurrentChatId', currentChatId);
    }
  }, [currentChatId]);

  // Save message reactions to localStorage
  useEffect(() => {
    localStorage.setItem('urduGptMessageReactions', JSON.stringify(messageReactions));
  }, [messageReactions]);

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
    if ((!input.trim() && !currentMedia) || isLoading) return;

    // Create a new chat if this is the first message
    if (!currentChatId) {
      createNewChat(input);
    }

    // Play sent sound if enabled
    if (soundEnabled) {
      playMessageSentSound();
    }

    // Prepare message content
    let messageContent = input.trim();
    
    // Add media description if present
    if (currentMedia) {
      const mediaType = currentMedia.type === 'image' ? 'Image' : 'Audio';
      if (messageContent) {
        messageContent += `\n\n[${mediaType} attached]`;
      } else {
        messageContent = `[${mediaType} attached]`;
      }
    }

    const userMessage: MessageProps = {
      id: Date.now().toString(),
      content: messageContent,
      role: 'user',
      timestamp: Date.now(),
      status: 'loading',
      media: currentMedia || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setNewMessageId(userMessage.id);
    
    // Clear current media after sending
    const mediaCopy = currentMedia;
    setCurrentMedia(null);

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
        messages,
        mediaCopy
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
      setShowMediaUploader(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
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

  const handleMediaSelect = (mediaData: { type: string; data: string }) => {
    if (mediaData.data) {
      setCurrentMedia(mediaData);
      setShowMediaUploader(false);
      
      toast({
        title: `${mediaData.type === 'image' ? 'Image' : 'Audio'} added`,
        description: `Your ${mediaData.type} has been attached to the message.`,
      });
    } else {
      setCurrentMedia(null);
    }
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (showEmojiPicker) setShowEmojiPicker(false);
    if (showFileUploader) setShowFileUploader(false);
    if (showMediaUploader) setShowMediaUploader(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (isRecording) setIsRecording(false);
    if (showFileUploader) setShowFileUploader(false);
    if (showMediaUploader) setShowMediaUploader(false);
  };

  const toggleFileUploader = () => {
    setShowFileUploader(!showFileUploader);
    if (showEmojiPicker) setShowEmojiPicker(false);
    if (isRecording) setIsRecording(false);
    if (showMediaUploader) setShowMediaUploader(false);
  };

  const toggleMediaUploader = () => {
    setShowMediaUploader(!showMediaUploader);
    if (showEmojiPicker) setShowEmojiPicker(false);
    if (isRecording) setIsRecording(false);
    if (showFileUploader) setShowFileUploader(false);
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

  const createNewChat = (firstMessage?: string) => {
    // Clear current messages
    setMessages([]);
    
    // Generate a new chat ID
    const newChatId = `chat_${Date.now()}`;
    setCurrentChatId(newChatId);
    
    // Add to conversations
    const newConversation: ChatConversation = {
      id: newChatId,
      title: firstMessage && typeof firstMessage === 'string' 
        ? firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '') 
        : 'New Conversation',
      timestamp: Date.now(),
      isPinned: false,
      preview: firstMessage && typeof firstMessage === 'string' 
        ? firstMessage 
        : 'Start a new conversation'
    };
    
    setConversations(prev => [newConversation, ...prev]);
    
    // Focus input
    inputRef.current?.focus();
    
    toast({
      title: "New chat created",
      description: "You can start a new conversation now.",
    });
  };

  const selectChat = (chatId: string) => {
    // Save current chat if needed
    
    // Set new current chat
    setCurrentChatId(chatId);
    
    // Load messages for this chat
    // In a real app, you'd load messages from a database or API
    // For now, we'll just clear the messages as a placeholder
    setMessages([]);
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
      if (onToggleSidebar) onToggleSidebar();
    }
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessageReactions(prev => {
      const existing = prev[messageId] || [];
      if (!existing.includes(reaction)) {
        return {
          ...prev,
          [messageId]: [...existing, reaction]
        };
      }
      return prev;
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (onToggleSidebar) onToggleSidebar();
  };

  return (
    <FileDropZone onFileDrop={handleFileDrop}>
      <div className="flex h-full">
        {/* Sidebar */}
        <ChatSidebar 
          isOpen={isSidebarOpen}
          onClose={handleToggleSidebar}
          onNewChat={createNewChat}
          onSelectChat={selectChat}
          currentChatId={currentChatId}
        />
        
        <div 
          className="flex flex-col glass-effect rounded-xl overflow-hidden border border-urdu-accent/20 h-full shadow-lg flex-1 relative"
          aria-label="Chat with UrduGPT"
          style={{ height: fullPage ? '100vh' : '100%' }}
        >
          {/* Skip to content link for accessibility */}
          <a href="#chat-input" className="skip-to-content">
            Skip to chat input
          </a>
          
          {/* Volume control button - positioned at the top */}
          <div className="absolute top-3 right-3 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSound}
              className="text-sm text-white/70 hover:text-white bg-urdu-accent/20 backdrop-blur-sm rounded-full"
              aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span className="sr-only">{soundEnabled ? "Disable sound" : "Enable sound"}</span>
            </Button>
          </div>

          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 bg-gradient-to-b from-secondary/30 to-background/80"
            role="log"
            aria-live="polite"
            aria-atomic="false"
            style={{ flexGrow: 1, overflowY: 'auto' }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-70">
                <p className="text-lg font-medium mb-2">Welcome to Chat</p>
                <p className="text-sm max-w-md">
                  Start a conversation and I'll respond with helpful information.
                  Your chat history is saved in your browser.
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full">
                  <Button 
                    variant="outline" 
                    className="flex justify-start p-4 h-auto"
                    onClick={() => setInput("Tell me a poem about love")}
                  >
                    <div className="text-left">
                      <p className="font-medium">Tell me a poem about love</p>
                      <p className="text-xs text-muted-foreground mt-1">Get a romantic poem</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex justify-start p-4 h-auto"
                    onClick={() => setInput("Write a story about the moon")}
                  >
                    <div className="text-left">
                      <p className="font-medium">Write a story about the moon</p>
                      <p className="text-xs text-muted-foreground mt-1">Experience creative storytelling</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex justify-start p-4 h-auto"
                    onClick={() => setInput("Create a humorous verse about technology")}
                  >
                    <div className="text-left">
                      <p className="font-medium">Humorous verse about technology</p>
                      <p className="text-xs text-muted-foreground mt-1">Get a funny take on modern life</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex justify-start p-4 h-auto"
                    onClick={() => setInput("Compose a poem about the changing seasons")}
                  >
                    <div className="text-left">
                      <p className="font-medium">Poem about changing seasons</p>
                      <p className="text-xs text-muted-foreground mt-1">Nature-inspired poetry</p>
                    </div>
                  </Button>
                </div>
                <p className="text-sm mt-6 text-urdu-accent">
                  Tip: You can drag and drop files anywhere on this page!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  isNew={message.id === newMessageId}
                  reactions={messageReactions[message.id] || []}
                  onReact={handleReaction}
                  onCopy={copyToClipboard}
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
            style={{ flexShrink: 0 }}
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
            
            {showMediaUploader && (
              <MediaUploader onMediaSelect={handleMediaSelect} onClose={() => setShowMediaUploader(false)} />
            )}
            
            {/* Display current media preview */}
            {currentMedia && (
              <div className="mb-2 p-2 bg-background/50 rounded-md flex items-center gap-2">
                {currentMedia.type === 'image' ? (
                  <div className="relative w-12 h-12">
                    <img 
                      src={currentMedia.data} 
                      alt="Attached" 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="bg-urdu-accent/20 p-2 rounded-md">
                    <FileAudio2 size={20} className="text-urdu-accent" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {currentMedia.type === 'image' ? 'Image attached' : 'Audio attached'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setCurrentMedia(null)}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-none md:flex">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-white/70 hover:text-white hover:bg-urdu-accent/20"
                  aria-label="Attach image or audio"
                  onClick={toggleMediaUploader}
                >
                  <Image size={18} aria-hidden="true" />
                  <span className="sr-only">Attach media</span>
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
                disabled={isLoading || (!input.trim() && !currentMedia)}
                className="btn-primary aspect-square p-2.5 rounded-full"
                aria-label="Send message"
              >
                <Send size={18} aria-hidden="true" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
          
          {/* Sidebar toggle button - mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebar}
            className="absolute left-3 top-3 md:hidden bg-urdu-accent/20 backdrop-blur-sm rounded-full text-white/70 hover:text-white"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
          
          {/* Scroll to top button */}
          <ScrollToTopButton containerRef={chatContainerRef} />
        </div>
      </div>
    </FileDropZone>
  );
};

export default Chat;