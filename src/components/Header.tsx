import React from 'react';
import { Brain, Plus } from 'lucide-react';

interface HeaderProps {
  onNewInterview: () => void;
  showNewButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNewInterview, showNewButton }) => {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Interview Prep</h1>
              <p className="text-sm text-gray-600">Your Personal Interview Coach</p>
            </div>
          </div>
          
          {showNewButton && (
            <button
              onClick={onNewInterview}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Interview
            </button>
          )}
        </div>
      </div>
    </header>
  );
};