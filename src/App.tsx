import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Languages } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendAudioRef = useRef<HTMLAudioElement>(null);
  const receiveAudioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playSound = (type: 'send' | 'receive') => {
    const audio = type === 'send' ? sendAudioRef.current : receiveAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setError('');
    playSound('send');

    try {
      const response = await fetch('/.netlify/functions/generate-urdu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate text');
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      playSound('receive');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-primary px-4 py-3 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Languages className="w-8 h-8 text-white" />
          <h1 className="text-xl font-semibold text-white">UrduGPT</h1>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.isUser
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                }`}
              >
                <p 
                  className={`whitespace-pre-wrap ${message.isUser ? '' : 'font-urdu text-lg leading-relaxed'}`} 
                  dir={message.isUser ? 'ltr' : 'rtl'}
                >
                  {message.text}
                </p>
                <div
                  className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-foreground/80' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-50 text-red-500 rounded-lg px-4 py-2 text-sm">
                {error}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اپنا سوال تحریر کریں..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
            dir="rtl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn btn-primary !rounded-full !p-3"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Audio Elements */}
      <audio ref={sendAudioRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={receiveAudioRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;