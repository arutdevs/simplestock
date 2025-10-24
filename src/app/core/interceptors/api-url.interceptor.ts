/**
 * API URL Interceptor
 * เพิ่ม base URL และ common headers ให้กับทุก request
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  // เช็คว่า request เป็น API request หรือไม่ (ไม่ใช่ full URL)
  const isApiRequest = !req.url.startsWith('http');

  if (isApiRequest) {
    // เพิ่ม base URL และ common headers
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-App-Version': '1.0.0'
      }
    });
    return next(apiReq);
  }

  // ถ้าเป็น full URL (เช่น external API) ให้ส่งตามปกติ
  return next(req);
};
