import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../shared/models/product.model';
import { ApiResponse } from '../shared/models/api-response.model';
import { MOCK_PRODUCTS } from '../shared/models/product.mock';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private mockProducts: Product[] = JSON.parse(JSON.stringify(MOCK_PRODUCTS));
  private readonly DELAY_MS = 300;

  getAll(): Observable<ApiResponse<Product[]>> {
    if (environment.useMockData) {
      const response: ApiResponse<Product[]> = {
        success: true,
        message: 'Products retrieved successfully',
        data: [...this.mockProducts],
        statusCode: 200,
        timestamp: new Date().toISOString(),
      };
      return of(response).pipe(delay(this.DELAY_MS));
    }

    return this.http
      .get<ApiResponse<Product[]>>('/products', { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  getById(id: string): Observable<ApiResponse<Product>> {
    if (environment.useMockData) {
      const product = this.mockProducts.find((p) => p.id === id);

      if (!product) {
        const errorResponse: ApiResponse<Product> = {
          success: false,
          message: 'Product not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return throwError(() => errorResponse).pipe(delay(this.DELAY_MS));
      }

      const response: ApiResponse<Product> = {
        success: true,
        message: 'Product retrieved successfully',
        data: { ...product },
        statusCode: 200,
        timestamp: new Date().toISOString(),
      };
      return of(response).pipe(delay(this.DELAY_MS));
    }

    return this.http
      .get<ApiResponse<Product>>(`/products/${id}`, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  /**
   * ✅ Create - รับ Product (ไม่มี id, createdAt, updatedAt)
   * Service generate ให้เอง
   */
  create(product: Product): Observable<ApiResponse<Product>> {
    if (environment.useMockData) {
      // ✅ Generate ตรงๆ เลย
      const newProduct: Product = {
        ...product,
        id: this.generateId(), // ← Generate id
        createdAt: new Date(), // ← Generate createdAt
        updatedAt: new Date(), // ← Generate updatedAt
      };

      this.mockProducts.push(newProduct);

      const response: ApiResponse<Product> = {
        success: true,
        message: 'Product created successfully',
        data: newProduct,
        statusCode: 201,
        timestamp: new Date().toISOString(),
      };
      return of(response).pipe(delay(this.DELAY_MS));
    }

    return this.http
      .post<ApiResponse<Product>>('/products', product, {
        observe: 'response',
      })
      .pipe(map((res) => res.body!));
  }

  /**
   * ✅ Update - รับ Product (มี id)
   * Service update updatedAt ให้เอง
   */
  update(product: Product): Observable<ApiResponse<Product>> {
    if (environment.useMockData) {
      const index = this.mockProducts.findIndex((p) => p.id === product.id);

      if (index === -1) {
        const errorResponse: ApiResponse<Product> = {
          success: false,
          message: 'Product not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return throwError(() => errorResponse).pipe(delay(this.DELAY_MS));
      }

      // ✅ Update updatedAt ใหม่
      const updatedProduct: Product = {
        ...product,
        updatedAt: new Date(), // ← Update timestamp
      };
      this.mockProducts[index] = updatedProduct;

      const response: ApiResponse<Product> = {
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct,
        statusCode: 200,
        timestamp: new Date().toISOString(),
      };
      return of(response).pipe(delay(this.DELAY_MS));
    }

    return this.http
      .put<ApiResponse<Product>>(`/products/${product.id}`, product, {
        observe: 'response',
      })
      .pipe(map((res) => res.body!));
  }

  delete(id: string): Observable<ApiResponse<void>> {
    if (environment.useMockData) {
      const index = this.mockProducts.findIndex((p) => p.id === id);

      if (index === -1) {
        const errorResponse: ApiResponse<void> = {
          success: false,
          message: 'Product not found',
          statusCode: 404,
          timestamp: new Date().toISOString(),
        };
        return throwError(() => errorResponse).pipe(delay(this.DELAY_MS));
      }

      this.mockProducts.splice(index, 1);

      const response: ApiResponse<void> = {
        success: true,
        message: 'Product deleted successfully',
        statusCode: 200,
        timestamp: new Date().toISOString(),
      };
      return of(response).pipe(delay(this.DELAY_MS));
    }

    return this.http
      .delete<ApiResponse<void>>(`/products/${id}`, { observe: 'response' })
      .pipe(map((res) => res.body!));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
