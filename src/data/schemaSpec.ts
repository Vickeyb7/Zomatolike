export interface SchemaTable {
  name: string;
  category: 'User & Auth' | 'Restaurant & Menu' | 'Ordering & Delivery' | 'Reviews & Engagement';
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    isNullable?: boolean;
    description: string;
  }[];
  indexes: string[];
}

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'users',
    category: 'User & Auth',
    description: 'Core user profiles, credentials, role-based access (customer, partner, admin), and notification preferences.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Unique surrogate identifier (v4 uuid)' },
      { name: 'email', type: 'VARCHAR(255)', isNullable: false, description: 'Unique user email for authentication' },
      { name: 'password_hash', type: 'VARCHAR(255)', isNullable: false, description: 'Argon2id or bcrypt hashed secret' },
      { name: 'full_name', type: 'VARCHAR(120)', isNullable: false, description: 'Customer display name (e.g. Vickey B.)' },
      { name: 'phone', type: 'VARCHAR(20)', isNullable: true, description: 'E.164 verified mobile number for OTP delivery updates' },
      { name: 'role', type: 'user_role_enum', isNullable: false, description: "'customer' | 'restaurant_partner' | 'admin'" },
      { name: 'avatar_url', type: 'TEXT', isNullable: true, description: 'Optional profile avatar CDN link' },
      { name: 'preferences_json', type: 'JSONB', isNullable: true, description: 'Dietary preferences, allergies, spicy tolerance' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Account creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Last profile update timestamp' },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_users_email ON users(email);', 'CREATE INDEX idx_users_phone ON users(phone);'],
  },
  {
    name: 'user_addresses',
    category: 'User & Auth',
    description: 'Saved delivery addresses for rapid checkout with sector geo-coordinates.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id) ON DELETE CASCADE', isNullable: false, description: 'Associated customer' },
      { name: 'label', type: 'VARCHAR(30)', isNullable: false, description: "'Home' | 'Work' | 'Other'" },
      { name: 'address_line1', type: 'VARCHAR(255)', isNullable: false, description: 'Flat, apartment, building name' },
      { name: 'sector', type: 'VARCHAR(60)', isNullable: false, description: 'Sector or locality (e.g. Sector 32)' },
      { name: 'city', type: 'VARCHAR(80)', isNullable: false, description: 'City name (e.g. Chandigarh, Noida)' },
      { name: 'postal_code', type: 'VARCHAR(12)', isNullable: false, description: 'Pin / ZIP postal code' },
      { name: 'latitude', type: 'DECIMAL(9,6)', isNullable: true, description: 'Latitude coordinate for distance routing' },
      { name: 'longitude', type: 'DECIMAL(9,6)', isNullable: true, description: 'Longitude coordinate for distance routing' },
      { name: 'is_default', type: 'BOOLEAN', isNullable: false, description: 'Whether pre-selected at checkout' },
    ],
    indexes: ['CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);'],
  },
  {
    name: 'restaurants',
    category: 'Restaurant & Menu',
    description: 'Primary restaurant listing, location metadata, dining model, and rolling aggregate rating metrics.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'slug', type: 'VARCHAR(120)', isNullable: false, description: 'URL-friendly unique slug (e.g. ludhiana-burrito)' },
      { name: 'name', type: 'VARCHAR(150)', isNullable: false, description: 'Restaurant brand name' },
      { name: 'initials', type: 'VARCHAR(6)', isNullable: false, description: 'Brand avatar monogram initials (e.g. LB)' },
      { name: 'sector', type: 'VARCHAR(80)', isNullable: false, description: 'Locality sector (e.g. Sector 32)' },
      { name: 'city', type: 'VARCHAR(80)', isNullable: false, description: 'City' },
      { name: 'full_address', type: 'TEXT', isNullable: false, description: 'Complete street address' },
      { name: 'cuisines', type: 'TEXT[]', isNullable: false, description: "Array of cuisines (e.g. ['Indian', 'Fusion Mexican'])" },
      { name: 'dining_type', type: 'dining_type_enum', isNullable: false, description: "'Dine-in' | 'Delivery' | 'Takeaway' | 'Dine-in & Delivery'" },
      { name: 'average_rating', type: 'DECIMAL(2,1)', isNullable: false, description: 'Cached rolling average score (e.g. 3.7)' },
      { name: 'review_count', type: 'INTEGER', isNullable: false, description: 'Total verified reviews counter (e.g. 63)' },
      { name: 'cost_for_two', type: 'INTEGER', isNullable: false, description: 'Estimated bill for two people in INR' },
      { name: 'delivery_time_mins', type: 'INTEGER', isNullable: false, description: 'Standard preparation + transit window' },
      { name: 'is_open', type: 'BOOLEAN', isNullable: false, description: 'Operational toggle for live orders' },
      { name: 'banner_color', type: 'VARCHAR(50)', isNullable: false, description: 'Brand theme gradient or hex' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Onboarding date' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Last profile update' },
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_restaurants_slug ON restaurants(slug);',
      'CREATE INDEX idx_restaurants_sector ON restaurants(sector);',
      'CREATE INDEX idx_restaurants_rating ON restaurants(average_rating DESC);',
    ],
  },
  {
    name: 'menu_categories',
    category: 'Restaurant & Menu',
    description: 'Hierarchical categorization of dishes (e.g. Burritos, Chaats, Beverages) with custom display ordering.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'restaurant_id', type: 'UUID', isForeign: true, references: 'restaurants(id) ON DELETE CASCADE', isNullable: false, description: 'Parent restaurant' },
      { name: 'name', type: 'VARCHAR(100)', isNullable: false, description: 'Category title (e.g. Signature Burritos & Wraps)' },
      { name: 'display_order', type: 'INTEGER', isNullable: false, description: 'Ordering position on the restaurant page' },
      { name: 'is_active', type: 'BOOLEAN', isNullable: false, description: 'Visibility toggle' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Creation timestamp' },
    ],
    indexes: ['CREATE INDEX idx_menu_categories_restaurant_order ON menu_categories(restaurant_id, display_order);'],
  },
  {
    name: 'menu_items',
    category: 'Restaurant & Menu',
    description: 'Individual dishes, pricing, dietary flags (veg/non-veg), preparation time, and inventory availability.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'restaurant_id', type: 'UUID', isForeign: true, references: 'restaurants(id) ON DELETE CASCADE', isNullable: false, description: 'Owning restaurant' },
      { name: 'category_id', type: 'UUID', isForeign: true, references: 'menu_categories(id) ON DELETE CASCADE', isNullable: false, description: 'Category partition' },
      { name: 'name', type: 'VARCHAR(150)', isNullable: false, description: 'Dish name (e.g. Diet Coke Gol Gappe)' },
      { name: 'description', type: 'TEXT', isNullable: true, description: 'Ingredients, flavor profile, and story' },
      { name: 'price', type: 'DECIMAL(8,2)', isNullable: false, description: 'Base price in INR' },
      { name: 'veg_type', type: 'veg_type_enum', isNullable: false, description: "'veg' | 'non-veg' | 'egg'" },
      { name: 'is_spicy', type: 'BOOLEAN', isNullable: false, description: 'Spiciness badge indicator' },
      { name: 'is_bestseller', type: 'BOOLEAN', isNullable: false, description: 'Highlight tag on menu' },
      { name: 'is_available', type: 'BOOLEAN', isNullable: false, description: 'Live inventory stock status' },
      { name: 'prep_time_minutes', type: 'INTEGER', isNullable: false, description: 'Kitchen preparation SLA' },
      { name: 'calories', type: 'INTEGER', isNullable: true, description: 'Nutritional calorie count' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Creation date' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Last price/stock change' },
    ],
    indexes: [
      'CREATE INDEX idx_menu_items_restaurant_cat ON menu_items(restaurant_id, category_id);',
      'CREATE INDEX idx_menu_items_available ON menu_items(restaurant_id, is_available);',
    ],
  },
  {
    name: 'reviews',
    category: 'Reviews & Engagement',
    description: 'Customer ratings, dish-specific tags, short reviews, timestamps, and helpfulness metrics matching the Zomato Lite UI.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'restaurant_id', type: 'UUID', isForeign: true, references: 'restaurants(id) ON DELETE CASCADE', isNullable: false, description: 'Reviewed restaurant' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id) ON DELETE SET NULL', isNullable: true, description: 'Reviewing author' },
      { name: 'user_name', type: 'VARCHAR(100)', isNullable: false, description: 'Display name at time of review' },
      { name: 'rating', type: 'SMALLINT', isNullable: false, description: 'Rating integer between 1 and 5' },
      { name: 'dish_tag', type: 'VARCHAR(100)', isNullable: true, description: 'Associated dish (e.g. diet coke gol gappe, palak chai)' },
      { name: 'comment', type: 'TEXT', isNullable: false, description: 'Review prose text' },
      { name: 'is_latest', type: 'BOOLEAN', isNullable: false, description: 'Denormalized flag for quick latest review card' },
      { name: 'helpful_votes', type: 'INTEGER', isNullable: false, description: 'Upvotes received from community' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Submission timestamp' },
    ],
    indexes: [
      'CREATE INDEX idx_reviews_restaurant_created ON reviews(restaurant_id, created_at DESC);',
      'CREATE INDEX idx_reviews_rating ON reviews(restaurant_id, rating);',
    ],
  },
  {
    name: 'orders',
    category: 'Ordering & Delivery',
    description: 'Checkout sessions, order items rollup, pricing calculations (taxes, delivery, discount), and delivery tracking status.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'order_number', type: 'VARCHAR(30)', isNullable: false, description: 'Human-readable ticket code (e.g. #ZL-88412)' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id)', isNullable: false, description: 'Buyer' },
      { name: 'restaurant_id', type: 'UUID', isForeign: true, references: 'restaurants(id)', isNullable: false, description: 'Merchant' },
      { name: 'address_id', type: 'UUID', isForeign: true, references: 'user_addresses(id)', isNullable: false, description: 'Delivery destination' },
      { name: 'status', type: 'order_status_enum', isNullable: false, description: "'placed' | 'confirmed' | 'cooking' | 'out_for_delivery' | 'delivered' | 'cancelled'" },
      { name: 'subtotal', type: 'DECIMAL(8,2)', isNullable: false, description: 'Sum of item prices' },
      { name: 'tax_amount', type: 'DECIMAL(8,2)', isNullable: false, description: 'GST 5% food tax' },
      { name: 'delivery_fee', type: 'DECIMAL(8,2)', isNullable: false, description: 'Logistics delivery fee' },
      { name: 'discount_amount', type: 'DECIMAL(8,2)', isNullable: false, description: 'Coupon savings' },
      { name: 'grand_total', type: 'DECIMAL(8,2)', isNullable: false, description: 'Final chargeable amount' },
      { name: 'payment_method', type: 'VARCHAR(40)', isNullable: false, description: "'UPI' | 'Card' | 'COD'" },
      { name: 'payment_status', type: 'VARCHAR(30)', isNullable: false, description: "'pending' | 'paid' | 'refunded'" },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, description: 'Order placement timestamp' },
    ],
    indexes: [
      'CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);',
      'CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);',
    ],
  },
  {
    name: 'order_items',
    category: 'Ordering & Delivery',
    description: 'Itemized line items locked at historical unit pricing.',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, description: 'Primary key' },
      { name: 'order_id', type: 'UUID', isForeign: true, references: 'orders(id) ON DELETE CASCADE', isNullable: false, description: 'Parent order' },
      { name: 'menu_item_id', type: 'UUID', isForeign: true, references: 'menu_items(id)', isNullable: false, description: 'Historical item reference' },
      { name: 'item_name', type: 'VARCHAR(150)', isNullable: false, description: 'Snapshot dish name' },
      { name: 'unit_price', type: 'DECIMAL(8,2)', isNullable: false, description: 'Unit price at order time' },
      { name: 'quantity', type: 'INTEGER', isNullable: false, description: 'Purchased quantity' },
      { name: 'line_total', type: 'DECIMAL(8,2)', isNullable: false, description: 'unit_price * quantity' },
      { name: 'customization_notes', type: 'TEXT', isNullable: true, description: 'Cooking instructions (e.g. less spicy)' },
    ],
    indexes: ['CREATE INDEX idx_order_items_order ON order_items(order_id);'],
  },
];

