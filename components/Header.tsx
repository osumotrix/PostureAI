import React from 'react';
import { Activity, Info } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">PostureAI</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-teal-600 transition-colors p-2 rounded-full hover:bg-gray-50">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;