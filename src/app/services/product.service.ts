/**
 * Product Service
 * จัดการ CRUD operations สำหรับสินค้า
 * ตอนนี้ใช้ MOCK_PRODUCTS แทน API (เมื่อมี Backend ให้เปลี่ยนเป็น HttpClient)
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductListResponse,
  ProductFilter,
  StockStatus,
  MOCK_PRODUCTS,
  getStockStatus
} from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // In-memory data store (จำลอง Database)
  private products: Product[] = [...MOCK_PRODUCTS];
  private nextId = 5; // เริ่มจาก prod-005 เพราะมี 4 รายการอยู่แล้ว

  constructor() {
    console.log('ProductService initialized with', this.products.length, 'products');
  }

  /**
   * ดึงสินค้าทั้งหมด (รองรับ pagination และ filter)
   */
  getAll(filter?: ProductFilter): Observable<ProductListResponse> {
    let filteredProducts = [...this.products];

    // Apply filters
    if (filter) {
      // Search by name or SKU
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower)
        );
      }

      // Filter by category
      if (filter.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filter.category);
      }

      // Filter by stock status
      if (filter.stockStatus) {
        filteredProducts = filteredProducts.filter(p => {
          const status = getStockStatus(p);
          return status === filter.stockStatus;
        });
      }

      // Filter by price range
      if (filter.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filter.minPrice!);
      }
      if (filter.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filter.maxPrice!);
      }

      // Filter by active status
      if (filter.isActive !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.isActive === filter.isActive);
      }

      // Sort
      if (filter.sortBy) {
        const sortField = filter.sortBy as keyof Product;
        const sortOrder = filter.sortOrder === 'desc' ? -1 : 1;
        filteredProducts.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];

          // Handle undefined values
          if (aVal === undefined && bVal === undefined) return 0;
          if (aVal === undefined) return 1;
          if (bVal === undefined) return -1;

          if (aVal < bVal) return -1 * sortOrder;
          if (aVal > bVal) return 1 * sortOrder;
          return 0;
        });
      }
    }

    // Pagination
    const page = filter?.page || 1;
    const pageSize = filter?.pageSize || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response: ProductListResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize)
    };

    // จำลอง API delay 300ms
    return of(response).pipe(delay(300));
  }

  /**
   * ดึงสินค้าตาม ID
   */
  getById(id: string): Observable<Product> {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }

    return of({ ...product }).pipe(delay(200));
  }

  /**
   * สร้างสินค้าใหม่
   */
  create(productDto: ProductCreateDto): Observable<Product> {
    const newProduct: Product = {
      id: `prod-${String(this.nextId++).padStart(3, '0')}`,
      sku: productDto.sku,
      name: productDto.name,
      description: productDto.description,
      category: productDto.category,
      price: productDto.price,
      cost: productDto.cost,
      stock: productDto.stock,
      minStock: productDto.minStock,
      unit: productDto.unit,
      imageUrl: productDto.imageUrl,
      isActive: productDto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.products.unshift(newProduct); // เพิ่มไว้ด้านบน
    console.log('Created product:', newProduct.id, newProduct.name);

    return of({ ...newProduct }).pipe(delay(300));
  }

  /**
   * อัปเดตสินค้า
   */
  update(productDto: ProductUpdateDto): Observable<Product> {
    const index = this.products.findIndex(p => p.id === productDto.id);

    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${productDto.id}`));
    }

    const updatedProduct: Product = {
      ...this.products[index],
      ...productDto,
      updatedAt: new Date()
    };

    this.products[index] = updatedProduct;
    console.log('Updated product:', updatedProduct.id, updatedProduct.name);

    return of({ ...updatedProduct }).pipe(delay(300));
  }

  /**
   * อัปเดตบางส่วนของสินค้า (Partial Update)
   */
  patch(id: string, updates: Partial<Product>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }

    const patchedProduct: Product = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date()
    };

    this.products[index] = patchedProduct;
    console.log('Patched product:', patchedProduct.id);

    return of({ ...patchedProduct }).pipe(delay(200));
  }

  /**
   * ลบสินค้า (Soft delete - เปลี่ยน isActive = false)
   */
  delete(id: string): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }

    // Soft delete
    this.products[index].isActive = false;
    this.products[index].updatedAt = new Date();

    console.log('Deleted (soft) product:', id);

    return of(void 0).pipe(delay(200));
  }

  /**
   * ลบสินค้าถาวร (Hard delete)
   */
  hardDelete(id: string): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }

    this.products.splice(index, 1);
    console.log('Deleted (hard) product:', id);

    return of(void 0).pipe(delay(200));
  }

  /**
   * อัปเดตสต็อกสินค้า
   */
  updateStock(id: string, quantity: number): Observable<Product> {
    return this.patch(id, { stock: quantity });
  }

  /**
   * ดึงสินค้าตามหมวดหมู่
   */
  getByCategory(category: string): Observable<Product[]> {
    const products = this.products.filter(p => p.category === category && p.isActive);
    return of([...products]).pipe(delay(200));
  }

  /**
   * ค้นหาสินค้า
   */
  search(query: string): Observable<Product[]> {
    const searchLower = query.toLowerCase();
    const results = this.products.filter(p =>
      (p.name.toLowerCase().includes(searchLower) ||
       p.sku.toLowerCase().includes(searchLower) ||
       p.description?.toLowerCase().includes(searchLower)) &&
      p.isActive
    );

    return of([...results]).pipe(delay(200));
  }

  /**
   * นับสินค้าตาม Stock Status
   */
  getStockStats(): Observable<{ inStock: number; lowStock: number; outOfStock: number }> {
    const stats = {
      inStock: 0,
      lowStock: 0,
      outOfStock: 0
    };

    this.products.forEach(p => {
      if (!p.isActive) return;

      const status = getStockStatus(p);
      if (status === StockStatus.IN_STOCK) stats.inStock++;
      else if (status === StockStatus.LOW_STOCK) stats.lowStock++;
      else if (status === StockStatus.OUT_OF_STOCK) stats.outOfStock++;
    });

    return of(stats).pipe(delay(100));
  }

  /**
   * รีเซ็ตข้อมูลกลับเป็น Mock Data เริ่มต้น
   */
  resetToMockData(): void {
    this.products = [...MOCK_PRODUCTS];
    this.nextId = 5;
    console.log('Reset to mock data:', this.products.length, 'products');
  }
}