export const POSTGRES_DDL_SQL = `-- ====================================================================
-- ZOMATO-LITE DATABASE ARCHITECTURE (POSTGRESQL DDL)
-- Designed for High-Throughput Food Discovery, Menu Management & Reviews
-- Compatible with PostgreSQL 15+, Supabase, Neon, Cloud SQL & Vercel Postgres
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enumerated Custom Types
CREATE TYPE user_role_enum AS ENUM ('customer', 'restaurant_partner', 'admin');
CREATE TYPE dining_type_enum AS ENUM ('Dine-in', 'Delivery', 'Takeaway', 'Dine-in & Delivery');
CREATE TYPE veg_type_enum AS ENUM ('veg', 'non-veg', 'egg');
CREATE TYPE order_status_enum AS ENUM ('placed', 'confirmed', 'cooking', 'out_for_delivery', 'delivered', 'cancelled');

-- 3. Users & Identity Management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    role user_role_enum NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    preferences_json JSONB DEFAULT '{"spicyTolerance": "medium", "dietary": []}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- 4. User Saved Addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(30) NOT NULL DEFAULT 'Home',
    address_line1 VARCHAR(255) NOT NULL,
    sector VARCHAR(60) NOT NULL,
    city VARCHAR(80) NOT NULL DEFAULT 'Chandigarh',
    postal_code VARCHAR(12) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);

-- 5. Restaurants Directory
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    initials VARCHAR(6) NOT NULL,
    sector VARCHAR(80) NOT NULL,
    city VARCHAR(80) NOT NULL DEFAULT 'Chandigarh',
    full_address TEXT NOT NULL,
    cuisines TEXT[] NOT NULL DEFAULT ARRAY['Indian'],
    dining_type dining_type_enum NOT NULL DEFAULT 'Dine-in',
    average_rating DECIMAL(2,1) NOT NULL DEFAULT 0.0 CHECK (average_rating >= 0.0 AND average_rating <= 5.0),
    review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    cost_for_two INTEGER NOT NULL DEFAULT 300,
    delivery_time_mins INTEGER NOT NULL DEFAULT 30,
    is_open BOOLEAN NOT NULL DEFAULT true,
    banner_color VARCHAR(50) NOT NULL DEFAULT 'from-[#be123c] to-[#9f1239]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_sector ON restaurants(sector);
CREATE INDEX idx_restaurants_rating ON restaurants(average_rating DESC);

-- 6. Restaurant Partner Association (Access Control)
CREATE TABLE restaurant_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    partner_role VARCHAR(40) NOT NULL DEFAULT 'manager',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (restaurant_id, user_id)
);

-- 7. Menu Categories (Sections)
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_categories_restaurant_order ON menu_categories(restaurant_id, display_order);

-- 8. Menu Items & Real-Time Availability
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(8,2) NOT NULL CHECK (price >= 0),
    veg_type veg_type_enum NOT NULL DEFAULT 'veg',
    is_spicy BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    prep_time_minutes INTEGER NOT NULL DEFAULT 10,
    calories INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_restaurant_cat ON menu_items(restaurant_id, category_id);
CREATE INDEX idx_menu_items_available ON menu_items(restaurant_id, is_available);

-- 9. Reviews & Dish Ratings (Faithful to Zomato Lite UI)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(100) NOT NULL,
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    dish_tag VARCHAR(100),
    comment TEXT NOT NULL,
    is_latest BOOLEAN NOT NULL DEFAULT false,
    helpful_votes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_restaurant_created ON reviews(restaurant_id, created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(restaurant_id, rating);

-- 10. Auto-Calculate Aggregate Ratings Trigger
CREATE OR REPLACE FUNCTION update_restaurant_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restaurants
    SET 
        average_rating = ROUND((SELECT AVG(rating)::numeric FROM reviews WHERE restaurant_id = NEW.restaurant_id), 1),
        review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = NEW.restaurant_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.restaurant_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_review_insert
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating_stats();

-- 11. Customer Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(30) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    address_id UUID NOT NULL REFERENCES user_addresses(id),
    status order_status_enum NOT NULL DEFAULT 'placed',
    subtotal DECIMAL(8,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    delivery_fee DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    grand_total DECIMAL(8,2) NOT NULL CHECK (grand_total >= 0),
    payment_method VARCHAR(40) NOT NULL DEFAULT 'UPI',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, status);

-- 12. Order Line Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    item_name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(8,2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    line_total DECIMAL(8,2) NOT NULL CHECK (line_total >= 0),
    customization_notes TEXT
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
`;

