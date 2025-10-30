import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category } from '../shared/models/category.model';
import { ApiResponse } from '../shared/models/api-response.model';
import { MOCK_CATEGORIES } from '../shared/models/product.mock';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private mockCategories: Category[] = JSON.parse(
    JSON.stringify(MOCK_CATEGORIES)
  );
  private readonly DELAY_MS = 300;

  getAll(): Observable<ApiResponse<Category[]>> {
    if (environment.useMockData) {
      // ✅ Wrap ใน ApiResponse format เหมือน Real API
      const response: ApiResponse<Category[]> = {
        data: this.mockCategories,
        message: 'successfully',
        success: true,
        statusCode: 200,
      };
      return of(response).pipe(delay(this.DELAY_MS));
    }

    // ✅ Real API - ไม่ต้อง map, return ApiResponse ตรงๆ
    return this.http
      .get<ApiResponse<Category[]>>('/categories', { observe: 'response' })
      .pipe(map((res: HttpResponse<ApiResponse<Category[]>>) => res.body!));
  }
}
