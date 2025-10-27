/**
 * Product Mock Data
 * ข้อมูลตัวอย่างสำหรับใช้ทดสอบระบบ
 */

import { Product, Category, StockStatus } from './index';

/**
 * Mock Categories
 * ข้อมูลหมวดหมู่ตัวอย่าง (ตรงกับ database schema)
 */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-001',
    name: 'อิเล็กทรอนิกส์',
    description: 'สินค้าอิเล็กทรอนิกส์และอุปกรณ์ IT',
    icon: 'fa-laptop',
    color: '#667eea',
    productCount: 2,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-002',
    name: 'เสื้อผ้า',
    description: 'เสื้อผ้าและแฟชั่น',
    icon: 'fa-tshirt',
    color: '#f093fb',
    productCount: 1,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-003',
    name: 'อาหารและเครื่องดื่ม',
    description: 'สินค้าอาหารและเครื่องดื่ม',
    icon: 'fa-coffee',
    color: '#4facfe',
    productCount: 1,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-004',
    name: 'เครื่องใช้ในบ้าน',
    description: 'เฟอร์นิเจอร์และของใช้ในบ้าน',
    icon: 'fa-chair',
    color: '#43e97b',
    productCount: 0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cat-005',
    name: 'เครื่องเขียน',
    description: 'อุปกรณ์เครื่องเขียนและสำนักงาน',
    icon: 'fa-pen',
    color: '#764ba2',
    productCount: 0,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

/**
 * Mock Products
 * ข้อมูลสินค้าตัวอย่าง 4 รายการ (ตรงกับ database schema)
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'LAP-001',
    name: 'Laptop Dell Inspiron 15',
    description: 'Intel Core i5 • 8GB RAM • 256GB SSD',
    category: 'อิเล็กทรอนิกส์',
    price: 25900.00,
    cost: 20000.00,
    stock: 45,
    minStock: 10,
    unit: 'ชิ้น',
    imageUrl: undefined,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'prod-002',
    sku: 'TSH-001',
    name: 'เสื้อยืดคอกลม',
    description: '100% Cotton สีขาว ไซส์ M',
    category: 'เสื้อผ้า',
    price: 299.00,
    cost: 150.00,
    stock: 120,
    minStock: 20,
    unit: 'ชิ้น',
    imageUrl: undefined,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'prod-003',
    sku: 'COF-001',
    name: 'เมล็ดกาแฟอราบิก้า',
    description: 'คั่วกลาง 250 กรัม',
    category: 'อาหารและเครื่องดื่ม',
    price: 350.00,
    cost: 200.00,
    stock: 15,
    minStock: 20,
    unit: 'แพ็ค',
    imageUrl: undefined,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'prod-004',
    sku: 'MOU-001',
    name: 'เมาส์ไร้สาย',
    description: 'Bluetooth เชื่อมต่อได้ 3 อุปกรณ์',
    category: 'อิเล็กทรอนิกส์',
    price: 590.00,
    cost: 350.00,
    stock: 80,
    minStock: 15,
    unit: 'ชิ้น',
    imageUrl: undefined,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

/**
 * Helper: Get products by category
 */
export function getProductsByCategory(categoryName: string): Product[] {
  return MOCK_PRODUCTS.filter(p => p.category === categoryName);
}

/**
 * Helper: Get products by stock status
 */
export function getProductsByStockStatus(status: StockStatus): Product[] {
  return MOCK_PRODUCTS.filter(p => {
    if (p.stock <= 0) return status === StockStatus.OUT_OF_STOCK;
    if (p.minStock && p.stock <= p.minStock) return status === StockStatus.LOW_STOCK;
    return status === StockStatus.IN_STOCK;
  });
}

/**
 * Helper: Calculate total stock value
 */
export function calculateTotalStockValue(): number {
  return MOCK_PRODUCTS.reduce((total, p) => total + (p.stock * p.price), 0);
}

/**
 * Helper: Get stats summary
 */
export function getStatsSummary() {
  return {
    totalProducts: MOCK_PRODUCTS.length,
    totalCategories: MOCK_CATEGORIES.length,
    lowStockCount: getProductsByStockStatus(StockStatus.LOW_STOCK).length,
    outOfStockCount: getProductsByStockStatus(StockStatus.OUT_OF_STOCK).length,
    totalValue: calculateTotalStockValue()
  };
}
