import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { ApiKeyModal } from './components/ApiKeyModal';
import { GeminiService } from './services/gemini';
import { useSound } from './hooks/useSound';
import type { Conversation, Message } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('apiKey')
  );
  const [showApiModal, setShowApiModal] = useState(!apiKey);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { playMessageSound } = useSound();
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (apiKey) {
      setGeminiService(new GeminiService(apiKey));
    }
  }, [apiKey]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeConversation]);

  const handleApiKeySubmit = (key: string) => {
    localStorage.setItem('apiKey', key);
    setApiKey(key);
    setShowApiModal(false);
    setGeminiService(new GeminiService(key));
    createNewChat();
  };

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'Nayi Guftagu',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversation(newConversation.id);
    setSidebarOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversation || !geminiService) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const userInteraction = async () => {
      try {
        await playMessageSound('send');
      } catch (error) {
        console.warn('Could not play sound:', error);
      }
    };
    userInteraction();

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
              messages: [...conv.messages, newMessage],
              updatedAt: new Date(),
            }
          : conv
      )
    );

    setIsTyping(true);

    try {
      const response = await geminiService.generateResponse(content);
      
      const responseMessage: Message = {
        id: crypto.randomUUID(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      try {
        await playMessageSound('receive');
      } catch (error) {
        console.warn('Could not play sound:', error);
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [...conv.messages, responseMessage],
                updatedAt: new Date(),
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error getting response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const activeMessages = conversations.find(
    (conv) => conv.id === activeConversation
  )?.messages || [];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={createNewChat}
        onSelectConversation={setActiveConversation}
        onSearch={(query) => {
          // Implement conversation search
          const searchTerm = query.toLowerCase();
          return conversations.filter(conv => 
            conv.title.toLowerCase().includes(searchTerm) ||
            conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm))
          );
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatInterface
        messages={activeMessages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        inputRef={inputRef}
      />
      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSubmit={handleApiKeySubmit}
      />
    </div>
  );
}

export default App;