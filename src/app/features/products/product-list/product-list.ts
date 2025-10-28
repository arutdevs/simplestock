import { Component, OnInit, signal, computed } from '@angular/core';
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
   * รายการสินค้าทั้งหมดจาก Service
   */
  allProducts = signal<Product[]>([]);

  /**
   * รายการสินค้าที่แสดงผล (หลัง filter)
   */
  products = signal<Product[]>([]);

  /**
   * รายการหมวดหมู่ทั้งหมด
   */
  categories = signal<Category[]>(MOCK_CATEGORIES.filter(c => c.isActive));

  /**
   * Loading state
   */
  isLoading = signal(false);

  /**
   * Filter states
   */
  searchTerm = signal('');
  selectedCategory = signal('');
  selectedStatus = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  /**
   * โหลดข้อมูลสินค้าจาก Service
   */
  loadProducts() {
    this.isLoading.set(true);

    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.products.set(products); // แสดงทั้งหมดตอนเริ่มต้น
        this.isLoading.set(false);
        console.log('Loaded products:', this.allProducts().length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
      }
    });
  }

  /**
   * Filter สินค้า - ทำที่ Component
   */
  filterProducts() {
    let filtered = [...this.allProducts()];

    // Filter by search term (name or SKU)
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (this.selectedCategory()) {
      filtered = filtered.filter(p => p.category === this.selectedCategory());
    }

    // Filter by status
    if (this.selectedStatus()) {
      filtered = filtered.filter(p => {
        if (this.selectedStatus() === 'active') return p.isActive;
        if (this.selectedStatus() === 'outofstock') return p.stock === 0;
        return true;
      });
    }

    this.products.set(filtered);
    console.log('Filtered:', this.products().length, 'products');
  }

  /**
   * บันทึกสินค้าใหม่
   */
  onSaveProduct(productData: ProductCreateDto) {
    console.log('บันทึกสินค้า:', productData);

    this.isLoading.set(true);

    this.productService.create(productData).subscribe({
      next: (newProduct) => {
        console.log('Created product:', newProduct);

        // โหลดข้อมูลใหม่
        this.loadProducts();

        alert(`บันทึกสินค้าสำเร็จ!\nชื่อ: ${newProduct.name}\nSKU: ${newProduct.sku}\nID: ${newProduct.id}`);
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.isLoading.set(false);
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
