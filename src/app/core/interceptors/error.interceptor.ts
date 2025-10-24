/**
 * Error Interceptor
 * จัดการ HTTP errors แบบรวมศูนย์
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
            break;
          case 401:
            errorMessage = 'กรุณาเข้าสู่ระบบใหม่';
            // Redirect to login
            localStorage.removeItem('auth_token');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้';
            break;
          case 404:
            errorMessage = 'ไม่พบข้อมูลที่ต้องการ';
            break;
          case 500:
            errorMessage = 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์';
            break;
          case 503:
            errorMessage = 'ระบบไม่พร้อมใช้งานขณะนี้ กรุณาลองใหม่อีกครั้ง';
            break;
          default:
            errorMessage = `เกิดข้อผิดพลาด: ${error.status} - ${error.message}`;
        }
      }

      // แสดง error message (สามารถใช้ toast/snackbar service แทน console.error)
      console.error('HTTP Error:', errorMessage);

      // สามารถ inject ErrorHandlerService เพื่อแสดง toast/notification
      // const errorHandler = inject(ErrorHandlerService);
      // errorHandler.showError(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
