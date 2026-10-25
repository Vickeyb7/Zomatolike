import React, { useState } from 'react';
import { Restaurant, MenuItem, MenuCategory, VegType } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  Sparkles,
  Layers,
  UtensilsCrossed,
  DollarSign,
  Clock,
  X
} from 'lucide-react';

interface MenuManagementProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  onDeleteMenuItem: (id: string) => void;
  onAddCategory: (name: string) => void;
}

export const MenuManagement: React.FC<MenuManagementProps> = ({
  restaurant,
  menuItems,
  categories,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onAddCategory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Form State for Add / Edit
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(199);
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [vegType, setVegType] = useState<VegType>('veg');
  const [isSpicy, setIsSpicy] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(10);
  const [calories, setCalories] = useState<number>(350);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice(199);
    setCategoryId(categories[0]?.id || '');
    setVegType('veg');
    setIsSpicy(false);
    setIsBestseller(false);
    setPrepTimeMinutes(10);
    setCalories(350);
    setEditingItem(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
    setCategoryId(item.categoryId);
    setVegType(item.vegType);
    setIsSpicy(item.isSpicy || false);
    setIsBestseller(item.isBestseller || false);
    setPrepTimeMinutes(item.prepTimeMinutes);
    setCalories(item.calories || 350);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      onUpdateMenuItem(editingItem.id, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId,
        vegType,
        isSpicy,
        isBestseller,
        prepTimeMinutes: Number(prepTimeMinutes),
        calories: Number(calories),
      });
    } else {
      onAddMenuItem({
        restaurantId: restaurant.id,
        categoryId: categoryId || categories[0]?.id || 'cat-1',
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        vegType,
        isSpicy,
        isBestseller,
        isAvailable: true,
        prepTimeMinutes: Number(prepTimeMinutes),
        calories: Number(calories),
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  // Metrics calculation
  const totalItems = menuItems.length;
  const inStockItems = menuItems.filter((i) => i.isAvailable).length;
  const outOfStockItems = totalItems - inStockItems;
  const avgPrice = totalItems > 0 
    ? Math.round(menuItems.reduce((acc, i) => acc + i.price, 0) / totalItems) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Merchant Partner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {restaurant.name} &mdash; Menu Catalog Management
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time control over dish availability, category groupings, pricing, and dietary attributes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingCategory(true)}
            className="px-4 py-2.5 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-zinc-400" />
            New Category
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-lg shadow-rose-900/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Menu Dish
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#17181f] p-4 rounded-xl border border-zinc-800/80">
          <span className="text-xs text-zinc-400 font-medium">Total Menu Items</span>
          <div className="text-2xl font-bold text-white mt-1 tabular-nums">{totalItems}</div>
          <span className="text-[11px] text-zinc-500">Across {categories.length} categories</span>
        </div>

        <div className="bg-[#17181f] p-4 rounded-xl border border-zinc-800/80">
          <span className="text-xs text-zinc-400 font-medium">Live In-Stock</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{inStockItems}</div>
          <span className="text-[11px] text-emerald-500/80 font-medium">
            {totalItems > 0 ? Math.round((inStockItems / totalItems) * 100) : 0}% available to order
          </span>
        </div>

        <div className="bg-[#17181f] p-4 rounded-xl border border-zinc-800/80">
          <span className="text-xs text-zinc-400 font-medium">Sold Out / Paused</span>
          <div className={`text-2xl font-bold mt-1 tabular-nums ${outOfStockItems > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
            {outOfStockItems}
          </div>
          <span className="text-[11px] text-zinc-500">Temporarily deactivated</span>
        </div>

        <div className="bg-[#17181f] p-4 rounded-xl border border-zinc-800/80">
          <span className="text-xs text-zinc-400 font-medium">Average Dish Price</span>
          <div className="text-2xl font-bold text-white mt-1 tabular-nums">₹{avgPrice}</div>
          <span className="text-[11px] text-zinc-500">Benchmark: ₹{restaurant.costForTwo} for 2</span>
        </div>
      </div>

      {/* Inline Category Quick Creator */}
      {isAddingCategory && (
        <form onSubmit={handleCreateCategory} className="mb-6 p-4 bg-[#1b1c24] border border-rose-500/40 rounded-xl flex items-center gap-3">
          <Layers className="w-5 h-5 text-rose-400 shrink-0" />
          <input
            type="text"
            required
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category title (e.g. Sizzling Tandoor, Mocktails & Shakes)"
            className="flex-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
          >
            Create Category
          </button>
          <button
            type="button"
            onClick={() => setIsAddingCategory(false)}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Menu Items Table */}
      <div className="bg-[#17181f] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-rose-500" />
            Dish Catalog &amp; Inventory Status
          </h2>
          <span className="text-xs text-zinc-400">
            Clicking status instantly updates consumer app
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#121319] text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-6">Dish Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-center">In-Stock Toggle</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {menuItems.map((item) => {
                const category = categories.find((c) => c.id === item.categoryId);
                const isVeg = item.vegType === 'veg';

                return (
                  <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Dish name & description */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm shrink-0 ${
                            isVeg ? 'border-emerald-500' : 'border-rose-500'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>

                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.isBestseller && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">
                                Bestseller
                              </span>
                            )}
                            {item.isSpicy && (
                              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-1 max-w-sm mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-xs text-zinc-300">
                      {category?.name || 'Unassigned'}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-4 font-bold text-white tabular-nums">
                      ₹{item.price}
                    </td>

                    {/* Dietary Type */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs capitalize font-medium ${
                          isVeg ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.vegType}
                      </span>
                    </td>

                    {/* In Stock Switch */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() =>
                          onUpdateMenuItem(item.id, { isAvailable: !item.isAvailable })
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                          item.isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isAvailable ? 'bg-emerald-500' : 'bg-zinc-500'
                          }`}
                        />
                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Edit Dish"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMenuItem(item.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Dish Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#14151b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">
                {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amritsari Paneer Quesadilla"
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Flavor notes, ingredients, sauce pairings..."
                  className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Dietary
                  </label>
                  <select
                    value={vegType}
                    onChange={(e) => setVegType(e.target.value as VegType)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                    <option value="egg">Contains Egg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Toggles for Spicy & Bestseller */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isSpicy}
                    onChange={(e) => setIsSpicy(e.target.checked)}
                    className="rounded border-zinc-700 text-rose-600 focus:ring-rose-500 bg-zinc-900"
                  />
                  <span>Mark as Spicy Dish</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-md"
                >
                  {editingItem ? 'Save Changes' : 'Add Dish to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
