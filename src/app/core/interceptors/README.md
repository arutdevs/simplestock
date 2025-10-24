# HTTP Interceptors - คู่มือการใช้งาน

## 📁 โครงสร้าง Interceptors

```
src/app/core/
├── interceptors/
│   ├── api-url.interceptor.ts    # จัดการ base URL
│   ├── auth.interceptor.ts       # จัดการ authentication
│   ├── loading.interceptor.ts    # จัดการ loading state
│   ├── error.interceptor.ts      # จัดการ errors
│   ├── index.ts                  # Export interceptors
│   └── README.md                 # เอกสารนี้
├── services/
│   ├── loading.service.ts        # Loading state service
│   ├── error-handler.service.ts  # Error handler service
│   └── product.service.ts        # ตัวอย่าง API service
```

## 🎯 Interceptors แต่ละตัว

### 1. API URL Interceptor
**หน้าที่:** เพิ่ม base URL และ common headers

```typescript
// Before
http.get('/products')

// After (ผ่าน interceptor)
http.get('http://localhost:3000/api/products')
// Headers:
// - Content-Type: application/json
// - Accept: application/json
// - X-App-Version: 1.0.0
```

**การตั้งค่า Base URL:**
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

---

### 2. Auth Interceptor
**หน้าที่:** เพิ่ม Authorization token ในทุก request

```typescript
// Before
http.get('/products')

// After (ผ่าน interceptor)
http.get('/products', {
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

**วิธีใช้งาน:**
```typescript
// เก็บ token หลังจาก login
localStorage.setItem('auth_token', 'your-token-here');

// Interceptor จะเพิ่ม token อัตโนมัติในทุก request
this.productService.getAll().subscribe();

// ลบ token เมื่อ logout
localStorage.removeItem('auth_token');
```

---

### 3. Loading Interceptor
**หน้าที่:** จัดการ loading state อัตโนมัติ

```typescript
// Component
export class ProductListComponent {
  isLoading$ = this.loadingService.loading$;

  constructor(
    private productService: ProductService,
    private loadingService: LoadingService
  ) {}

  loadProducts() {
    // Interceptor จะ show/hide loading อัตโนมัติ
    this.productService.getAll().subscribe();
  }
}
```

```html
<!-- Template -->
<div *ngIf="isLoading$ | async" class="loading-spinner">
  <i class="fas fa-spinner fa-spin"></i> กำลังโหลด...
</div>
```

**Request Counter:**
- เริ่ม request: counter++ → show loading
- เสร็จ request: counter-- → ถ้า counter = 0 ซ่อน loading
- รองรับหลาย requests พร้อมกัน

---

### 4. Error Interceptor
**หน้าที่:** จัดการ HTTP errors แบบรวมศูนย์

**Error Handling:**
```typescript
// HTTP Status → Thai Message
400 → 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
401 → 'กรุณาเข้าสู่ระบบใหม่' + redirect to login
403 → 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้'
404 → 'ไม่พบข้อมูลที่ต้องการ'
500 → 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์'
503 → 'ระบบไม่พร้อมใช้งานขณะนี้'
```

**การใช้งานใน Component:**
```typescript
this.productService.create(newProduct).subscribe({
  next: (product) => {
    console.log('สร้างสินค้าสำเร็จ', product);
  },
  error: (error) => {
    // Error message จาก interceptor (ภาษาไทย)
    console.error(error.message);
  }
});
```

---

## 🚀 การใช้งาน API Service

### ตัวอย่าง: Product Service

```typescript
import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';
import { Product, ProductCreateDto } from '@shared/models';

export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  // ดึงสินค้าทั้งหมด
  loadProducts() {
    this.productService.getAll({
      page: 1,
      pageSize: 20,
      sortBy: 'name',
      sortOrder: 'asc'
    }).subscribe({
      next: (response) => {
        this.products = response.products;
        console.log(`พบ ${response.total} รายการ`);
      },
      error: (err) => console.error(err)
    });
  }

  // ค้นหาสินค้า
  searchProducts(query: string) {
    this.productService.search(query).subscribe({
      next: (products) => {
        this.products = products;
      }
    });
  }

  // สร้างสินค้าใหม่
  createProduct() {
    const newProduct: ProductCreateDto = {
      sku: 'LAP-001',
      name: 'โน้ตบุ๊ค Dell',
      category: 'อิเล็กทรอนิกส์',
      price: 18900,
      stock: 15,
      unit: 'ชิ้น'
    };

    this.productService.create(newProduct).subscribe({
      next: (product) => {
        console.log('สร้างสำเร็จ:', product);
        this.loadProducts();
      },
      error: (err) => {
        // Error message จาก error interceptor
        console.error('สร้างไม่สำเร็จ:', err.message);
      }
    });
  }

  // อัปเดตสินค้า
  updateProduct(id: string) {
    this.productService.update({
      id,
      price: 17900,
      stock: 20
    }).subscribe({
      next: () => {
        console.log('อัปเดตสำเร็จ');
        this.loadProducts();
      }
    });
  }

  // ลบสินค้า
  deleteProduct(id: string) {
    if (confirm('ต้องการลบสินค้านี้?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          console.log('ลบสำเร็จ');
          this.loadProducts();
        }
      });
    }
  }
}
```

---

## 📊 Loading State Component

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  template: `
    <div *ngIf="isLoading$ | async" class="global-loading">
      <div class="spinner"></div>
      <p>กำลังโหลดข้อมูล...</p>
    </div>
    <router-outlet />
  `,
  styles: [`
    .global-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #6366f1;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class AppComponent {
  isLoading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
```

---

## 🔧 การตั้งค่า Environment

### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  enableLogging: true
};
```

### Production (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com/api',
  apiTimeout: 30000,
  enableLogging: false
};
```

---

## ✅ ลำดับการทำงานของ Interceptors

```
1. Request ออก
   ↓
2. API URL Interceptor → เพิ่ม base URL + headers
   ↓
3. Auth Interceptor → เพิ่ม Authorization token
   ↓
4. Loading Interceptor → show loading
   ↓
5. ส่ง request ไปยัง server
   ↓
6. รับ response กลับมา
   ↓
7. Error Interceptor → ตรวจสอบ errors
   ↓
8. Loading Interceptor → hide loading
   ↓
9. Response ถึง component
```

---

## 🎨 Best Practices

1. **ใช้ TypeScript Interfaces** - ใช้ models จาก `@shared/models`
2. **Handle Errors** - ใช้ error callback ใน subscribe
3. **Loading State** - แสดง loading indicator
4. **Unsubscribe** - ใช้ `AsyncPipe` หรือ unsubscribe ใน `ngOnDestroy`
5. **Error Messages** - แสดง error messages ให้ user เข้าใจ

---

## 🧪 การทดสอบ

```typescript
// ทดสอบ API ใน component
ngOnInit() {
  console.log('Testing API...');

  this.productService.getAll().subscribe({
    next: (response) => {
      console.log('✅ API Success:', response);
    },
    error: (error) => {
      console.error('❌ API Error:', error.message);
    }
  });
}
```

---

## 📚 Related Files

- Models: `src/app/shared/models/`
- Services: `src/app/core/services/`
- Environment: `src/environments/`
- App Config: `src/app/app.config.ts`
