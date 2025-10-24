/**
 * Auth Interceptor
 * เพิ่ม Authorization token ในทุก HTTP request
 */

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // ดึง token จาก localStorage
  const token = localStorage.getItem('auth_token');

  // ถ้ามี token ให้เพิ่ม Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // ถ้าไม่มี token ให้ส่ง request ตามปกติ
  return next(req);
};
