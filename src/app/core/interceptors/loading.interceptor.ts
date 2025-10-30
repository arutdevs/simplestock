/**
 * Loading Interceptor
 * จัดการ loading state สำหรับ HTTP requests
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingInterceptorService } from '../services/loading-interceptor-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingInterceptorService);

  // เพิ่ม request counter
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // ลด request counter เมื่อ request เสร็จ (สำเร็จหรือ error)
      loadingService.hide();
    })
  );
};
