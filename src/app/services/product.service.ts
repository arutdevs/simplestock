// services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';
import { ApiResponse } from '../shared/models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(map((res) => res.data || []));
  }

  getById(id: string): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }

  create(productDto: Partial<Product>): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.apiUrl, productDto)
      .pipe(map((res) => res.data!));
  }

  update(productDto: Product): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.apiUrl}/${productDto.id}`, productDto)
      .pipe(map((res) => res.data!));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }

  updateStock(id: string, quantity: number): Observable<Product> {
    return this.http
      .patch<ApiResponse<Product>>(`${this.apiUrl}/${id}/stock`, { quantity })
      .pipe(map((res) => res.data!));
  }
}
