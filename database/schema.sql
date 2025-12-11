-- Database Schema for Bulk Pricing App

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Tiers Table
CREATE TABLE pricing_tiers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_quantity_range CHECK (min_quantity > 0 AND (max_quantity IS NULL OR max_quantity >= min_quantity))
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_pricing_tiers_product ON pricing_tiers(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Sample Data
INSERT INTO products (name, description, base_price, image_url, stock_quantity) VALUES
('Premium Widget', 'High-quality widget for bulk orders', 10.00, 'https://via.placeholder.com/300', 1000),
('Standard Gadget', 'Reliable gadget with volume discounts', 15.00, 'https://via.placeholder.com/300', 800),
('Deluxe Component', 'Top-tier component for wholesale', 25.00, 'https://via.placeholder.com/300', 500);

-- Pricing tiers for Premium Widget (Product ID 1)
INSERT INTO pricing_tiers (product_id, min_quantity, max_quantity, unit_price, discount_percentage) VALUES
(1, 1, 10, 10.00, 0),
(1, 11, 50, 8.50, 15),
(1, 51, 100, 7.00, 30),
(1, 101, NULL, 6.00, 40);

-- Pricing tiers for Standard Gadget (Product ID 2)
INSERT INTO pricing_tiers (product_id, min_quantity, max_quantity, unit_price, discount_percentage) VALUES
(2, 1, 20, 15.00, 0),
(2, 21, 100, 12.00, 20),
(2, 101, NULL, 10.00, 33);

-- Pricing tiers for Deluxe Component (Product ID 3)
INSERT INTO pricing_tiers (product_id, min_quantity, max_quantity, unit_price, discount_percentage) VALUES
(3, 1, 10, 25.00, 0),
(3, 11, 50, 22.00, 12),
(3, 51, NULL, 20.00, 20);
