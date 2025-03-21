import React from 'react';
import { X, Volume2 } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {
  const { sounds, darkMode, compactMessages, notifications, updateSettings } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-20"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-30 animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="h-16 border-b flex items-center justify-between px-6">
          <h2 id="settings-title" className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Dark mode</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={compactMessages}
                  onChange={(e) => updateSettings({ compactMessages: e.target.checked })}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Compact messages</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => updateSettings({ notifications: e.target.checked })}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span>Enable notifications</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sounds.enabled}
                    onChange={(e) => updateSettings({
                      sounds: { ...sounds, enabled: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>Sound effects</span>
                </label>
                {sounds.enabled && (
                  <div className="flex items-center gap-2 pl-6">
                    <Volume2 className="w-5 h-5 text-gray-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={sounds.volume}
                      onChange={(e) => updateSettings({
                        sounds: { ...sounds, volume: parseFloat(e.target.value) }
                      })}
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}