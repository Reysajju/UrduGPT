import React, { useState, useEffect } from 'react';
import { Search, Pin, PinOff, Star, Clock, Trash2, Plus, X, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export interface ChatConversation {
  id: string;
  title: string;
  timestamp: number;
  isPinned: boolean;
  preview: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  currentChatId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  onSelectChat,
  currentChatId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<ChatConversation[]>([]);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('urduGptConversations');
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations));
      } catch (error) {
        console.error('Failed to parse saved conversations:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('urduGptConversations', JSON.stringify(conversations));
  }, [conversations]);

  const togglePin = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, isPinned: !conv.isPinned } : conv
      )
    );
  };

  const deleteConversation = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setConversations(prev => prev.filter(conv => conv.id !== id));
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations: pinned first, then by timestamp (newest first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-background border-r border-border shadow-lg transition-all duration-500 ease-in-out transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 md:z-10 md:h-full",
          isOpen ? "md:w-72" : "md:w-0 md:border-0 md:opacity-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="font-semibold text-lg">Conversations</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search conversations..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            className="mx-3 mb-2 flex items-center gap-2"
            onClick={onNewChat}
          >
            <Plus size={16} />
            New Chat
          </Button>
          
          <ScrollArea className="flex-1 px-3 py-2">
            {sortedConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedConversations.map((conv) => (
                  <div 
                    key={conv.id}
                    className={cn(
                      "p-3 rounded-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-102",
                      "hover:bg-accent/50 hover:text-accent-foreground",
                      "group relative",
                      currentChatId === conv.id ? "bg-accent text-accent-foreground" : "bg-secondary/50"
                    )}
                    onClick={() => onSelectChat(conv.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {conv.isPinned && <Pin size={14} className="text-urdu-accent flex-shrink-0" />}
                          <h3 className="font-medium truncate">{conv.title}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {conv.preview}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} className="flex-shrink-0" />
                        {formatDistanceToNow(conv.timestamp, { addSuffix: true })}
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={(e) => togglePin(conv.id, e)}
                          aria-label={conv.isPinned ? "Unpin conversation" : "Pin conversation"}
                        >
                          {conv.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive/80 flex-shrink-0"
                          onClick={(e) => deleteConversation(conv.id, e)}
                          aria-label="Delete conversation"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-3 border-t border-border">
            <div className="text-xs text-muted-foreground">
              <p>UrduGPT by Sajjad Rasool</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;