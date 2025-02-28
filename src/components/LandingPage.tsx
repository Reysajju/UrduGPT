
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoBackground from './VideoBackground';
import Logo from './Logo';
import Chat from './Chat';
import FirstVisitAlert from './FirstVisitAlert';
import { Button } from '@/components/ui/button';
import { ChevronDown, MessageSquare, ExternalLink } from 'lucide-react';

const LandingPage = () => {
  const [showChat, setShowChat] = useState(false);

  const scrollToChat = () => {
    setShowChat(true);
    setTimeout(() => {
      document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <FirstVisitAlert />
      
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center">
        <VideoBackground />
        
        <div className="container relative z-10 flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="animate-fade-in">
            <Logo className="mx-auto mb-8 animate-float" />
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white max-w-3xl leading-tight">
              Experience AI-powered Urdu Poetry Conversations
            </h1>
            
            <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg">
              Engage with an AI that communicates exclusively in beautiful Urdu verse,
              creating a unique poetic dialogue experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={scrollToChat} className="btn-primary text-lg px-8 py-6 rounded-full shadow-lg shadow-urdu-accent/20 hover:shadow-urdu-accent/30 transition-all duration-300 group">
                <span>Try Demo</span>
                <MessageSquare className="ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
              
              <Button asChild className="btn-secondary text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 group">
                <Link to="/chat">
                  <span>Full Experience</span>
                  <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollToChat}
              className="rounded-full text-white/70 hover:text-white hover:bg-white/10 p-2 border border-white/20"
            >
              <ChevronDown size={24} />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Chat Section */}
      <section 
        id="chat-section" 
        className="relative min-h-screen bg-urdu-dark py-20 px-4"
      >
        <div className="absolute inset-0 bg-gradient-radial from-urdu-accent/20 to-transparent opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Chat with UrduGPT</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Start your poetic journey with UrduGPT. Every response is crafted 
                as a unique piece of Urdu poetry.
              </p>
              
              <div className="mt-6">
                <Button asChild variant="outline" className="border-urdu-accent/30 text-white hover:bg-urdu-accent/10">
                  <Link to="/chat" className="flex items-center gap-2">
                    <span>Go to Full Screen Chat</span>
                    <ExternalLink size={16} />
                  </Link>
                </Button>
              </div>
            </div>
            
            {showChat ? (
              <div className="animate-scale-in h-[600px] md:h-[700px]">
                <Chat />
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setShowChat(true)} 
                  className="btn-primary group"
                >
                  <span>Start Chatting</span>
                  <MessageSquare className="ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative bg-urdu-dark py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          <Logo className="mx-auto mb-4" />
          <p>
            UrduGPT is an innovative AI chatbot for Urdu poetry lovers.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} UrduGPT | Made with <span className="text-red-500">❤</span> by Sajjad Rasool
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
