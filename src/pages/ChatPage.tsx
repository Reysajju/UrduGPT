import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Chat from '@/components/Chat';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun, Menu, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Check system preferences for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('urduGptDarkMode');
    
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(prefersDark);
    }

    // Check if sidebar state is saved
    const savedSidebarState = localStorage.getItem('urduGptSidebarOpen');
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    } else {
      // Default to open on larger screens, closed on mobile
      setIsSidebarOpen(window.innerWidth > 768);
    }
  }, []);
  
  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('urduGptDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('urduGptSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDeleteChat = () => {
    // Clear chat history from localStorage
    localStorage.removeItem('urduGptChatHistory');
    
    toast({
      title: "Chat deleted",
      description: "Your chat history has been cleared.",
    });
  };

  return (
    <div className={`flex flex-col min-h-screen h-screen overflow-hidden bg-gradient-to-br from-urdu-light to-urdu-secondary/90 dark:from-urdu-dark dark:to-urdu-dark/90 ${darkMode ? 'dark' : ''}`}>
      <Helmet>
        <title>Chat with UrduGPT - AI-powered Urdu Poetry</title>
        <meta name="description" content="Chat with UrduGPT, an AI that responds with beautiful Urdu poetry. Experience the magic of AI-generated Urdu verse in real-time." />
        <meta name="theme-color" content={darkMode ? '#1A1F2C' : '#4A90E2'} />
        <meta property="og:title" content="Chat with UrduGPT - AI-powered Urdu Poetry" />
        <meta property="og:description" content="Chat with UrduGPT, an AI that responds with beautiful Urdu poetry. Experience the magic of AI-generated Urdu verse in real-time." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://urdu-gpt.com/chat" />
        <meta property="og:image" content="/og-image.png" />
      </Helmet>
      
      {/* Accessibility skip link */}
      <a href="#chat-main" className="skip-to-content">
        Skip to chat
      </a>
      
      {/* Header */}
      <header className="border-b border-white/10 py-3 px-4 md:py-4 md:px-6 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-foreground hover:bg-foreground/10"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Return to UrduGPT home page">
              <img 
                src="/urdu-logo.png" 
                alt="UrduGPT Logo" 
                className="h-8 w-8 rounded-xl"
              />
              <span className="font-bold text-lg md:text-xl text-foreground">UrduGPT</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleDarkMode}
              className="text-foreground hover:bg-foreground/10 text-sm"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="sr-only">{darkMode ? "Light mode" : "Dark mode"}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleDeleteChat}
              className="text-destructive hover:bg-destructive/10 text-sm"
              aria-label="Delete chat history"
            >
              <Trash2 size={18} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">Delete Chat</span>
            </Button>
            
            <Button variant="ghost" asChild className="text-foreground hover:bg-foreground/10 text-sm md:text-base">
              <Link to="/">
                <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content - Full height chat */}
      <main id="chat-main" className="flex-1 overflow-hidden">
        <div className="h-full">
          <Chat fullPage={true} sidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;