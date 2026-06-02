-- Initial migration: ensure core schema exists and add favorites table

-- Products: category + simple tags for UI filters
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS best_seller BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS today_deal BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS new_release BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE products SET category = 'ELECTRONICS' WHERE category IS NULL;

-- User role / seller approval fields added for admin/seller flows.
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role VARCHAR(255) DEFAULT 'CUSTOMER';
UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS seller_approved BOOLEAN DEFAULT FALSE;
UPDATE users SET seller_approved = FALSE WHERE seller_approved IS NULL;
UPDATE users SET role = 'SELLER' WHERE seller_approved = TRUE AND role = 'CUSTOMER';

-- Seller ownership linkage for products.
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS seller_profile_id VARCHAR(255);

-- Favorites table (user-specific)
CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE (user_id, product_id)
);
