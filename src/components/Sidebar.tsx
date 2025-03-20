import React from 'react';
import { Menu, X, MessageSquare, Settings, Trash2 } from 'lucide-react';
import { Message } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: Message[];
  onClearHistory: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({ isOpen, onToggle, messages, onClearHistory, onOpenSettings }: SidebarProps) {
  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-10
        ${isOpen ? 'w-80' : 'w-16'}`}
      aria-expanded={isOpen}
      role="complementary"
      aria-label="Chat history sidebar"
    >
      {/* Sidebar Header */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {isOpen && <h2 className="font-semibold">Chat History</h2>}
      </div>

      {/* Sidebar Content */}
      {isOpen && (
        <div className="p-4 space-y-6">
          {/* Navigation */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-teal-600 bg-teal-50 rounded-lg">
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Chat History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Recent Chats</h3>
              <button
                onClick={onClearHistory}
                className="text-red-500 hover:text-red-600 p-1 transition-colors"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="text-sm text-gray-500 mb-2">{date}</div>
                  {msgs.map((msg) => (
                    <div
                      key={msg.id}
                      className="text-sm py-1 px-2 hover:bg-gray-100 rounded cursor-pointer truncate transition-colors"
                    >
                      {msg.text.substring(0, 50)}
                      {msg.text.length > 50 && '...'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}