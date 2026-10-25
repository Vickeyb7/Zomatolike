import React, { useState } from 'react';
import { Restaurant } from '../types';
import { Search, Clock, MapPin, ChevronRight, Star } from 'lucide-react';

interface RestaurantCatalogProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
  selectedRestaurantId: string;
}

export const RestaurantCatalog: React.FC<RestaurantCatalogProps> = ({
  restaurants,
  onSelectRestaurant,
  selectedRestaurantId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sector32' | 'high_rating' | 'fast'>('all');

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'sector32') return r.sector.toLowerCase().includes('sector 32');
    if (selectedFilter === 'high_rating') return r.rating >= 4.0;
    if (selectedFilter === 'fast') return r.deliveryTimeMins <= 25;

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Discover Places in Chandigarh &amp; Beyond
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Explore iconic local spots, fusion burritos, chaat junctions, and cloud kitchens.
        </p>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for 'Ludhiana Burrito', 'Sector 32', or 'Chaat'..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#17181f] border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setSelectedFilter('sector32')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'sector32'
                ? 'bg-rose-600 text-white'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Sector 32
          </button>
          <button
            onClick={() => setSelectedFilter('high_rating')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'high_rating'
                ? 'bg-rose-600 text-white'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Rating 4.0+
          </button>
          <button
            onClick={() => setSelectedFilter('fast')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFilter === 'fast'
                ? 'bg-rose-600 text-white'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Fast Delivery (&le;25m)
          </button>
        </div>
      </div>

      {/* Grid of Restaurants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((res) => {
          const isSelected = res.id === selectedRestaurantId;
          return (
            <div
              key={res.id}
              onClick={() => onSelectRestaurant(res)}
              className={`group bg-[#17181f] rounded-2xl border transition-all duration-150 cursor-pointer overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : 'border-zinc-800/80 hover:border-zinc-700 hover:shadow-xl'
              }`}
            >
              {/* Patterned Banner Card */}
              <div className={`h-32 bg-gradient-to-r ${res.bannerColor} relative flex items-center justify-center`}>
                <span className="text-4xl font-extrabold tracking-wider text-white opacity-95">
                  {res.initials}
                </span>

                {/* Rating badge */}
                <div className="absolute bottom-3 right-3 bg-[#239243] text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                  <span>{res.rating.toFixed(1)}</span>
                  <span className="text-[10px] opacity-80">/5</span>
                </div>

                {isSelected && (
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold uppercase text-rose-300 border border-rose-500/30">
                    Currently Viewing
                  </div>
                )}
              </div>

              {/* Content info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                      {res.name}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{res.sector}, {res.city}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-400 mt-3">
                    <span>{res.cuisines.join(', ')}</span>
                    <span aria-hidden="true" className="text-zinc-600">·</span>
                    <span>₹{res.costForTwo} for two</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-zinc-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    {res.deliveryTimeMins} mins delivery
                  </span>
                  <span className="text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                    Open Spot <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