export const PRISMA_SCHEMA = `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  CUSTOMER           @map("customer")
  RESTAURANT_PARTNER @map("restaurant_partner")
  ADMIN              @map("admin")
}

enum DiningType {
  DINE_IN             @map("Dine-in")
  DELIVERY            @map("Delivery")
  TAKEAWAY            @map("Takeaway")
  DINE_IN_AND_DELIVERY @map("Dine-in & Delivery")
}

enum VegType {
  VEG     @map("veg")
  NON_VEG @map("non-veg")
  EGG     @map("egg")
}

enum OrderStatus {
  PLACED           @map("placed")
  CONFIRMED        @map("confirmed")
  COOKING          @map("cooking")
  OUT_FOR_DELIVERY @map("out_for_delivery")
  DELIVERED        @map("delivered")
  CANCELLED        @map("cancelled")
}

model User {
  id              String         @id @default(uuid()) @db.Uuid
  email           String         @unique @db.VarChar(255)
  passwordHash    String         @map("password_hash") @db.VarChar(255)
  fullName        String         @map("full_name") @db.VarChar(120)
  phone           String?        @db.VarChar(20)
  role            UserRole       @default(CUSTOMER)
  avatarUrl       String?        @map("avatar_url")
  preferencesJson Json?          @default("{\\"spicyTolerance\\": \\"medium\\", \\"dietary\\": []}") @map("preferences_json")
  createdAt       DateTime       @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime       @updatedAt @map("updated_at") @db.Timestamptz

  addresses       UserAddress[]
  orders          Order[]
  reviews         Review[]
  managedPartners RestaurantPartner[]

  @@map("users")
}

model UserAddress {
  id           String   @id @default(uuid()) @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  label        String   @default("Home") @db.VarChar(30)
  addressLine1 String   @map("address_line1") @db.VarChar(255)
  sector       String   @db.VarChar(60)
  city         String   @default("Chandigarh") @db.VarChar(80)
  postalCode   String   @map("postal_code") @db.VarChar(12)
  latitude     Decimal? @db.Decimal(9, 6)
  longitude    Decimal? @db.Decimal(9, 6)
  isDefault    Boolean  @default(false) @map("is_default")
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders Order[]

  @@index([userId])
  @@map("user_addresses")
}

model Restaurant {
  id               String       @id @default(uuid()) @db.Uuid
  slug             String       @unique @db.VarChar(120)
  name             String       @db.VarChar(150)
  initials         String       @db.VarChar(6)
  sector           String       @db.VarChar(80)
  city             String       @default("Chandigarh") @db.VarChar(80)
  fullAddress      String       @map("full_address")
  cuisines         String[]
  diningType       DiningType   @default(DINE_IN) @map("dining_type")
  averageRating    Decimal      @default(0.0) @map("average_rating") @db.Decimal(2, 1)
  reviewCount      Int          @default(0) @map("review_count")
  costForTwo       Int          @default(300) @map("cost_for_two")
  deliveryTimeMins Int          @default(30) @map("delivery_time_mins")
  isOpen           Boolean      @default(true) @map("is_open")
  bannerColor      String       @default("from-[#be123c] to-[#9f1239]") @map("banner_color")
  createdAt        DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt        DateTime     @updatedAt @map("updated_at") @db.Timestamptz

  categories MenuCategory[]
  menuItems  MenuItem[]
  reviews    Review[]
  orders     Order[]
  partners   RestaurantPartner[]

  @@index([sector])
  @@index([averageRating(sort: Desc)])
  @@map("restaurants")
}

model RestaurantPartner {
  id           String   @id @default(uuid()) @db.Uuid
  restaurantId String   @map("restaurant_id") @db.Uuid
  userId       String   @map("user_id") @db.Uuid
  partnerRole  String   @default("manager") @map("partner_role") @db.VarChar(40)
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz

  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([restaurantId, userId])
  @@map("restaurant_partners")
}

model MenuCategory {
  id           String     @id @default(uuid()) @db.Uuid
  restaurantId String     @map("restaurant_id") @db.Uuid
  name         String     @db.VarChar(100)
  displayOrder Int        @default(1) @map("display_order")
  isActive     Boolean    @default(true) @map("is_active")
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz

  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  menuItems  MenuItem[]

  @@index([restaurantId, displayOrder])
  @@map("menu_categories")
}

model MenuItem {
  id              String       @id @default(uuid()) @db.Uuid
  restaurantId    String       @map("restaurant_id") @db.Uuid
  categoryId      String       @map("category_id") @db.Uuid
  name            String       @db.VarChar(150)
  description     String?
  price           Decimal      @db.Decimal(8, 2)
  vegType         VegType      @default(VEG) @map("veg_type")
  isSpicy         Boolean      @default(false) @map("is_spicy")
  isBestseller    Boolean      @default(false) @map("is_bestseller")
  isAvailable     Boolean      @default(true) @map("is_available")
  prepTimeMinutes Int          @default(10) @map("prep_time_minutes")
  calories        Int?
  createdAt       DateTime     @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime     @updatedAt @map("updated_at") @db.Timestamptz

  restaurant Restaurant   @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  category   MenuCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]

  @@index([restaurantId, categoryId])
  @@index([restaurantId, isAvailable])
  @@map("menu_items")
}

model Review {
  id           String     @id @default(uuid()) @db.Uuid
  restaurantId String     @map("restaurant_id") @db.Uuid
  userId       String?    @map("user_id") @db.Uuid
  userName     String     @map("user_name") @db.VarChar(100)
  rating       Int        @db.SmallInt
  dishTag      String?    @map("dish_tag") @db.VarChar(100)
  comment      String
  isLatest     Boolean    @default(false) @map("is_latest")
  helpfulVotes Int        @default(0) @map("helpful_votes")
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz

  restaurant Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
  user       User?      @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([restaurantId, createdAt(sort: Desc)])
  @@index([restaurantId, rating])
  @@map("reviews")
}

model Order {
  id             String      @id @default(uuid()) @db.Uuid
  orderNumber    String      @unique @map("order_number") @db.VarChar(30)
  userId         String      @map("user_id") @db.Uuid
  restaurantId   String      @map("restaurant_id") @db.Uuid
  addressId      String      @map("address_id") @db.Uuid
  status         OrderStatus @default(PLACED)
  subtotal       Decimal     @db.Decimal(8, 2)
  taxAmount      Decimal     @default(0.00) @map("tax_amount") @db.Decimal(8, 2)
  deliveryFee    Decimal     @default(0.00) @map("delivery_fee") @db.Decimal(8, 2)
  discountAmount Decimal     @default(0.00) @map("discount_amount") @db.Decimal(8, 2)
  grandTotal     Decimal     @map("grand_total") @db.Decimal(8, 2)
  paymentMethod  String      @default("UPI") @map("payment_method") @db.VarChar(40)
  paymentStatus  String      @default("paid") @map("payment_status") @db.VarChar(30)
  createdAt      DateTime    @default(now()) @map("created_at") @db.Timestamptz

  user       User        @relation(fields: [userId], references: [id])
  restaurant Restaurant  @relation(fields: [restaurantId], references: [id])
  address    UserAddress @relation(fields: [addressId], references: [id])
  items      OrderItem[]

  @@index([userId, createdAt(sort: Desc)])
  @@index([restaurantId, status])
  @@map("orders")
}

model OrderItem {
  id                 String   @id @default(uuid()) @db.Uuid
  orderId            String   @map("order_id") @db.Uuid
  menuItemId         String   @map("menu_item_id") @db.Uuid
  itemName           String   @map("item_name") @db.VarChar(150)
  unitPrice          Decimal  @map("unit_price") @db.Decimal(8, 2)
  quantity           Int
  lineTotal          Decimal  @map("line_total") @db.Decimal(8, 2)
  customizationNotes String?  @map("customization_notes")

  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuItem MenuItem @relation(fields: [menuItemId], references: [id])

  @@index([orderId])
  @@map("order_items")
}
`;

