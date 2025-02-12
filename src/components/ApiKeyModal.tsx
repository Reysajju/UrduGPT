import React, { useState } from 'react';
import type { ApiKeyModalProps } from '../types';

export function ApiKeyModal({ isOpen, onClose, onSubmit }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Welcome to UrduGPT - Urdu Poetry Assistant</h2>
        <p className="text-gray-300 mb-4">
          Experience the beauty of Urdu poetry with our AI assistant. To begin your poetic journey, please enter your Gemini API key from Google AI Studio.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key..."
            className="w-full px-4 py-2 bg-gray-700 rounded-lg mb-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white"
            >
              Begin Poetry Journey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}