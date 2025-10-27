-- ============================================
-- SimpleStock Database Schema (Simple Version)
-- สำหรับจัดการสินค้าและหมวดหมู่เบื้องต้น
-- PostgreSQL / MySQL Compatible
-- ============================================

-- ===== CATEGORIES TABLE =====
-- หมวดหมู่สินค้า เช่น อิเล็กทรอนิกส์, เสื้อผ้า, อาหาร
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- FontAwesome class เช่น "fa-laptop"
    color VARCHAR(7),  -- Hex color เช่น "#667eea"
    product_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes สำหรับเร่งความเร็ว
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- ===== PRODUCTS TABLE =====
-- สินค้าทั้งหมดในระบบ
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,  -- รหัสอ้างอิงสินค้า (ต้องไม่ซ้ำ)
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    cost DECIMAL(12, 2),
    stock INT NOT NULL DEFAULT 0,
    min_stock INT DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    image_url TEXT,        -- รูปภาพ (base64 string หรือ URL)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign Key: สินค้าต้องอยู่ในหมวดหมู่
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,

    -- Constraints: ตรวจสอบความถูกต้อง
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_stock_positive CHECK (stock >= 0)
);

-- Indexes สำหรับเร่งความเร็ว
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ============================================
-- TRIGGERS (อัตโนมัติ)
-- ============================================

-- อัปเดตจำนวนสินค้าในหมวดหมู่เมื่อเพิ่มสินค้า
DELIMITER //
CREATE TRIGGER trg_product_insert_update_category
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    UPDATE categories
    SET product_count = product_count + 1
    WHERE id = NEW.category_id;
END//

-- อัปเดตจำนวนสินค้าในหมวดหมู่เมื่อลบสินค้า
CREATE TRIGGER trg_product_delete_update_category
AFTER DELETE ON products
FOR EACH ROW
BEGIN
    UPDATE categories
    SET product_count = product_count - 1
    WHERE id = OLD.category_id;
END//

-- อัปเดตจำนวนสินค้าในหมวดหมู่เมื่อย้ายสินค้าไปหมวดหมู่อื่น
CREATE TRIGGER trg_product_update_category
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.category_id != NEW.category_id THEN
        -- ลดจำนวนในหมวดหมู่เก่า
        UPDATE categories
        SET product_count = product_count - 1
        WHERE id = OLD.category_id;

        -- เพิ่มจำนวนในหมวดหมู่ใหม่
        UPDATE categories
        SET product_count = product_count + 1
        WHERE id = NEW.category_id;
    END IF;
END//
DELIMITER ;

-- ============================================
-- VIEWS (สำหรับดูข้อมูลแบบสรุป)
-- ============================================

-- สินค้าที่ใกล้หมด (stock <= minStock)
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

-- มูลค่าสต็อกทั้งหมด
CREATE VIEW v_product_stock_value AS
SELECT
    p.id,
    p.sku,
    p.name,
    c.name as category_name,
    p.stock,
    p.price,
    p.cost,
    (p.stock * p.price) as stock_value,
    (p.stock * COALESCE(p.cost, 0)) as cost_value,
    ((p.price - COALESCE(p.cost, 0)) * p.stock) as potential_profit
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true;

-- ============================================
-- SAMPLE DATA (ข้อมูลตัวอย่าง)
-- ============================================

-- เพิ่มหมวดหมู่ตัวอย่าง
INSERT INTO categories (id, name, description, icon, color) VALUES
('cat-001', 'อิเล็กทรอนิกส์', 'สินค้าอิเล็กทรอนิกส์และอุปกรณ์ IT', 'fa-laptop', '#667eea'),
('cat-002', 'เสื้อผ้า', 'เสื้อผ้าและแฟชั่น', 'fa-tshirt', '#f093fb'),
('cat-003', 'อาหารและเครื่องดื่ม', 'สินค้าอาหารและเครื่องดื่ม', 'fa-coffee', '#4facfe'),
('cat-004', 'เครื่องใช้ในบ้าน', 'เฟอร์นิเจอร์และของใช้ในบ้าน', 'fa-chair', '#43e97b'),
('cat-005', 'เครื่องเขียน', 'อุปกรณ์เครื่องเขียนและสำนักงาน', 'fa-pen', '#764ba2');

-- เพิ่มสินค้าตัวอย่าง
INSERT INTO products (id, sku, name, description, category_id, price, cost, stock, min_stock, unit, is_active) VALUES
('prod-001', 'LAP-001', 'Laptop Dell Inspiron 15', 'Intel Core i5 • 8GB RAM • 256GB SSD', 'cat-001', 25900.00, 20000.00, 45, 10, 'ชิ้น', true),
('prod-002', 'TSH-001', 'เสื้อยืดคอกลม', '100% Cotton สีขาว ไซส์ M', 'cat-002', 299.00, 150.00, 120, 20, 'ชิ้น', true),
('prod-003', 'COF-001', 'เมล็ดกาแฟอราบิก้า', 'คั่วกลาง 250 กรัม', 'cat-003', 350.00, 200.00, 15, 20, 'แพ็ค', true),
('prod-004', 'CHA-001', 'เก้าอี้สำนักงาน', 'ปรับระดับได้ มีที่เท้าแขน', 'cat-004', 2500.00, 1800.00, 0, 5, 'ตัว', true),
('prod-005', 'MOU-001', 'เมาส์ไร้สาย', 'Bluetooth เชื่อมต่อได้ 3 อุปกรณ์', 'cat-001', 590.00, 350.00, 80, 15, 'ชิ้น', true);

-- ============================================
-- HELPER QUERIES (คำสั่งที่ใช้บ่อย)
-- ============================================

-- ดูสินค้าทั้งหมดพร้อมหมวดหมู่
-- SELECT p.*, c.name as category_name
-- FROM products p
-- LEFT JOIN categories c ON p.category_id = c.id
-- WHERE p.is_active = true;

-- ดูสินค้าที่ใกล้หมด
-- SELECT * FROM v_low_stock_products;

-- ดูมูลค่าสต็อกทั้งหมด
-- SELECT SUM(stock_value) as total_stock_value
-- FROM v_product_stock_value;

-- ค้นหาสินค้าจากชื่อหรือ SKU
-- SELECT * FROM products
-- WHERE (name LIKE '%keyword%' OR sku LIKE '%keyword%')
-- AND is_active = true;

-- นับจำนวนสินค้าในแต่ละหมวดหมู่
-- SELECT c.name, COUNT(p.id) as product_count
-- FROM categories c
-- LEFT JOIN products p ON c.id = p.category_id
-- WHERE c.is_active = true
-- GROUP BY c.id, c.name;
