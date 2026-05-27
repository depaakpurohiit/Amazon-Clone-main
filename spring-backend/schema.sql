-- PostgreSQL Schema for Amazon Clone Backend

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    url VARCHAR(500) NOT NULL,
    res_url VARCHAR(500),
    price VARCHAR(50) NOT NULL,
    value VARCHAR(50) NOT NULL,
    acc_value INTEGER NOT NULL,
    discount VARCHAR(20),
    mrp VARCHAR(50),
    name TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'ELECTRONICS',
    best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    today_deal BOOLEAN NOT NULL DEFAULT FALSE,
    new_release BOOLEAN NOT NULL DEFAULT FALSE
);

-- Product points table (normalized from embedded array)
CREATE TABLE product_points (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    point TEXT NOT NULL
);

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User tokens table (normalized from embedded array)
CREATE TABLE user_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL
);

-- Cart items table (normalized from embedded array)
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL DEFAULT 1,
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date_ordered TIMESTAMP NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT FALSE,
    amount DECIMAL(10,2) NOT NULL,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature TEXT
);

-- Order products table (normalized from embedded array)
CREATE TABLE order_products (
    id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL,
    price_at_time DECIMAL(10,2)
);

-- Indexes for performance
CREATE INDEX idx_product_points_product_id ON product_points(product_id);
CREATE INDEX idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_date_ordered ON orders(date_ordered DESC);
CREATE INDEX idx_order_products_order_id ON order_products(order_id);
CREATE INDEX idx_order_products_product_id ON order_products(product_id);
