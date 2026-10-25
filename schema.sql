-- ====================================================================
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
