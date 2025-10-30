// services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';
import { ApiResponse } from '../shared/models/api-response.model';
import { environment } from '../../environments/environment';
import { MOCK_PRODUCTS } from '../shared/models/product.mock';

@Injectable({
  providedIn: 'root',
})
// export class ProductService {
//   private readonly apiUrl = `${environment.apiUrl}/products`;

//   constructor(private http: HttpClient) {}

//   getAll(): Observable<Product[]> {
//     return this.http
//       .get<ApiResponse<Product[]>>(this.apiUrl)
//       .pipe(map((res) => res.data || []));
//   }

//   getById(id: string): Observable<Product> {
//     return this.http
//       .get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
//       .pipe(map((res) => res.data!));
//   }

//   create(productDto: Partial<Product>): Observable<Product> {
//     return this.http
//       .post<ApiResponse<Product>>(this.apiUrl, productDto)
//       .pipe(map((res) => res.data!));
//   }

//   update(productDto: Product): Observable<Product> {
//     return this.http
//       .put<ApiResponse<Product>>(`${this.apiUrl}/${productDto.id}`, productDto)
//       .pipe(map((res) => res.data!));
//   }

//   delete(id: string): Observable<void> {
//     return this.http
//       .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
//       .pipe(map(() => void 0));
//   }

//   updateStock(id: string, quantity: number): Observable<Product> {
//     return this.http
//       .patch<ApiResponse<Product>>(`${this.apiUrl}/${id}/stock`, { quantity })
//       .pipe(map((res) => res.data!));
//   }
// }
export class ProductService {
  // 🔹 เก็บ mock data ใน memory (จำลองเป็น database)
  private mockProducts: Product[] = JSON.parse(JSON.stringify(MOCK_PRODUCTS)); // Deep clone

  // 🔹 จำลอง network delay (300ms)
  private readonly DELAY_MS = 300;

  constructor() {}

  getAll(): Observable<Product[]> {
    return of([...this.mockProducts]).pipe(delay(this.DELAY_MS));
  }

  getById(id: string): Observable<Product> {
    const product = this.mockProducts.find((p) => p.id === id);

    if (!product) {
      return throwError(() => new Error('Product not found')).pipe(
        delay(this.DELAY_MS)
      );
    }

    return of({ ...product }).pipe(delay(this.DELAY_MS));
  }

  create(productDto: Partial<Product>): Observable<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      name: productDto.name || '',
      sku: productDto.sku || '',
      category: productDto.category || '',
      price: productDto.price || 0,
      cost: productDto.cost || 0,
      stock: productDto.stock || 0,
      minStock: productDto.minStock || 0,
      unit: productDto.unit || '',
      description: productDto.description,
      isActive: productDto.isActive ?? true,
      imageUrl: productDto.imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mockProducts.push(newProduct);

    return of(newProduct).pipe(delay(this.DELAY_MS));
  }

  update(productDto: Product): Observable<Product> {
    const index = this.mockProducts.findIndex((p) => p.id === productDto.id);

    if (index === -1) {
      return throwError(() => new Error('Product not found')).pipe(
        delay(this.DELAY_MS)
      );
    }

    // อัพเดทข้อมูล
    const updatedProduct = {
      ...this.mockProducts[index],
      ...productDto,
      updatedAt: new Date(),
    };

    this.mockProducts[index] = updatedProduct;

    return of(updatedProduct).pipe(delay(this.DELAY_MS));
  }

  delete(id: string): Observable<void> {
    const index = this.mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return throwError(() => new Error('Product not found')).pipe(
        delay(this.DELAY_MS)
      );
    }

    this.mockProducts.splice(index, 1);

    return of(void 0).pipe(delay(this.DELAY_MS));
  }

  updateStock(id: string, quantity: number): Observable<Product> {
    const index = this.mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return throwError(() => new Error('Product not found')).pipe(
        delay(this.DELAY_MS)
      );
    }

    this.mockProducts[index].stock = quantity;
    this.mockProducts[index].updatedAt = new Date();

    return of({ ...this.mockProducts[index] }).pipe(delay(this.DELAY_MS));
  }

  // 🔹 Helper function สำหรับสร้าง ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
