// product-list.component.ts
import {
  Component,
  OnInit,
  signal,
  computed,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/layout/header/header';
import { ProductFormModalComponent } from '../components/product-form/product-form-modal.component';
import { Product } from '../../../shared/models/product.model';
import { Category } from '../../../shared/models/category.model';
import { MOCK_CATEGORIES } from '../../../shared/models/product.mock';
import { SweetAlertService } from '../../../shared/services/alert-config.service';
import { ProductService } from '../../../services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  modalService = inject(NgbModal);
  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>(MOCK_CATEGORIES.filter((c) => c.isActive));
  isLoading = signal(false);
  searchTerm = signal('');
  selectedCategory = signal('');
  selectedStatus = signal('');

  products = computed(() => {
    let filtered = [...this.allProducts()];

    const search = this.searchTerm().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory()) {
      filtered = filtered.filter((p) => p.category === this.selectedCategory());
    }

    const status = this.selectedStatus();
    if (status === 'active') {
      filtered = filtered.filter((p) => p.isActive && p.stock > 0);
    } else if (status === 'outofstock') {
      filtered = filtered.filter((p) => p.stock === 0);
    }

    return filtered;
  });

  private productService = inject(ProductService);
  private sweetAlert = inject(SweetAlertService);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);

    this.productService.getAll().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.sweetAlert.showError(
          'เกิดข้อผิดพลาด',
          'ไม่สามารถโหลดข้อมูลสินค้าได้'
        );
      },
    });
  }

  // product-list.component.ts

  onEditProduct(id: string) {
    this.sweetAlert.showLoading('กำลังโหลดข้อมูลสินค้า...');

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.sweetAlert.close();

        const modalRef = this.modalService.open(ProductFormModalComponent, {
          size: 'lg',
          centered: true,
          backdrop: 'static', // ✅ ป้องกันปิดโดยคลิกข้างนอก
          keyboard: false, // ✅ ป้องกันปิดด้วย ESC
        });

        modalRef.componentInstance.productDetail = product;

        modalRef.result
          .then((result: Partial<Product>) => {
            // ✅ เพิ่มโค้ดตรงนี้
            console.log('✅ รับข้อมูลกลับจาก Modal:', result);
            this.handleSaveProduct(result);
          })
          .catch((reason) => {
            console.log('❌ Modal dismissed:', reason);
          });
      },
      error: (error) => {
        this.sweetAlert.close();
        this.sweetAlert.showError(
          'เกิดข้อผิดพลาด',
          'ไม่สามารถโหลดข้อมูลสินค้าได้'
        );
      },
    });
  }

  // ✅ สร้าง method สำหรับ save (ใช้ร่วมกันได้ทั้ง Edit และ Create)
  private handleSaveProduct(productData: Partial<Product>) {
    this.sweetAlert.showLoading('กำลังบันทึกสินค้า...');

    // เช็คว่าเป็น Edit หรือ Create
    if ('id' in productData && productData.id) {
      // ✅ Edit Mode - มี id
      this.productService.update(productData as Product).subscribe({
        next: (updatedProduct) => {
          this.sweetAlert.close();
          this.loadProducts(); // โหลดรายการใหม่
          this.sweetAlert.showSuccess(
            'แก้ไขสินค้าสำเร็จ!',
            `${updatedProduct.name} (SKU: ${updatedProduct.sku})`
          );
        },
        error: (error) => {
          this.sweetAlert.showError(
            'เกิดข้อผิดพลาด',
            'ไม่สามารถแก้ไขสินค้าได้'
          );
          console.error('Error updating product:', error);
        },
      });
    } else {
      // ✅ Create Mode - ไม่มี id
      this.productService.create(productData).subscribe({
        next: (newProduct) => {
          this.sweetAlert.close();
          this.loadProducts(); // โหลดรายการใหม่
          this.sweetAlert.showSuccess(
            'บันทึกสินค้าสำเร็จ!',
            `${newProduct.name} (SKU: ${newProduct.sku})`
          );
        },
        error: (error) => {
          this.sweetAlert.showError(
            'เกิดข้อผิดพลาด',
            'ไม่สามารถบันทึกสินค้าได้'
          );
          console.error('Error creating product:', error);
        },
      });
    }
  }
  // product-list.component.ts

  async onDeleteProduct(id: string) {
    // ✅ ยืนยันก่อนลบ
    const result = await this.sweetAlert.showConfirm({
      title: 'ยืนยันการลบสินค้า?',
      text: 'คุณต้องการลบสินค้านี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้',
      icon: 'warning',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      this.sweetAlert.showLoading('กำลังลบสินค้า...');

      this.productService.delete(id).subscribe({
        next: () => {
          this.sweetAlert.close();
          this.loadProducts(); // โหลดรายการใหม่
          this.sweetAlert.showSuccess(
            'ลบสินค้าสำเร็จ!',
            'สินค้าถูกลบออกจากระบบแล้ว'
          );
        },
        error: (error) => {
          this.sweetAlert.showError('เกิดข้อผิดพลาด', 'ไม่สามารถลบสินค้าได้');
          console.error('Error deleting product:', error);
        },
      });
    }
  }
  onAddProduct() {
    const modalRef = this.modalService.open(ProductFormModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    // ไม่ต้องส่ง productDetail (Create Mode)

    modalRef.result
      .then((result: Partial<Product>) => {
        console.log('✅ รับข้อมูลกลับจาก Modal:', result);
        this.handleSaveProduct(result); // ✅ ใช้ method เดียวกัน
      })
      .catch((reason) => {
        console.log('❌ Modal dismissed:', reason);
      });
  }

  onSaveProduct(productData: Partial<Product>) {
    this.sweetAlert.showLoading('กำลังบันทึกสินค้า...');

    // ✅ เช็คว่าเป็น Edit หรือ Create โดยดูจาก id
    if ('id' in productData && productData.id) {
      // Edit mode - เรียก update
      this.productService.update(productData as Product).subscribe({
        next: (updatedProduct) => {
          this.sweetAlert.close();
          this.loadProducts();
          this.sweetAlert.showSuccess(
            'แก้ไขสินค้าสำเร็จ!',
            `${updatedProduct.name} (SKU: ${updatedProduct.sku})`
          );
        },
        error: (error) => {
          this.sweetAlert.showError(
            'เกิดข้อผิดพลาด',
            'ไม่สามารถแก้ไขสินค้าได้'
          );
        },
      });
    } else {
      // Create mode - เรียก create
      this.productService.create(productData).subscribe({
        next: (newProduct) => {
          this.sweetAlert.close();
          this.loadProducts();

          this.sweetAlert.showSuccess(
            'บันทึกสินค้าสำเร็จ!',
            `${newProduct.name} (SKU: ${newProduct.sku})`
          );
        },
        error: (error) => {
          this.sweetAlert.showError(
            'เกิดข้อผิดพลาด',
            'ไม่สามารถบันทึกสินค้าได้'
          );
        },
      });
    }
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedStatus.set('');
  }

  onCancelProduct() {}
}
