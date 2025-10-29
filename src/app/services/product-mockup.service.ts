// product-mock.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';
import { MOCK_PRODUCTS } from '../shared/models/product.mock';

@Injectable({
  providedIn: 'root',
})
export class ProductMockService {
  private products: Product[] = [...MOCK_PRODUCTS];
  private nextId = 5;

  getAll(): Observable<Product[]> {
    return of([...this.products]).pipe(delay(300));
  }

  getById(id: string): Observable<Product> {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }
    return of({ ...product }).pipe(delay(200));
  }

  create(productDto: Partial<Product>): Observable<Product> {
    const newProduct: Product = {
      ...productDto,
      id: `prod-${String(this.nextId++).padStart(3, '0')}`,
      isActive: productDto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.unshift(newProduct);
    return of({ ...newProduct }).pipe(delay(300));
  }

  update(productDto: Product): Observable<Product> {
    const index = this.products.findIndex((p) => p.id === productDto.id);
    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${productDto.id}`));
    }

    const updatedProduct: Product = {
      ...this.products[index],
      ...productDto,
      updatedAt: new Date(),
    };
    this.products[index] = updatedProduct;
    return of({ ...updatedProduct }).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }
    this.products[index].isActive = false;
    return of(void 0).pipe(delay(200));
  }

  updateStock(id: string, quantity: number): Observable<Product> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error(`ไม่พบสินค้า ID: ${id}`));
    }
    this.products[index].stock = quantity;
    this.products[index].updatedAt = new Date();
    return of({ ...this.products[index] }).pipe(delay(200));
  }
}
