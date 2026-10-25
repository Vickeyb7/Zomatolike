import React from 'react';
import { ShoppingBag, Utensils, LayoutGrid, Database, User, ShieldCheck } from 'lucide-react';

interface NavigationProps {
  activeTab: 'restaurant' | 'explore' | 'menu-admin' | 'profile' | 'schema';
  setActiveTab: (tab: 'restaurant' | 'explore' | 'menu-admin' | 'profile' | 'schema') => void;
  cartCount: number;
  onOpenCart: () => void;
  selectedRestaurantName?: string;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  selectedRestaurantName = 'Ludhiana Burrito',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#101116]/95 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark with subtle beta pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('restaurant')}
            className="group text-left flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
          >
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-rose-400 transition-colors whitespace-nowrap">
              zomato<span className="text-rose-500 font-extrabold">-lite</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded">
              Beta
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('restaurant')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'restaurant'
                ? 'text-white font-semibold border-b-2 border-rose-500 py-1'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Restaurant ({selectedRestaurantName.split(' ')[0]})</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'explore'
                ? 'text-white font-semibold border-b-2 border-rose-500 py-1'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Discover Places</span>
          </button>

          <button
            onClick={() => setActiveTab('menu-admin')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'menu-admin'
                ? 'text-white font-semibold border-b-2 border-rose-500 py-1'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Menu Partner Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'text-white font-semibold border-b-2 border-rose-500 py-1'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>PM Schema &amp; ERD</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'text-white font-semibold border-b-2 border-rose-500 py-1'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>User Profile</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            className="relative inline-flex items-center justify-center p-2 rounded-lg text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#101116] shadow-sm tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/50 transition-colors"
            title="User Profile: Vickey B."
          >
            <div className="w-7 h-7 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center justify-center text-xs font-bold">
              VB
            </div>
            <span className="hidden lg:inline text-xs font-medium text-zinc-300 truncate max-w-[80px]">
              Vickey B.
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-zinc-800/60 px-4 py-2 gap-2 text-xs scrollbar-none bg-[#0e0f14]">
        <button
          onClick={() => setActiveTab('restaurant')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'restaurant' ? 'bg-rose-600 text-white font-medium' : 'text-zinc-400 bg-zinc-800/50'
          }`}
        >
          Restaurant
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'explore' ? 'bg-rose-600 text-white font-medium' : 'text-zinc-400 bg-zinc-800/50'
          }`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('menu-admin')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'menu-admin' ? 'bg-emerald-600 text-white font-medium' : 'text-zinc-400 bg-zinc-800/50'
          }`}
        >
          Menu Hub
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'schema' ? 'bg-cyan-600 text-white font-medium' : 'text-zinc-400 bg-zinc-800/50'
          }`}
        >
          DB Schema
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap shrink-0 ${
            activeTab === 'profile' ? 'bg-rose-600 text-white font-medium' : 'text-zinc-400 bg-zinc-800/50'
          }`}
        >
          Profile
        </button>
      </div>
    </header>
  );
};
