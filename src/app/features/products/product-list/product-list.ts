import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/layout/header/header';
import { ProductFormModalComponent } from '../components/product-form/product-form-modal.component';
import { Product, ProductCreateDto, Category, MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../../shared/models';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, Header, ProductFormModalComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  /**
   * รายการสินค้าทั้งหมด
   * เริ่มต้นด้วย Mock Data 4 รายการ
   */
  products: Product[] = [...MOCK_PRODUCTS];

  /**
   * รายการหมวดหมู่ทั้งหมด
   */
  categories: Category[] = MOCK_CATEGORIES.filter(c => c.isActive);

  /**
   * บันทึกสินค้าใหม่
   */
  onSaveProduct(productData: ProductCreateDto) {
    console.log('บันทึกสินค้า:', productData);

    // สร้าง Product object ใหม่
    const newProduct: Product = {
      id: this.generateProductId(),
      sku: productData.sku,
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: productData.price,
      cost: productData.cost,
      stock: productData.stock,
      minStock: productData.minStock,
      unit: productData.unit,
      imageUrl: productData.imageUrl,
      isActive: productData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // เพิ่มสินค้าเข้า array
    this.products.unshift(newProduct); // เพิ่มไว้ด้านบน

    console.log('สินค้าทั้งหมด:', this.products);
    alert(`บันทึกสินค้าสำเร็จ!\nชื่อ: ${newProduct.name}\nSKU: ${newProduct.sku}\nจำนวนสินค้าทั้งหมด: ${this.products.length}`);
  }

  /**
   * ยกเลิกการเพิ่ม/แก้ไขสินค้า
   */
  onCancelProduct() {
    console.log('ยกเลิกการเพิ่มสินค้า');
  }

  /**
   * สร้าง ID สินค้าแบบ unique
   * Format: prod-XXX
   */
  private generateProductId(): string {
    const existingIds = this.products.map(p => p.id);
    let nextNumber = this.products.length + 1;
    let newId = `prod-${String(nextNumber).padStart(3, '0')}`;

    // ตรวจสอบว่า ID ซ้ำหรือไม่
    while (existingIds.includes(newId)) {
      nextNumber++;
      newId = `prod-${String(nextNumber).padStart(3, '0')}`;
    }

    return newId;
  }
}
