-- ============================================
-- SimpleStock Database Schema
-- PostgreSQL / MySQL Compatible
-- ============================================

-- ===== USERS TABLE =====
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff', -- admin, manager, staff
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ===== CATEGORIES TABLE =====
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- FontAwesome class
    color VARCHAR(7), -- Hex color
    product_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_name ON categories(name);

-- ===== PRODUCTS TABLE =====
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    cost DECIMAL(12, 2),
    stock INT NOT NULL DEFAULT 0,
    min_stock INT DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    image_url TEXT,
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_stock_positive CHECK (stock >= 0)
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ===== SUPPLIERS TABLE =====
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    tax_id VARCHAR(20), -- เลขประจำตัวผู้เสียภาษี
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_suppliers_code ON suppliers(code);
CREATE INDEX idx_suppliers_name ON suppliers(name);

-- ===== CUSTOMERS TABLE =====
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    tax_id VARCHAR(20),
    credit_limit DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_code ON customers(code);
CREATE INDEX idx_customers_name ON customers(name);

-- ===== PURCHASE ORDERS TABLE =====
CREATE TABLE purchase_orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id VARCHAR(36) NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    received_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, received, cancelled
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_purchase_orders_number ON purchase_orders(order_number);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_date ON purchase_orders(order_date);

-- ===== PURCHASE ORDER ITEMS TABLE =====
CREATE TABLE purchase_order_items (
    id VARCHAR(36) PRIMARY KEY,
    purchase_order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    notes TEXT,

    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,

    CONSTRAINT chk_po_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_po_price_positive CHECK (unit_price >= 0)
);

CREATE INDEX idx_po_items_order ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_po_items_product ON purchase_order_items(product_id);

-- ===== SALES ORDERS TABLE =====
CREATE TABLE sales_orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, delivered, cancelled
    subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(50), -- cash, credit, transfer, etc.
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_sales_orders_number ON sales_orders(order_number);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_date ON sales_orders(order_date);

-- ===== SALES ORDER ITEMS TABLE =====
CREATE TABLE sales_order_items (
    id VARCHAR(36) PRIMARY KEY,
    sales_order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    discount DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    notes TEXT,

    FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,

    CONSTRAINT chk_so_quantity_positive CHECK (quantity > 0),
    CONSTRAINT chk_so_price_positive CHECK (unit_price >= 0)
);

CREATE INDEX idx_so_items_order ON sales_order_items(sales_order_id);
CREATE INDEX idx_so_items_product ON sales_order_items(product_id);

-- ===== INVENTORY TRANSACTIONS TABLE =====
CREATE TABLE inventory_transactions (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL, -- purchase, sale, adjustment, return
    quantity INT NOT NULL, -- positive for increase, negative for decrease
    balance_before INT NOT NULL,
    balance_after INT NOT NULL,
    reference_type VARCHAR(50), -- purchase_order, sales_order, adjustment
    reference_id VARCHAR(36), -- ID of the reference document
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_inventory_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_type ON inventory_transactions(type);
CREATE INDEX idx_inventory_created ON inventory_transactions(created_at);
CREATE INDEX idx_inventory_reference ON inventory_transactions(reference_type, reference_id);

-- ============================================
-- TRIGGERS (Optional - for automatic updates)
-- ============================================

-- Update category product count when product is added/removed
DELIMITER //
CREATE TRIGGER trg_product_insert_update_category
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    UPDATE categories
    SET product_count = product_count + 1
    WHERE id = NEW.category_id;
END//

CREATE TRIGGER trg_product_delete_update_category
AFTER DELETE ON products
FOR EACH ROW
BEGIN
    UPDATE categories
    SET product_count = product_count - 1
    WHERE id = OLD.category_id;
END//
DELIMITER ;

-- ============================================
-- VIEWS (Optional - for common queries)
-- ============================================

-- Low stock products view
CREATE VIEW v_low_stock_products AS
SELECT
    p.id,
    p.sku,
    p.name,
    c.name as category_name,
    p.stock,
    p.min_stock,
    p.price,
    p.unit
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
  AND p.stock <= p.min_stock
ORDER BY p.stock ASC;

-- Product stock value view
CREATE VIEW v_product_stock_value AS
SELECT
    p.id,
    p.sku,
    p.name,
    p.stock,
    p.price,
    p.cost,
    (p.stock * p.price) as stock_value,
    (p.stock * p.cost) as cost_value,
    ((p.price - p.cost) * p.stock) as potential_profit
FROM products p
WHERE p.is_active = true;

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert default admin user
INSERT INTO users (id, email, password, first_name, last_name, role, is_active)
VALUES
('admin-001', 'admin@simplestock.com', 'hashed_password_here', 'Admin', 'User', 'admin', true);

-- Insert sample categories
INSERT INTO categories (id, name, description, icon, color)
VALUES
('cat-001', 'อิเล็กทรอนิกส์', 'สินค้าอิเล็กทรอนิกส์', 'fa-laptop', '#667eea'),
('cat-002', 'เสื้อผ้า', 'เสื้อผ้าและแฟชั่น', 'fa-tshirt', '#f093fb'),
('cat-003', 'อาหารและเครื่องดื่ม', 'สินค้าอาหาร', 'fa-coffee', '#4facfe');
