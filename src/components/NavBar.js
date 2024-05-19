import { Link } from 'react-router-dom';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

function NavBar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              EcoEats
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/" className="hover:bg-primary-700 px-3 py-2 rounded-md transition-colors">
              Home
            </Link>
            <Link to="/generate" className="hover:bg-primary-700 px-3 py-2 rounded-md transition-colors">
              Generate Recipe
            </Link>
            <Link to="/recipes" className="hover:bg-primary-700 px-3 py-2 rounded-md transition-colors">
              My Recipes
            </Link>
            <Link to="/inventory" className="hover:bg-primary-700 px-3 py-2 rounded-md transition-colors">
              Inventory
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:bg-primary-700 px-3 py-2 rounded-md flex items-center transition-colors"
              type="button"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}

export default NavBar;