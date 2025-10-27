/**
 * Product Model
 * ใช้สำหรับจัดการข้อมูลสินค้าทั้งหมด (CRUD)
 */

// Stock Status Enum
export enum StockStatus {
  IN_STOCK = 'IN_STOCK',      // มีสินค้า
  LOW_STOCK = 'LOW_STOCK',    // สินค้าใกล้หมด
  OUT_OF_STOCK = 'OUT_OF_STOCK' // สินค้าหมด
}

// Product Unit Enum (หน่วยนับ)
export enum ProductUnit {
  PIECE = 'ชิ้น',
  BOX = 'กล่อง',
  PACK = 'แพ็ค',
  KG = 'กิโลกรัม',
  LITER = 'ลิตร',
  METER = 'เมตร',
  SET = 'เซ็ต'
}

/**
 * Product Interface - หลัก
 * ใช้ทั้ง การดึงข้อมูล และ การแสดงผล
 */
export interface Product {
  id: string;                    // ID สินค้า
  sku: string;                   // รหัสสินค้า (Stock Keeping Unit - ต้องไม่ซ้ำ)
  name: string;                  // ชื่อสินค้า
  description?: string;          // รายละเอียดสินค้า
  category: string;              // หมวดหมู่สินค้า
  price: number;                 // ราคาขาย
  cost?: number;                 // ราคาทุน
  stock: number;                 // จำนวนคงเหลือ
  minStock?: number;             // จำนวนขั้นต่ำ (สำหรับแจ้งเตือน)
  unit: string;                  // หน่วยนับ (ชิ้น, กล่อง, etc.)
  imageUrl?: string;             // รูปภาพสินค้า (base64 หรือ URL)
  isActive: boolean;             // สถานะการใช้งาน
  createdAt: Date;               // วันที่สร้าง
  updatedAt: Date;               // วันที่แก้ไขล่าสุด
}

/**
 * ProductCreateDto
 * ใช้สำหรับสร้างสินค้าใหม่ (ไม่มี id, createdAt, updatedAt)
 */
export interface ProductCreateDto {
  sku: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  minStock?: number;
  unit: string;
  imageUrl?: string;
  isActive?: boolean;  // default = true
}

/**
 * ProductUpdateDto
 * ใช้สำหรับอัปเดตสินค้า (ทุกฟิลด์ optional ยกเว้น id)
 */
export interface ProductUpdateDto {
  id: string;
  sku?: string;
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  unit?: string;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * ProductListResponse
 * ใช้สำหรับการดึงข้อมูลแบบมี pagination
 */
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * ProductFilter
 * ใช้สำหรับกรองและค้นหาสินค้า
 */
export interface ProductFilter {
  search?: string;           // ค้นหาจาก ชื่อ, SKU
  category?: string;         // กรองตามหมวดหมู่
  stockStatus?: StockStatus; // กรองตามสถานะสต็อก
  minPrice?: number;         // ราคาขั้นต่ำ
  maxPrice?: number;         // ราคาสูงสุด
  isActive?: boolean;        // สถานะการใช้งาน
  page?: number;             // หน้าที่
  pageSize?: number;         // จำนวนต่อหน้า
  sortBy?: string;           // เรียงตาม (name, price, stock, etc.)
  sortOrder?: 'asc' | 'desc'; // เรียงแบบ
}

/**
 * Helper function: คำนวณสถานะสต็อก
 */
export function getStockStatus(product: Product): StockStatus {
  if (product.stock <= 0) {
    return StockStatus.OUT_OF_STOCK;
  }
  if (product.minStock && product.stock <= product.minStock) {
    return StockStatus.LOW_STOCK;
  }
  return StockStatus.IN_STOCK;
}

/**
 * Helper function: คำนวณกำไรต่อหน่วย
 */
export function calculateProfit(product: Product): number | null {
  if (!product.cost) return null;
  return product.price - product.cost;
}

/**
 * Helper function: คำนวณมูลค่าสต็อก
 */
export function calculateStockValue(product: Product): number {
  return product.stock * product.price;
}
