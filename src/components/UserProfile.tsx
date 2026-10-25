import React, { useState } from 'react';
import { UserProfile as UserProfileType, UserAddress, PastOrder } from '../types';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Clock, 
  Check, 
  ShoppingBag, 
  RotateCcw,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface UserProfileProps {
  user: UserProfileType;
  pastOrders: PastOrder[];
  onAddAddress: (address: Omit<UserAddress, 'id'>) => void;
  onSetDefaultAddress: (addressId: string) => void;
  onReorder: (order: PastOrder) => void;
  onUpdateDietaryPreferences: (prefs: string[]) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  pastOrders,
  onAddAddress,
  onSetDefaultAddress,
  onReorder,
  onUpdateDietaryPreferences,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addressLine, setAddressLine] = useState('');
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('Chandigarh');
  const [postalCode, setPostalCode] = useState('160032');

  const availableDietaryOptions = [
    'Mild Spice',
    'Street Food Explorer',
    'Quick Bites',
    'Pure Veg Only',
    'Lactose Conscious',
    'High Protein Focus',
    'Night Owl Diner',
  ];

  const handleTogglePreference = (option: string) => {
    if (user.dietaryPreferences.includes(option)) {
      onUpdateDietaryPreferences(user.dietaryPreferences.filter((p) => p !== option));
    } else {
      onUpdateDietaryPreferences([...user.dietaryPreferences, option]);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim() || !sector.trim()) return;

    onAddAddress({
      label,
      addressLine: addressLine.trim(),
      sector: sector.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      isDefault: user.addresses.length === 0,
    });

    setAddressLine('');
    setSector('');
    setIsAddingAddress(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* User Header Profile Card */}
      <div className="bg-[#17181f] border border-zinc-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-rose-950/40">
            {user.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded">
                Verified Foodie
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                {user.email}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                {user.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-4 sm:pt-0 sm:pl-6">
          <div className="text-center">
            <span className="block text-2xl font-bold text-white tabular-nums">
              {user.totalOrders}
            </span>
            <span className="text-[11px] text-zinc-400">Total Orders</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-rose-400 tabular-nums">
              {user.addresses.length}
            </span>
            <span className="text-[11px] text-zinc-400">Saved Addresses</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Preferences &amp; Taste Profile
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'addresses'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Delivery Addresses ({user.addresses.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-zinc-800 text-white'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Past Orders ({pastOrders.length})
        </button>
      </div>

      {/* TAB 1: PREFERENCES */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-[#17181f] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Food &amp; Dining Taste Profile
            </h2>
            <p className="text-xs text-zinc-400 mb-4">
              Select your dining habits to help customize recommendations and dish suggestions.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {availableDietaryOptions.map((opt) => {
                const isSelected = user.dietaryPreferences.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleTogglePreference(opt)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm'
                        : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/60 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#17181f] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-2">
              Account Security &amp; Role Permissions
            </h2>
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
              <div>
                <span className="text-zinc-300 font-medium">Session Role:</span>{' '}
                <span className="text-rose-400 uppercase font-mono">{user.role}</span>
              </div>
              <div>
                <span className="text-zinc-300 font-medium">Authentication:</span>{' '}
                <span className="text-emerald-400">JWT Token Valid</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Saved Delivery Locations</h2>
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Address
            </button>
          </div>

          {/* New address form */}
          {isAddingAddress && (
            <form onSubmit={handleSaveAddress} className="bg-[#1a1b24] p-5 rounded-xl border border-rose-500/40 space-y-4">
              <div className="flex items-center gap-2">
                {(['Home', 'Work', 'Other'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLabel(l)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      label === l ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">House / Flat / Street</label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 301, Tower A, Sector 32"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Sector / Locality</label>
                  <input
                    type="text"
                    required
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="e.g. Sector 32"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="160032"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List of addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-xl border transition-all ${
                  addr.isDefault
                    ? 'bg-[#17181f] border-rose-500/60 shadow-md'
                    : 'bg-[#17181f] border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span className="font-semibold text-white text-sm">{addr.label}</span>
                  </div>
                  {addr.isDefault ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                      Default Delivery
                    </span>
                  ) : (
                    <button
                      onClick={() => onSetDefaultAddress(addr.id)}
                      className="text-xs text-zinc-400 hover:text-rose-400"
                    >
                      Set as default
                    </button>
                  )}
                </div>

                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {addr.addressLine}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {addr.sector}, {addr.city} &mdash; {addr.postalCode}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PAST ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white mb-2">Order History</h2>
          {pastOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#17181f] border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-base">
                    {ord.restaurantName}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {ord.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  {ord.itemsSummary}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {ord.date}
                </p>
              </div>

              <div className="flex items-center gap-4 sm:border-l sm:border-zinc-800 sm:pl-5">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-bold text-white tabular-nums">
                    ₹{ord.totalAmount}
                  </div>
                  <span className="text-[10px] text-zinc-500">Paid via UPI</span>
                </div>

                <button
                  onClick={() => onReorder(ord)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
