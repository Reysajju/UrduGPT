import React from 'react';
import { Search, Plus, Settings, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onSearch: (query: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  conversations,
  activeConversation,
  onNewChat,
  onSelectConversation,
  onSearch,
  isOpen,
  onToggle,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-3 left-3 z-50 p-2 rounded-lg bg-gray-800 text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        <div className="p-3 sm:p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors text-sm sm:text-base"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        <div className="px-3 sm:px-4 mb-3 sm:mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-800 transition-colors ${
                activeConversation === conv.id ? 'bg-gray-800' : ''
              }`}
            >
              <p className="text-sm truncate">{conv.title}</p>
              <p className="text-xs text-gray-400">
                {new Date(conv.updatedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>

        <div className="p-3 sm:p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}