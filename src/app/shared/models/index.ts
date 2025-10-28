/**
 * Models Index
 * Export ทุก model จากจุดเดียว เพื่อให้ import ได้ง่าย
 *
 * Usage:
 * import { Product, ProductCreateDto, Category, StockStatus } from '@shared/models';
 */

// Product Models
export type {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductListResponse,
  ProductFilter,
} from './product.model';

export {
  StockStatus,
  ProductUnit,
  getStockStatus,
  calculateProfit,
  calculateStockValue,
} from './product.model';

// Category Models
export type {
  Category,
  CategoryCreateDto,
  CategoryUpdateDto,
} from './category.model';

// Mock Data
export { MOCK_PRODUCTS, MOCK_CATEGORIES } from './product.mock';
