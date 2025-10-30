import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Header } from '../../shared/layout/header/header';
import { ProductFormModal } from '../../components/product-form-modal/product-form-modal';
import { Product } from '../../shared/models/product.model';
import { Category } from '../../shared/models/category.model';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';
import { SweetAlertService } from '../../shared/services/alert-config-service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, Header],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private modalService = inject(NgbModal);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private sweetAlert = inject(SweetAlertService);

  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');
  selectedCategory = signal('');

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

    return filtered;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    forkJoin({
      products: this.productService
        .getAll()
        .pipe(map((response) => response.data ?? [])),

      categories: this.categoryService.getAll().pipe(
        map((response) => response.data ?? []),
        catchError((error) => {
          console.error('Error loading categories:', error);
          return of([]);
        })
      ),
    }).subscribe({
      next: ({ products, categories }) => {
        this.allProducts.set(products);
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.sweetAlert.showError(
          'เกิดข้อผิดพลาด',
          'ไม่สามารถโหลดข้อมูลสินค้าได้'
        );
        console.error('Error loading data:', error);
      },
    });
  }

  onAddProduct() {
    const modalRef = this.modalService.open(ProductFormModal, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.result
      .then((formData: Product) => {
        this.sweetAlert.showLoading('กำลังบันทึกสินค้า...');

        this.productService
          .create(formData)
          .pipe(map((response) => response.data!))
          .subscribe({
            next: (newProduct) => {
              this.sweetAlert.close();
              this.loadData();
              this.sweetAlert.showSuccess(
                'บันทึกสินค้าสำเร็จ!',
                `${newProduct.name} (SKU: ${newProduct.sku})`
              );
            },
            error: (error) => {
              this.sweetAlert.close();
              this.sweetAlert.showError(
                'เกิดข้อผิดพลาด',
                'ไม่สามารถบันทึกสินค้าได้'
              );
              console.error('Error creating product:', error);
            },
          });
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  onEditProduct(id: string) {
    this.sweetAlert.showLoading('กำลังโหลดข้อมูลสินค้า...');

    this.productService
      .getById(id)
      .pipe(map((response) => response.data!))
      .subscribe({
        next: (product) => {
          this.sweetAlert.close();

          const modalRef = this.modalService.open(ProductFormModal, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
            keyboard: false,
          });

          modalRef.componentInstance.productDetail = product;

          modalRef.result
            .then((formData: Product) => {
              this.sweetAlert.showLoading('กำลังแก้ไขสินค้า...');

              this.productService
                .update(formData)
                .pipe(map((response) => response.data!))
                .subscribe({
                  next: (updatedProduct) => {
                    this.sweetAlert.close();
                    this.loadData();
                    this.sweetAlert.showSuccess(
                      'แก้ไขสินค้าสำเร็จ!',
                      `${updatedProduct.name} (SKU: ${updatedProduct.sku})`
                    );
                  },
                  error: (error) => {
                    this.sweetAlert.close();
                    this.sweetAlert.showError(
                      'เกิดข้อผิดพลาด',
                      'ไม่สามารถแก้ไขสินค้าได้'
                    );
                    console.error('Error updating product:', error);
                  },
                });
            })
            .catch((reason) => {
              console.log('Modal dismissed:', reason);
            });
        },
        error: (error) => {
          this.sweetAlert.close();
          this.sweetAlert.showError(
            'เกิดข้อผิดพลาด',
            'ไม่สามารถโหลดข้อมูลสินค้าได้'
          );
          console.error('Error loading product:', error);
        },
      });
  }

  async onDeleteProduct(id: string) {
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
          this.loadData();
          this.sweetAlert.showSuccess(
            'ลบสินค้าสำเร็จ!',
            'สินค้าถูกลบออกจากระบบแล้ว'
          );
        },
        error: (error) => {
          this.sweetAlert.close();
          this.sweetAlert.showError('เกิดข้อผิดพลาด', 'ไม่สามารถลบสินค้าได้');
          console.error('Error deleting product:', error);
        },
      });
    }
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('');
  }
}
