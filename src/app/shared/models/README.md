# Models - ระบบจัดการสินค้า

## 📁 โครงสร้าง Models

```
src/app/shared/models/
├── product.model.ts      # Product models และ interfaces
├── category.model.ts     # Category models
├── product.mock.ts       # ข้อมูลตัวอย่างสำหรับทดสอบ
├── index.ts             # Export ทุก model
└── README.md            # เอกสารนี้
```

## 🎯 การใช้งาน Models

### 1. Product Model

#### Interface หลัก
```typescript
import { Product, ProductCreateDto, ProductUpdateDto } from '@shared/models';

// Product - ใช้ทั้งการดึงข้อมูลและแสดงผล
interface Product {
  id: string;
  sku: string;              // รหัสสินค้า
  name: string;             // ชื่อสินค้า
  description?: string;     // รายละเอียด
  category: string;         // หมวดหมู่
  price: number;            // ราคาขาย
  cost?: number;            // ราคาทุน
  stock: number;            // จำนวนคงเหลือ
  minStock?: number;        // จำนวนขั้นต่ำ
  unit: string;             // หน่วยนับ
  imageUrl?: string;        // รูปภาพ
  barcode?: string;         // บาร์โค้ด
  isActive: boolean;        // สถานะใช้งาน
  createdAt: Date;          // วันที่สร้าง
  updatedAt: Date;          // วันที่แก้ไข
}
```

#### ตัวอย่างการใช้งาน

**สร้างสินค้าใหม่ (Create)**
```typescript
import { ProductCreateDto } from '@shared/models';

const newProduct: ProductCreateDto = {
  sku: 'LAP-001',
  name: 'โน้ตบุ๊ค Dell',
  category: 'อิเล็กทรอนิกส์',
  price: 18900,
  cost: 15000,
  stock: 15,
  minStock: 5,
  unit: 'ชิ้น',
  isActive: true
};

// ส่งไปยัง API
productService.create(newProduct).subscribe(result => {
  console.log('สร้างสินค้าสำเร็จ:', result);
});
```

**แสดงข้อมูลสินค้า (Read)**
```typescript
import { Product, getStockStatus } from '@shared/models';

// ดึงข้อมูลสินค้า
productService.getById('1').subscribe((product: Product) => {
  console.log(`ชื่อ: ${product.name}`);
  console.log(`ราคา: ${product.price} บาท`);
  console.log(`คงเหลือ: ${product.stock} ${product.unit}`);

  // ตรวจสอบสถานะสต็อก
  const status = getStockStatus(product);
  console.log(`สถานะ: ${status}`); // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
});
```

**แก้ไขสินค้า (Update)**
```typescript
import { ProductUpdateDto } from '@shared/models';

const updateData: ProductUpdateDto = {
  id: '1',
  price: 17900,  // เปลี่ยนราคา
  stock: 20      // เพิ่มสต็อก
};

productService.update(updateData).subscribe(result => {
  console.log('อัปเดตสำเร็จ:', result);
});
```

**ลบสินค้า (Delete)**
```typescript
productService.delete('1').subscribe(() => {
  console.log('ลบสินค้าสำเร็จ');
});

// หรือ Soft Delete (ปิดการใช้งาน)
const deactivate: ProductUpdateDto = {
  id: '1',
  isActive: false
};
productService.update(deactivate).subscribe(() => {
  console.log('ปิดการใช้งานสินค้า');
});
```

### 2. Stock Status & Enums

```typescript
import { StockStatus, ProductUnit } from '@shared/models';

// Stock Status Enum
enum StockStatus {
  IN_STOCK = 'IN_STOCK',      // มีสินค้า
  LOW_STOCK = 'LOW_STOCK',    // สินค้าใกล้หมด
  OUT_OF_STOCK = 'OUT_OF_STOCK' // สินค้าหมด
}

// Product Unit Enum
enum ProductUnit {
  PIECE = 'ชิ้น',
  BOX = 'กล่อง',
  PACK = 'แพ็ค',
  KG = 'กิโลกรัม',
  LITER = 'ลิตร',
  METER = 'เมตร',
  SET = 'เซ็ต'
}
```

### 3. Helper Functions

```typescript
import {
  getStockStatus,
  calculateProfit,
  calculateStockValue
} from '@shared/models';

// ตรวจสอบสถานะสต็อก
const status = getStockStatus(product);

// คำนวณกำไรต่อหน่วย
const profit = calculateProfit(product); // price - cost

// คำนวณมูลค่าสต็อกทั้งหมด
const value = calculateStockValue(product); // stock * price
```

### 4. การกรองและค้นหา

