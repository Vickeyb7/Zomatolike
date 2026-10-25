import React, { useState } from 'react';
import { Restaurant, MenuItem, Review } from '../types';
import { 
  Clock, 
  MapPin, 
  Flame, 
  Plus, 
  Minus, 
  Check, 
  Info, 
  Share2, 
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';

interface RestaurantViewProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  reviews: Review[];
  onOpenWriteReview: () => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateCartQuantity: (itemId: string, delta: number) => void;
  getCartItemQuantity: (itemId: string) => number;
}

export const RestaurantView: React.FC<RestaurantViewProps> = ({
  restaurant,
  menuItems,
  reviews,
  onOpenWriteReview,
  onAddToCart,
  onUpdateCartQuantity,
  getCartItemQuantity,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'reviews' | 'menu' | 'info'>('reviews');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Latest review is either marked isLatest or the first in sorted list
  const latestReview = reviews.find((r) => r.isLatest) || reviews[0];
  const earlierReviews = reviews.filter((r) => r.id !== latestReview?.id);

  // Filter menu items for Menu tab
  const filteredMenuItems = menuItems.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (vegFilter === 'veg' && item.vegType !== 'veg') return false;
    if (vegFilter === 'non-veg' && item.vegType !== 'non-veg') return false;
    return true;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#111217] text-zinc-100 pb-28">
      {/* Simulation of browser / vercel breadcrumb header as in screenshot */}
      <div className="bg-[#0b0c10] border-b border-zinc-800/60 px-4 py-2 text-xs text-zinc-400 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="text-zinc-600">route:</span>
          <span className="text-rose-400">zomato-lite-black.vercel.app/restaurant/{restaurant.id}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-zinc-500">
          <span>PostgreSQL Active</span>
          <span>·</span>
          <span>Latency: 24ms</span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pt-6">
        {/* Main Card with Red Hero Pattern and Restaurant Metadata */}
        <section className="bg-[#17181f] rounded-2xl border border-zinc-800/90 overflow-hidden shadow-xl">
          {/* Top patterned red banner with Initials "LB" matching screenshot */}
          <div className="relative h-44 sm:h-48 bg-gradient-to-br from-[#c81e3a] via-[#b91c1c] to-[#991b1b] flex items-center justify-center overflow-hidden">
            {/* Subtle halftone/dot grid texture */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)',
                backgroundSize: '14px 14px',
              }}
            />
            {/* Initials LB */}
            <div className="relative z-10 select-none">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-wider text-white drop-shadow-md">
                {restaurant.initials}
              </span>
            </div>

            {/* Quick action buttons top-right */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full backdrop-blur-md transition-all ${
                  isFavorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/40 text-white hover:bg-black/60'
                }`}
                aria-label="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all"
                title="Share link"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Restaurant Details Header */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {restaurant.name}
                </h1>
                <p className="text-sm font-medium text-zinc-300 mt-1">
                  {restaurant.sector}
                </p>
                
                {/* Meta details (unboxed text discipline) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-2">
                  <span>{restaurant.cuisines[0]}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span>{restaurant.diningType}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span>₹{restaurant.costForTwo} for two</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {restaurant.deliveryTimeMins} mins
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mt-2">
                  Based on {restaurant.reviewCount} reviews
                </p>
              </div>

              {/* Green Rating Box matching screenshot */}
              <div className="shrink-0 bg-[#239243] text-white px-3.5 py-2.5 rounded-xl text-center shadow-lg shadow-emerald-950/40">
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums leading-none">
                  {restaurant.rating.toFixed(1)}
                </div>
                <div className="text-[11px] font-semibold text-emerald-100 tracking-wider mt-1 opacity-90">
                  / 5
                </div>
              </div>
            </div>

            {/* Sub-Tab Navigation: Reviews (Screenshot view) | Menu & Order | Store Info */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('reviews')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeSubTab === 'reviews'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                Customer Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveSubTab('menu')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeSubTab === 'menu'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                Food Menu &amp; Order ({menuItems.length})
              </button>
              <button
                onClick={() => setActiveSubTab('info')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeSubTab === 'info'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                Store Info
              </button>
            </div>
          </div>
        </section>

        {/* TAB 1: REVIEWS VIEW (Matches exact screenshot layout) */}
        {activeSubTab === 'reviews' && (
          <div className="mt-8 space-y-8 animate-in fade-in duration-200">
            {/* LATEST REVIEW Section */}
            {latestReview && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Latest Review
                  </h2>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                    Latest
                  </span>
                </div>

                <div className="bg-[#17181f] border border-zinc-800/80 rounded-xl p-4 transition-all hover:border-zinc-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-[#239243] text-white tabular-nums">
                        {latestReview.rating}
                      </span>
                      <span className="text-xs font-medium text-zinc-300">
                        {latestReview.userName}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 tabular-nums">
                      {latestReview.timeAgo}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-200 pl-0.5 mt-1">
                    {latestReview.comment}
                  </p>

                  {latestReview.dishTag && (
                    <div className="mt-3 text-[11px] text-zinc-400 flex items-center gap-1.5">
                      <span className="text-zinc-500">Dish:</span>
                      <span className="text-rose-400 font-medium capitalize">
                        {latestReview.dishTag}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* EARLIER REVIEWS Section */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Earlier Reviews
              </h2>

              <div className="space-y-3">
                {earlierReviews.map((rev) => {
                  const isPositive = rev.rating >= 3;
                  return (
                    <div
                      key={rev.id}
                      className="bg-[#17181f] border border-zinc-800/70 rounded-xl p-4 transition-all hover:border-zinc-700/80"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold tabular-nums text-white ${
                              isPositive ? 'bg-[#239243]' : 'bg-[#e23744]'
                            }`}
                          >
                            {rev.rating}
                          </span>
                          <span className="text-xs font-medium text-zinc-300">
                            {rev.userName}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 tabular-nums">
                          {rev.timeAgo}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-200 mt-1">
                        {rev.comment}
                      </p>

                      {rev.dishTag && (
                        <div className="mt-2.5 text-[11px] text-zinc-400 flex items-center gap-1.5">
                          <span className="text-zinc-500">Dish:</span>
                          <span className="text-rose-400 font-medium capitalize">
                            {rev.dishTag}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: MENU & ORDER VIEW */}
        {activeSubTab === 'menu' && (
          <div className="mt-6 space-y-6 animate-in fade-in duration-200">
            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#17181f] p-3 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-rose-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60'
                  }`}
                >
                  All Items
                </button>
                {restaurant.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-rose-600 text-white'
                        : 'text-zinc-400 hover:text-zinc-200 bg-zinc-800/60'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Veg / Non-Veg segmented switch */}
              <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setVegFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    vegFilter === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setVegFilter('veg')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                    vegFilter === 'veg' ? 'bg-emerald-950 text-emerald-300 font-medium' : 'text-zinc-400 hover:text-emerald-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Veg
                </button>
                <button
                  onClick={() => setVegFilter('non-veg')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                    vegFilter === 'non-veg' ? 'bg-rose-950 text-rose-300 font-medium' : 'text-zinc-400 hover:text-rose-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Menu Items List */}
            <div className="space-y-4">
              {filteredMenuItems.map((item) => {
                const quantity = getCartItemQuantity(item.id);
                const isVeg = item.vegType === 'veg';

                return (
                  <div
                    key={item.id}
                    className="bg-[#17181f] border border-zinc-800/80 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {/* Veg / Non-Veg icon box */}
                        <div
                          className={`w-4 h-4 border flex items-center justify-center rounded-sm shrink-0 ${
                            isVeg ? 'border-emerald-500' : 'border-rose-500'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>

                        {item.isBestseller && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                            Bestseller
                          </span>
                        )}

                        {item.isSpicy && (
                          <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-0.5">
                            <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                            Spicy
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-semibold text-white">
                        {item.name}
                      </h3>

                      <div className="text-sm font-bold text-zinc-100 tabular-nums mt-0.5">
                        ₹{item.price}
                      </div>

                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-2">
                        <span>{item.prepTimeMinutes} mins prep</span>
                        {item.calories && (
                          <>
                            <span>·</span>
                            <span>{item.calories} kcal</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Add to Cart Button or Stepper */}
                    <div className="shrink-0 flex flex-col items-center justify-center">
                      {quantity === 0 ? (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="px-5 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/30 rounded-lg transition-all shadow-sm"
                        >
                          ADD +
                        </button>
                      ) : (
                        <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden">
                          <button
                            onClick={() => onUpdateCartQuantity(item.id, -1)}
                            className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-white tabular-nums">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateCartQuantity(item.id, 1)}
                            className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STORE INFO & HOURS */}
        {activeSubTab === 'info' && (
          <div className="mt-6 bg-[#17181f] border border-zinc-800 rounded-xl p-6 space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Full Address
              </h3>
              <p className="text-sm text-zinc-200 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{restaurant.fullAddress}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Operating Hours
                </h3>
                <p className="text-sm text-zinc-200">11:00 AM – 11:30 PM</p>
                <p className="text-xs text-emerald-400 mt-0.5">Open Now</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Average Cost
                </h3>
                <p className="text-sm text-zinc-200">₹{restaurant.costForTwo} for two people</p>
                <p className="text-xs text-zinc-500 mt-0.5">Exclusive of applicable GST</p>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Hygiene &amp; Safety Rating
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded">
                  FSSAI Certified
                </span>
                <span className="text-xs text-zinc-400">Regular kitchen temperature sanitization</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom "Write a Review" Bar - Matches screenshot red bottom button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#111217] via-[#111217]/95 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button
            onClick={onOpenWriteReview}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#e23744] hover:bg-[#d02e3b] active:scale-[0.99] transition-all shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 text-sm tracking-wide"
          >
            Write a Review
          </button>
        </div>
      </div>
    </div>
  );
};
