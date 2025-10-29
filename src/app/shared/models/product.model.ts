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
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

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
