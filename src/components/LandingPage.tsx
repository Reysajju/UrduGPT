import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Moon, Sun } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';
import Logo from '@/components/Logo';
import FirstVisitAlert from '@/components/FirstVisitAlert';
import Chat from '@/components/Chat';

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Check system preferences for dark mode and battery status
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('urduGptDarkMode');
    
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(prefersDark);
    }
    
    // Check if battery API is available
    if ('getBattery' in navigator) {
      // @ts-ignore - getBattery is not in the TypeScript navigator type
      navigator.getBattery().then((battery) => {
        setLowPowerMode(!battery.charging && battery.level < 0.2);
        
        battery.addEventListener('levelchange', () => {
          setLowPowerMode(!battery.charging && battery.level < 0.2);
        });
        
        battery.addEventListener('chargingchange', () => {
          setLowPowerMode(!battery.charging && battery.level < 0.2);
        });
      });
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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Helmet>
        <meta name="theme-color" content={darkMode ? '#1A1F2C' : '#4A90E2'} />
      </Helmet>
      
      {/* First visit alert */}
      <FirstVisitAlert />
      
      {/* Video Background */}
      <VideoBackground lowPowerMode={lowPowerMode} />
      
      {/* Overlay for video */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="relative z-20 py-4 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <Logo variant="light" />
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleDarkMode}
                className="text-white hover:bg-white/10 text-sm"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span className="sr-only">{darkMode ? "Light mode" : "Dark mode"}</span>
              </Button>
              <Button asChild variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                <Link to="/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Open Chat</span>
                  <span className="sm:hidden">Chat</span>
                </Link>
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-12">
            {/* Left column - Hero text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Experience AI-powered<br />
                <span className="text-urdu-accent">Urdu Poetry</span> Conversations
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Chat with UrduGPT, an AI that responds with beautiful Urdu poetry. 
                Experience the magic of AI-generated Urdu verse in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="btn-primary">
                  <Link to="/chat">
                    Start Chatting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-white border-white/20 hover:bg-white/10 hover:text-white"
                  onClick={() => setShowDemo(!showDemo)}
                >
                  {showDemo ? "Hide Demo" : "Try Demo"}
                </Button>
              </div>
            </div>
            
            {/* Right column - Demo or Features */}
            <div className="flex-1 w-full max-w-xl mx-auto lg:mx-0">
              {showDemo ? (
                <div className="h-[500px] max-h-[70vh]">
                  <Chat />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Urdu Poetry",
                      description: "Experience AI-generated Urdu poetry in various traditional forms like ghazal, nazm, and rubai."
                    },
                    {
                      title: "Real-time Responses",
                      description: "Get instant poetic responses to your messages, creating a flowing conversation."
                    },
                    {
                      title: "Cultural Richness",
                      description: "Immerse yourself in the rich literary tradition of Urdu poetry and language."
                    },
                    {
                      title: "Accessible Anywhere",
                      description: "Use UrduGPT on any device with a browser, with offline capabilities as a PWA."
                    }
                  ].map((feature, index) => (
                    <div key={index} className="glass-effect p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/70">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-4 text-center text-white/60 text-sm">
          <div className="container mx-auto">
            <p>UrduGPT © {new Date().getFullYear()} | Made with <span className="text-red-500" aria-hidden="true">❤</span><span className="sr-only">love</span> by Sajjad Rasool</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;