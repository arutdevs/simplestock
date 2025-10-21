/**
 * Product Mock Data
 * ข้อมูลตัวอย่างสำหรับใช้ทดสอบระบบ
 */

import { Product, Category, StockStatus } from './index';

/**
 * Mock Categories
 */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'อิเล็กทรอนิกส์',
    description: 'สินค้าอิเล็กทรอนิกส์ทุกชนิด',
    icon: 'fa-laptop',
    color: '#6366F1',
    productCount: 45,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'เครื่องใช้ไฟฟ้า',
    description: 'เครื่องใช้ไฟฟ้าในบ้าน',
    icon: 'fa-plug',
    color: '#10B981',
    productCount: 32,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'เฟอร์นิเจอร์',
    description: 'เฟอร์นิเจอร์และของตกแต่งบ้าน',
    icon: 'fa-couch',
    color: '#F59E0B',
    productCount: 28,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'เครื่องเขียน',
    description: 'อุปกรณ์เครื่องเขียนและสำนักงาน',
    icon: 'fa-pen',
    color: '#EF4444',
    productCount: 51,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

/**
 * Mock Products
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'LAP-001',
    name: 'โน้ตบุ๊ค Dell Inspiron 15',
    description: 'โน้ตบุ๊คสำหรับงานทั่วไป Intel Core i5 RAM 8GB SSD 256GB',
    category: 'อิเล็กทรอนิกส์',
    price: 18900,
    cost: 15000,
    stock: 15,
    minStock: 5,
    unit: 'ชิ้น',
    barcode: '8858123456001',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-20')
  },
  {
    id: '2',
    sku: 'KEY-002',
    name: 'คีย์บอร์ด Mechanical Gaming RGB',
    description: 'คีย์บอร์ดเกมมิ่ง สวิตช์ Blue RGB Backlight',
    category: 'อิเล็กทรอนิกส์',
    price: 2590,
    cost: 1800,
    stock: 3,
    minStock: 5,
    unit: 'ชิ้น',
    barcode: '8858123456002',
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-10-21')
  },
  {
    id: '3',
    sku: 'MOU-003',
    name: 'เมาส์ไร้สาย Logitech M185',
    description: 'เมาส์ไร้สายใช้งานง่าย ทนทาน แบตเตอรี่อึด',
    category: 'อิเล็กทรอนิกส์',
    price: 390,
    cost: 250,
    stock: 0,
    minStock: 10,
    unit: 'ชิ้น',
    barcode: '8858123456003',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-10-18')
  },
  {
    id: '4',
    sku: 'MON-004',
    name: 'จอคอมพิวเตอร์ 24 นิ้ว Full HD',
    description: 'จอมอนิเตอร์ 24" IPS Panel 75Hz HDMI',
    category: 'อิเล็กทรอนิกส์',
    price: 3290,
    cost: 2500,
    stock: 8,
    minStock: 3,
    unit: 'ชิ้น',
    barcode: '8858123456004',
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-10-21')
  },
  {
    id: '5',
    sku: 'FAN-005',
    name: 'พัดลมตั้งโต๊ะ 12 นิ้ว',
    description: 'พัดลมตั้งโต๊ะ ปรับระดับได้ 3 ระดับ',
    category: 'เครื่องใช้ไฟฟ้า',
    price: 590,
    cost: 350,
    stock: 25,
    minStock: 10,
    unit: 'เครื่อง',
    barcode: '8858123456005',
    isActive: true,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-10-19')
  },
  {
    id: '6',
    sku: 'DESK-006',
    name: 'โต๊ะทำงาน ขนาด 120x60 ซม.',
    description: 'โต๊ะทำงานไม้ MDF เคลือบเมลามีน กันน้ำ',
    category: 'เฟอร์นิเจอร์',
    price: 2990,
    cost: 2000,
    stock: 12,
    minStock: 5,
    unit: 'ชิ้น',
    barcode: '8858123456006',
    isActive: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-10-20')
  },
  {
    id: '7',
    sku: 'CHAIR-007',
    name: 'เก้าอี้สำนักงาน เบาะหนัง',
    description: 'เก้าอี้สำนักงานปรับระดับได้ มีที่พักแขน',
    category: 'เฟอร์นิเจอร์',
    price: 3500,
    cost: 2500,
    stock: 2,
    minStock: 3,
    unit: 'ตัว',
    barcode: '8858123456007',
    isActive: true,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-10-21')
  },
  {
    id: '8',
    sku: 'PEN-008',
    name: 'ปากกาลูกลื่น สีน้ำเงิน (แพ็ค 12 ด้าม)',
    description: 'ปากกาลูกลื่น 0.7mm หมึกเขียนลื่น ไม่เลอะ',
    category: 'เครื่องเขียน',
    price: 120,
    cost: 80,
    stock: 150,
    minStock: 50,
    unit: 'แพ็ค',
    barcode: '8858123456008',
    isActive: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-10-20')
  },
  {
    id: '9',
    sku: 'NOTE-009',
    name: 'สมุดโน้ต A5 สันห่วง 100 แผ่น',
    description: 'สมุดโน้ตบุ๊คสันห่วง กระดาษ 80 แกรม',
    category: 'เครื่องเขียน',
    price: 45,
    cost: 25,
    stock: 85,
    minStock: 30,
    unit: 'เล่ม',
    barcode: '8858123456009',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-10-19')
  },
  {
    id: '10',
    sku: 'RICE-010',
    name: 'หม้อหุงข้าว 1.8 ลิตร',
    description: 'หม้อหุงข้าวไฟฟ้า ความจุ 1.8 ลิตร ฟังก์ชันอุ่นอัตโนมัติ',
    category: 'เครื่องใช้ไฟฟ้า',
    price: 1290,
    cost: 900,
    stock: 18,
    minStock: 8,
    unit: 'เครื่อง',
    barcode: '8858123456010',
    isActive: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-10-21')
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
