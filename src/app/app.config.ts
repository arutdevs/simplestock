import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import {
  apiUrlInterceptor,
  authInterceptor,
  loadingInterceptor,
  errorInterceptor
} from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        apiUrlInterceptor,   // 1. เพิ่ม base URL ก่อน
        authInterceptor,     // 2. เพิ่ม auth token
        loadingInterceptor,  // 3. จัดการ loading state
        errorInterceptor     // 4. จัดการ errors (ต้องอยู่ท้ายสุด)
      ])
    )
  ]
};
