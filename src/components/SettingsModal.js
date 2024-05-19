import React, { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedApiKey = localStorage.getItem('openai_api_key');
    const savedDarkMode = localStorage.getItem('dark_mode') === 'true';
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedDarkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('dark_mode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 transition-colors"
            aria-label="Close settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md 
                       bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       placeholder-secondary-400 dark:placeholder-secondary-500"
              placeholder="Enter your OpenAI API key"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-secondary-500 dark:text-secondary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 ml-2">
                Dark Mode
              </span>
            </div>
            <button
              onClick={handleDarkModeToggle}
              aria-pressed={isDarkMode}
              aria-label="Toggle dark mode"
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                ${isDarkMode ? 'bg-primary-600' : 'bg-secondary-400'}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
                  ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 