export const VERCEL_GITHUB_PLAYBOOK = {
  title: 'Vercel & GitHub Deployment Architecture Playbook',
  summary: 'How to transition this codebase into your GitHub repository and deploy live on Vercel with serverless PostgreSQL.',
  steps: [
    {
      step: '01',
      title: 'Initialize Local Git & Connect to Your GitHub Repository',
      commands: [
        'git init',
        'git add .',
        'git commit -m "feat: initial Zomato Lite architecture with restaurant menu and schema"',
        'git branch -M main',
        'git remote add origin https://github.com/<your-username>/zomato-lite.git',
        'git push -u origin main',
      ],
      notes: 'Make sure your .gitignore contains node_modules, .env.local, and dist directories.',
    },
    {
      step: '02',
      title: 'Database Setup on Vercel Postgres / Supabase / Neon',
      commands: [
        '# If using Supabase / Neon / Vercel Postgres:',
        '# 1. Create a PostgreSQL project on Neon (https://neon.tech) or Supabase (https://supabase.com)',
        '# 2. Run the provided schema.sql in the SQL Query Editor, or use Prisma db push:',
        'npx prisma db push',
        '# 3. Seed your database:',
        'npx prisma db seed',
      ],
      notes: 'PostgreSQL provides JSONB queries for preferences, decimal precision for monetary billing, and rock-solid ACID transactions for order checkouts.',
    },
    {
      step: '03',
      title: 'Import Repository to Vercel (Auto-Detects Vite)',
      commands: [
        '# .npmrc (already configured in root): legacy-peer-deps=true',
        '# vercel.json (already configured in root): rewrites to /index.html for SPA routes',
        '# Deploy via Vercel CLI or dashboard:',
        'npm i -g vercel',
        'vercel login',
        'vercel link',
        'vercel --prod',
      ],
      notes: 'The included .npmrc prevents npm peer dependency conflicts (ERESOLVE). Framework Preset: Vite, Build Command: npm run build, Output Directory: dist.',
    },
    {
      step: '04',
      title: 'Configure Production Environment Variables on Vercel',
      commands: [
        'DATABASE_URL="postgres://user:password@ep-cool-db.us-east-2.aws.neon.tech/zomato_lite?sslmode=require"',
        'JWT_SECRET="your-high-entropy-jwt-secret-key-32-chars"',
        'VITE_APP_ENV="production"',
      ],
      notes: 'Set these in Vercel Dashboard -> Project Settings -> Environment Variables.',
    },
  ],
};
