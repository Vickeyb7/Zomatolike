export type DiningType = 'Dine-in' | 'Delivery' | 'Takeaway' | 'Dine-in & Delivery';

export type VegType = 'veg' | 'non-veg' | 'egg';

export interface Review {
  id: string;
  restaurantId: string;
  rating: number; // 1 to 5
  timeAgo: string;
  comment: string;
  userName: string;
  userInitials: string;
  dishTag?: string;
  isLatest?: boolean;
  createdAt: string;
  helpfulCount?: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number; // in INR
  vegType: VegType;
  isSpicy?: boolean;
  isBestseller?: boolean;
  isAvailable: boolean;
  prepTimeMinutes: number;
  calories?: number;
  customizationOptions?: string[];
  imagePlaceholderColor?: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  displayOrder: number;
  itemCount: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  initials: string;
  sector: string;
  city: string;
  fullAddress: string;
  cuisines: string[];
  diningType: DiningType;
  rating: number;
  reviewCount: number;
  costForTwo: number;
  deliveryTimeMins: number;
  isOpen: boolean;
  bannerColor: string;
  bannerPattern?: string;
  categories: MenuCategory[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedNotes?: string;
}

export interface UserAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  addressLine: string;
  sector: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'partner' | 'admin';
  avatarInitials: string;
  addresses: UserAddress[];
  dietaryPreferences: string[];
  totalOrders: number;
}

export interface PastOrder {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantId: string;
  date: string;
  totalAmount: number;
  status: 'Delivered' | 'In Kitchen' | 'Out for Delivery' | 'Cancelled';
  itemsSummary: string;
}
