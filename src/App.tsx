/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Restaurant, 
  MenuItem, 
  Review, 
  UserProfile as UserProfileType, 
  PastOrder, 
  CartItem, 
  UserAddress 
} from './types';
import { 
  INITIAL_RESTAURANTS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_REVIEWS, 
  INITIAL_USER, 
  INITIAL_PAST_ORDERS 
} from './data/mockData';
import { Navigation } from './components/Navigation';
import { RestaurantView } from './components/RestaurantView';
import { RestaurantCatalog } from './components/RestaurantCatalog';
import { MenuManagement } from './components/MenuManagement';
import { UserProfile } from './components/UserProfile';
import { SchemaWorkbench } from './components/SchemaWorkbench';
import { WriteReviewModal } from './components/WriteReviewModal';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('1');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [user, setUser] = useState<UserProfileType>(INITIAL_USER);
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(INITIAL_PAST_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'restaurant' | 'explore' | 'menu-admin' | 'profile' | 'schema'>('restaurant');

  // Modals & Drawers
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected restaurant object
  const currentRestaurant =
    restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  // Scoped menu items and reviews for currently active restaurant
  const currentMenuItems = menuItems.filter((i) => i.restaurantId === currentRestaurant.id);
  const currentReviews = reviews.filter((r) => r.restaurantId === currentRestaurant.id);

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((i) => {
          if (i.menuItem.id === itemId) {
            return { ...i, quantity: i.quantity + delta };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const getCartItemQuantity = (itemId: string): number => {
    const item = cartItems.find((i) => i.menuItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Review submission with real-time recalculation of average rating
  const handleSubmitReview = (newReviewData: {
    rating: number;
    comment: string;
    dishTag?: string;
    userName: string;
  }) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      rating: newReviewData.rating,
      comment: newReviewData.comment,
      dishTag: newReviewData.dishTag,
      userName: newReviewData.userName,
      userInitials: newReviewData.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'UD',
      timeAgo: 'Just now',
      isLatest: true,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
    };

    // Update reviews list (set previous reviews isLatest to false)
    setReviews((prev) => [
      newReview,
      ...prev.map((r) => (r.restaurantId === currentRestaurant.id ? { ...r, isLatest: false } : r)),
    ]);

    // Update restaurant rating and count
    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === currentRestaurant.id) {
          const newCount = r.reviewCount + 1;
          const newAvg = Number(
            ((r.rating * r.reviewCount + newReviewData.rating) / newCount).toFixed(1)
          );
          return {
            ...r,
            rating: newAvg,
            reviewCount: newCount,
          };
        }
        return r;
      })
    );
  };

  // Menu Management Operations
  const handleAddMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `item-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
  };

  const handleUpdateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCategory = (name: string) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      restaurantId: currentRestaurant.id,
      name,
      displayOrder: currentRestaurant.categories.length + 1,
      itemCount: 0,
    };

    setRestaurants((prev) =>
      prev.map((r) => {
        if (r.id === currentRestaurant.id) {
          return {
            ...r,
            categories: [...r.categories, newCat],
          };
        }
        return r;
      })
    );
  };

  // User & Address Operations
  const handleAddAddress = (addressData: Omit<UserAddress, 'id'>) => {
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, newAddr],
    }));
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      })),
    }));
  };

  const handleUpdateDietaryPreferences = (dietaryPreferences: string[]) => {
    setUser((prev) => ({
      ...prev,
      dietaryPreferences,
    }));
  };

  const handleReorder = (order: PastOrder) => {
    // Select the restaurant
    setSelectedRestaurantId(order.restaurantId);
    setActiveTab('restaurant');

    // Add first 2 available items from that restaurant to cart
    const items = menuItems.filter((i) => i.restaurantId === order.restaurantId);
    if (items.length > 0) {
      handleAddToCart(items[0]);
      if (items[1]) handleAddToCart(items[1]);
    }
    setIsCartOpen(true);
  };

  const handlePlaceOrder = (orderDetails: {
    items: CartItem[];
    total: number;
    address: UserAddress;
  }) => {
    const newPastOrder: PastOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `#ZL-${Math.floor(10000 + Math.random() * 90000)}`,
      restaurantName: currentRestaurant.name,
      restaurantId: currentRestaurant.id,
      date: 'Just now',
      totalAmount: orderDetails.total,
      status: 'In Kitchen',
      itemsSummary: orderDetails.items
        .map((i) => `${i.quantity}x ${i.menuItem.name}`)
        .join(', '),
    };

    setPastOrders((prev) => [newPastOrder, ...prev]);
    setUser((prev) => ({
      ...prev,
      totalOrders: prev.totalOrders + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedRestaurantName={currentRestaurant.name}
      />

      {/* Main Content Router */}
      <div className="flex-1">
        {activeTab === 'restaurant' && (
          <RestaurantView
            restaurant={currentRestaurant}
            menuItems={currentMenuItems}
            reviews={currentReviews}
            onOpenWriteReview={() => setIsWriteReviewOpen(true)}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            getCartItemQuantity={getCartItemQuantity}
          />
        )}

        {activeTab === 'explore' && (
          <RestaurantCatalog
            restaurants={restaurants}
            onSelectRestaurant={(res) => {
              setSelectedRestaurantId(res.id);
              setActiveTab('restaurant');
            }}
            selectedRestaurantId={selectedRestaurantId}
          />
        )}

        {activeTab === 'menu-admin' && (
          <MenuManagement
            restaurant={currentRestaurant}
            menuItems={currentMenuItems}
            categories={currentRestaurant.categories}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onAddCategory={handleAddCategory}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            pastOrders={pastOrders}
            onAddAddress={handleAddAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            onReorder={handleReorder}
            onUpdateDietaryPreferences={handleUpdateDietaryPreferences}
          />
        )}

        {activeTab === 'schema' && <SchemaWorkbench />}
      </div>

      {/* Interactive Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
        onSubmitReview={handleSubmitReview}
        restaurantName={currentRestaurant.name}
        menuItems={currentMenuItems}
        currentUserName={user.name}
      />

      {/* Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        restaurantName={currentRestaurant.name}
        addresses={user.addresses}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}
