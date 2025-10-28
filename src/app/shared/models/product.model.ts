// shared/models/product.model.ts

// Stock Status Enum
export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

// Product Unit Enum
export enum ProductUnit {
  PIECE = 'ชิ้น',
  BOX = 'กล่อง',
  PACK = 'แพ็ค',
  KG = 'กิโลกรัม',
  LITER = 'ลิตร',
  METER = 'เมตร',
  SET = 'เซ็ต',
}

/**
 * Product Interface - ใช้ตัวเดียวสำหรับทุกอย่าง
 */
export interface Product {
  id?: string;
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
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ใช้ TypeScript Utility Types แทนการเขียนซ้ำ
 */
// สำหรับ Create - ไม่มี id, createdAt, updatedAt
export type ProductCreateDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// สำหรับ Update - ทุก field optional ยกเว้น id
export type ProductUpdateDto = Partial<Product> & { id: string };

/**
 * ProductListResponse
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
 */
export interface ProductFilter {
  search?: string;
  category?: string;
  stockStatus?: StockStatus;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
