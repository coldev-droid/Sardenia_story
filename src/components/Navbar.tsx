import React from 'react';
import { BookOpen, Sparkles, Compass, Shield, Award, MessageSquareCode } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'books', label: 'The 5 Books', icon: BookOpen },
    { id: 'studio', label: 'Chapter Generator', icon: Sparkles },
    { id: 'lore', label: 'Sardinia Lore', icon: Compass },
    { id: 'amulets', label: 'Amulets', icon: Shield },
    { id: 'checklist', label: 'Award Ready', icon: Award },
    { id: 'brain', label: 'Ask The Brain', icon: MessageSquareCode },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/40 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('books')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center shadow-lg border border-amber-500/30">
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-serif font-bold tracking-wide bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400 bg-clip-text text-transparent">
                THE BRAIN
              </span>
              <span className="block text-xs uppercase tracking-widest text-amber-400/80 font-medium">
                Sardinian Epic Saga • 5 Award-Winning Books
              </span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-inner'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-amber-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex overflow-x-auto space-x-1 px-4 py-2 bg-stone-950 border-t border-stone-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                isActive ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'text-stone-400 bg-stone-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