```typescript
import { ProductFilter } from '@shared/models';

const filter: ProductFilter = {
  search: 'โน้ตบุ๊ค',           // ค้นหาจากชื่อ, SKU, บาร์โค้ด
  category: 'อิเล็กทรอนิกส์',  // กรองตามหมวดหมู่
  stockStatus: StockStatus.LOW_STOCK, // เฉพาะสินค้าใกล้หมด
  minPrice: 1000,               // ราคาขั้นต่ำ
  maxPrice: 20000,              // ราคาสูงสุด
  isActive: true,               // เฉพาะสินค้าที่ใช้งาน
  page: 1,                      // หน้าที่ 1
  pageSize: 20,                 // แสดง 20 รายการ
  sortBy: 'name',               // เรียงตามชื่อ
  sortOrder: 'asc'              // จากน้อยไปมาก
};

productService.getAll(filter).subscribe(response => {
  console.log(`พบ ${response.total} รายการ`);
  console.log(`หน้า ${response.page}/${response.totalPages}`);
  response.products.forEach(p => console.log(p.name));
});
```

### 5. Category Model

```typescript
import { Category, CategoryCreateDto } from '@shared/models';

// สร้างหมวดหมู่ใหม่
const newCategory: CategoryCreateDto = {
  name: 'อิเล็กทรอนิกส์',
  description: 'สินค้าอิเล็กทรอนิกส์ทุกชนิด',
  icon: 'fa-laptop',
  color: '#6366F1',
  isActive: true
};

categoryService.create(newCategory).subscribe(result => {
  console.log('สร้างหมวดหมู่สำเร็จ:', result);
});
```

## 🧪 ข้อมูลตัวอย่าง (Mock Data)

```typescript
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  getStatsSummary
} from '@shared/models/product.mock';

// ใช้ข้อมูลตัวอย่าง
console.log('สินค้าทั้งหมด:', MOCK_PRODUCTS);
console.log('หมวดหมู่:', MOCK_CATEGORIES);

// ดูสถิติรวม
const stats = getStatsSummary();
console.log(`สินค้าทั้งหมด: ${stats.totalProducts} รายการ`);
console.log(`สินค้าใกล้หมด: ${stats.lowStockCount} รายการ`);
console.log(`สินค้าหมด: ${stats.outOfStockCount} รายการ`);
console.log(`มูลค่ารวม: ${stats.totalValue.toLocaleString()} บาท`);
```

## 📊 ตัวอย่างการใช้งานใน Component

```typescript
import { Component, OnInit } from '@angular/core';
import {
  Product,
  ProductCreateDto,
  StockStatus,
  getStockStatus
} from '@shared/models';

export class ProductListComponent implements OnInit {
  products: Product[] = [];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(response => {
      this.products = response.products;
    });
  }

  addProduct() {
    const newProduct: ProductCreateDto = {
      sku: 'NEW-001',
      name: 'สินค้าใหม่',
      category: 'ทั่วไป',
      price: 100,
      stock: 50,
      unit: 'ชิ้น'
    };

    this.productService.create(newProduct).subscribe(() => {
      this.loadProducts(); // โหลดข้อมูลใหม่
    });
  }

  updateStock(productId: string, newStock: number) {
    this.productService.update({
      id: productId,
      stock: newStock
    }).subscribe(() => {
      this.loadProducts();
    });
  }

  deleteProduct(productId: string) {
    if (confirm('ต้องการลบสินค้านี้?')) {
      this.productService.delete(productId).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  getStockBadgeClass(product: Product): string {
    const status = getStockStatus(product);
    switch (status) {
      case StockStatus.IN_STOCK: return 'badge-stock-in';
      case StockStatus.LOW_STOCK: return 'badge-stock-low';
      case StockStatus.OUT_OF_STOCK: return 'badge-stock-out';
      default: return '';
    }
  }
}
```

## 🎨 การแสดงผลใน Template

```html
<!-- แสดงรายการสินค้า -->
<div *ngFor="let product of products">
  <h3>{{ product.name }}</h3>
  <p>SKU: {{ product.sku }}</p>
  <p>ราคา: {{ product.price | currency:'THB' }}</p>
  <p>คงเหลือ: {{ product.stock }} {{ product.unit }}</p>

  <!-- แสดง badge สถานะ -->
  <span [class]="'badge ' + getStockBadgeClass(product)">
    {{ getStockStatus(product) }}
  </span>

  <!-- ปุ่มจัดการ -->
  <button (click)="updateStock(product.id, product.stock + 1)">
    เพิ่มสต็อก
  </button>
  <button (click)="deleteProduct(product.id)">
    ลบ
  </button>
</div>
```

## ✅ Best Practices

1. **ใช้ DTO สำหรับ Create/Update** - แยก interface สำหรับการสร้างและแก้ไข
2. **Validation** - ตรวจสอบข้อมูลก่อนส่งไปยัง API
3. **Type Safety** - ใช้ TypeScript interfaces เพื่อป้องกันข้อผิดพลาด
4. **Helper Functions** - ใช้ฟังก์ชันช่วยเหลือสำหรับการคำนวณ
5. **Mock Data** - ใช้ข้อมูลตัวอย่างสำหรับการทดสอบ

## 🔗 Related Files

- Service: `src/app/core/services/product.service.ts`
- Component: `src/app/features/products/product-list/`
- Styles: `src/styles/_variables.scss`
