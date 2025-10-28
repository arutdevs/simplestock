import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../shared/layout/header/header';
import { ProductFormModalComponent } from '../components/product-form/product-form-modal.component';
import { Product, ProductCreateDto, Category, MOCK_CATEGORIES } from '../../../shared/models';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, Header, ProductFormModalComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  /**
   * รายการสินค้าทั้งหมด
   */
  products: Product[] = [];

  /**
   * รายการหมวดหมู่ทั้งหมด
   */
  categories: Category[] = MOCK_CATEGORIES.filter(c => c.isActive);

  /**
   * Loading state
   */
  isLoading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  /**
   * โหลดข้อมูลสินค้าจาก Service
   */
  loadProducts() {
    this.isLoading = true;

    this.productService.getAll().subscribe({
      next: (response) => {
        this.products = response.products;
        this.isLoading = false;
        console.log('Loaded products:', this.products.length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
      }
    });
  }

  /**
   * บันทึกสินค้าใหม่
   */
  onSaveProduct(productData: ProductCreateDto) {
    console.log('บันทึกสินค้า:', productData);

    this.isLoading = true;

    this.productService.create(productData).subscribe({
      next: (newProduct) => {
        console.log('Created product:', newProduct);

        // โหลดข้อมูลใหม่
        this.loadProducts();

        alert(`บันทึกสินค้าสำเร็จ!\nชื่อ: ${newProduct.name}\nSKU: ${newProduct.sku}\nID: ${newProduct.id}`);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.isLoading = false;
        alert('เกิดข้อผิดพลาดในการบันทึกสินค้า');
      }
    });
  }

  /**
   * ยกเลิกการเพิ่ม/แก้ไขสินค้า
   */
  onCancelProduct() {
    console.log('ยกเลิกการเพิ่มสินค้า');
  }
}
