-- V2: create missing schema objects (idempotent)

-- Ensure product columns used by UI exist
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS best_seller BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS today_deal BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS new_release BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE products SET category = 'ELECTRONICS' WHERE category IS NULL;

-- Ensure user role and seller approval fields exist
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role VARCHAR(255) DEFAULT 'CUSTOMER';
UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS seller_approved BOOLEAN DEFAULT FALSE;
UPDATE users SET seller_approved = FALSE WHERE seller_approved IS NULL;
UPDATE users SET role = 'SELLER' WHERE seller_approved = TRUE AND role = 'CUSTOMER';

-- Seller ownership linkage for products
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS seller_profile_id VARCHAR(255);

-- Create seller_profiles table (used by seller/admin flows)
CREATE TABLE IF NOT EXISTS seller_profiles (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  business_name VARCHAR(255),
  bio TEXT,
  logo_url VARCHAR(1024),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_seller_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create active_sessions table for session tracking
CREATE TABLE IF NOT EXISTS active_sessions (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(1024) UNIQUE,
  user_id VARCHAR(255),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_active_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Favorites table (user-specific). V1 attempted this, but baseline may have skipped it.
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE (user_id, product_id)
);

-- Defensive: ensure indexes exist for common lookups
CREATE INDEX IF NOT EXISTS idx_products_seller_profile_id ON products(seller_profile_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON active_sessions(session_id);
