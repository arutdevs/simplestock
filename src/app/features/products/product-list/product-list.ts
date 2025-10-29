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

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, Header, ProductFormModalComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  @ViewChild(ProductFormModalComponent)
  productFormModal!: ProductFormModalComponent;

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

  onEditProduct(id: string) {
    this.sweetAlert.showLoading('กำลังโหลดข้อมูลสินค้า...');

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.sweetAlert.close();
        this.productFormModal.openModal(product);
      },
      error: (error) => {
        this.sweetAlert.showError(
          'เกิดข้อผิดพลาด',
          'ไม่สามารถโหลดข้อมูลสินค้าได้'
        );
      },
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

          this.productFormModal.closeModal();

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

          this.productFormModal.closeModal();

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

  onCancelProduct() {
    // Handle cancel logic if needed
  }
}
