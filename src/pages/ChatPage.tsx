import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Chat from '@/components/Chat';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun } from 'lucide-react';

const ChatPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Check system preferences for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('urduGptDarkMode');
    
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(prefersDark);
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
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-br from-urdu-light to-urdu-secondary/90 dark:from-urdu-dark dark:to-urdu-dark/90 ${darkMode ? 'dark' : ''}`}>
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
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" aria-label="Return to UrduGPT home page">
            <Logo className="h-6 w-6 md:h-8 md:w-8" variant={darkMode ? 'dark' : 'light'} />
            <span className="font-bold text-lg md:text-xl text-foreground">UrduGPT</span>
          </Link>
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
            <Button variant="ghost" asChild className="text-foreground hover:bg-foreground/10 text-sm md:text-base">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="chat-main" className="flex-1 overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="container mx-auto h-full max-w-4xl">
          <div className="h-[calc(100vh-130px)]">
            <Chat fullPage={true} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 md:py-3 px-4 md:px-6 border-t border-white/10 text-center text-foreground/60 text-xs md:text-sm bg-background/50 backdrop-blur-md">
        <div className="container mx-auto">
          <p>UrduGPT © {new Date().getFullYear()} | Made with <span className="text-red-500" aria-hidden="true">❤</span><span className="sr-only">love</span> by Sajjad Rasool</p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;