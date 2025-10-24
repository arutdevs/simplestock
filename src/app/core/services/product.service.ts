/**
 * Product Service
 * ตัวอย่าง Service สำหรับจัดการ API ของสินค้า
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Product,
  ProductCreateDto,
  ProductUpdateDto,
  ProductListResponse,
  ProductFilter
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly endpoint = '/products'; // จะถูกรวมกับ base URL จาก interceptor

  constructor(private http: HttpClient) {}

  /**
   * ดึงสินค้าทั้งหมด (รองรับ pagination และ filter)
   */
  getAll(filter?: ProductFilter): Observable<ProductListResponse> {
    let params = new HttpParams();

    if (filter) {
      if (filter.search) params = params.set('search', filter.search);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.stockStatus) params = params.set('stockStatus', filter.stockStatus);
      if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
      if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
      if (filter.isActive !== undefined) params = params.set('isActive', filter.isActive.toString());
      if (filter.page) params = params.set('page', filter.page.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortOrder) params = params.set('sortOrder', filter.sortOrder);
    }

    return this.http.get<ProductListResponse>(this.endpoint, { params });
  }

  /**
   * ดึงสินค้าตาม ID
   */
  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${id}`);
  }

  /**
   * สร้างสินค้าใหม่
   */
  create(product: ProductCreateDto): Observable<Product> {
    return this.http.post<Product>(this.endpoint, product);
  }

  /**
   * อัปเดตสินค้า
   */
  update(product: ProductUpdateDto): Observable<Product> {
    return this.http.put<Product>(`${this.endpoint}/${product.id}`, product);
  }

  /**
   * อัปเดตบางส่วนของสินค้า (Partial Update)
   */
  patch(id: string, updates: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.endpoint}/${id}`, updates);
  }

  /**
   * ลบสินค้า
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * อัปเดตสต็อกสินค้า
   */
  updateStock(id: string, quantity: number): Observable<Product> {
    return this.http.patch<Product>(`${this.endpoint}/${id}/stock`, { stock: quantity });
  }

  /**
   * ดึงสินค้าตามหมวดหมู่
   */
  getByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.endpoint}/category/${category}`);
  }

  /**
   * ค้นหาสินค้า
   */
  search(query: string): Observable<Product[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Product[]>(`${this.endpoint}/search`, { params });
  }

  /**
   * Export สินค้าเป็น CSV
   */
  exportCsv(filter?: ProductFilter): Observable<Blob> {
    let params = new HttpParams();
    if (filter) {
      // เพิ่ม filter params
    }
    return this.http.get(`${this.endpoint}/export/csv`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Import สินค้าจากไฟล์
   */
  import(file: File): Observable<{ success: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: number; failed: number; errors: string[] }>(
      `${this.endpoint}/import`,
      formData
    );
  }
}
