// frontend/components/pages/PreferencesPage.jsx
'use client';

import * as Icons from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
    fontSize: 'medium',
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success('Preference updated');
  };

  const handleFontSizeChange = (size) => {
    setPreferences(prev => ({
      ...prev,
      fontSize: size
    }));
    toast.success(`Font size changed to ${size}`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Preferences</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Customize your Nexus experience</p>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        {/* Notifications */}
        <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.Bell className="w-6 h-6 text-primary-500" />
              <div>
                <h3 className="font-bold text-ash-900 dark:text-white">Email Notifications</h3>
                <p className="text-sm text-ash-600 dark:text-ash-400">Receive email updates for important events</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.emailNotifications ? 'bg-primary-500' : 'bg-ash-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Auto-save */}
        <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icons.Save className="w-6 h-6 text-green-500" />
              <div>
                <h3 className="font-bold text-ash-900 dark:text-white">Auto-Save</h3>
                <p className="text-sm text-ash-600 dark:text-ash-400">Automatically save your notes</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`w-12 h-6 rounded-full transition-colors ${
                preferences.autoSave ? 'bg-primary-500' : 'bg-ash-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                preferences.autoSave ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
          <div className="flex items-center gap-4 mb-4">
            <Icons.Type className="w-6 h-6 text-blue-500" />
            <div>
              <h3 className="font-bold text-ash-900 dark:text-white">Font Size</h3>
              <p className="text-sm text-ash-600 dark:text-ash-400">Choose your preferred font size</p>
            </div>
          </div>
          <div className="flex gap-3">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  preferences.fontSize === size
                    ? 'bg-primary-500 text-white'
                    : 'bg-ash-100 dark:bg-ash-700 text-ash-900 dark:text-white hover:bg-ash-200 dark:hover:bg-ash-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
