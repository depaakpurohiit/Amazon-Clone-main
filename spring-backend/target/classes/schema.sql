-- Idempotent schema repair for existing local H2 databases.
-- This keeps old development databases usable after the role/seller feature fields were added.

ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(255) DEFAULT 'CUSTOMER';
UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS seller_approved BOOLEAN DEFAULT FALSE;
UPDATE users SET seller_approved = FALSE WHERE seller_approved IS NULL;
UPDATE users SET role = 'SELLER' WHERE seller_approved = TRUE AND role = 'CUSTOMER';

ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_profile_id VARCHAR(255);
