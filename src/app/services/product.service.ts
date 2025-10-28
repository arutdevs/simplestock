/**
 * Product Service
 * จัดการ CRUD operations สำหรับสินค้า
 * Service เรียบง่าย - แค่เรียก API และส่ง data กลับ
 * Filter/Search/Sort ทำที่ Component
 */

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  MOCK_PRODUCTS
} from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // In-memory data store (จำลอง Database)
  private products: Product[] = [...MOCK_PRODUCTS];
  private nextId = 5;

  constructor() {
    console.log('ProductService initialized with', this.products.length, 'products');
  }

  /**
   * ดึงสินค้าทั้งหมด - ส่งกลับทั้งหมดให้ Component ไป filter เอง
   */
  getAll(): Observable<Product[]> {
    // จำลอง API delay
    return of([...this.products]).pipe(delay(300));
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

    this.products.unshift(newProduct);
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
    console.log('Updated product:', updatedProduct.id);

    return of({ ...updatedProduct }).pipe(delay(300));
  }

  /**
   * อัปเดตบางส่วน
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
    console.log('Patched product:', id);

    return of({ ...patchedProduct }).pipe(delay(200));
  }

  /**
   * ลบสินค้า (Soft delete)
   */
  delete(id: string): Observable<void> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }

    this.products[index].isActive = false;
    this.products[index].updatedAt = new Date();
    console.log('Deleted (soft) product:', id);

    return of(void 0).pipe(delay(200));
  }

  /**
   * ลบถาวร
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
   * อัปเดตสต็อก
   */
  updateStock(id: string, quantity: number): Observable<Product> {
    return this.patch(id, { stock: quantity });
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
