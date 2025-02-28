
import React from 'react';
import { Link } from 'react-router-dom';
import Chat from '@/components/Chat';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ChatPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-urdu-dark to-urdu-dark/90">
      {/* Header */}
      <header className="border-b border-white/10 py-3 px-4 md:py-4 md:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo className="h-6 w-6 md:h-8 md:w-8" />
            <span className="font-bold text-lg md:text-xl text-white">UrduGPT</span>
          </Link>
          <Button variant="ghost" asChild className="text-white hover:bg-white/10 text-sm md:text-base">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="container mx-auto h-full max-w-4xl">
          <div className="h-[calc(100vh-130px)]">
            <Chat fullPage={true} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-2 md:py-3 px-4 md:px-6 border-t border-white/10 text-center text-white/60 text-xs md:text-sm">
        <div className="container mx-auto">
          <p>UrduGPT © {new Date().getFullYear()} | Made with <span className="text-red-500">❤</span> by Sajjad Rasool</p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
