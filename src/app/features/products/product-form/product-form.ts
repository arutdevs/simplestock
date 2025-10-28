import { Component, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/layout/header/header';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [Header, CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm {
  // Signal for form mode (new or edit)
  isEditMode = signal<boolean>(false);
  productId = signal<string | null>(null);

  // Form field signals
  formData = signal<Partial<Product>>({
    name: '',
    sku: '',
    category: 'อิเล็กทรอนิกส์',
    categoryIcon: 'fa-laptop',
    description: '',
    price: 0,
    stock: 0,
    status: 'active',
    imageUrl: ''
  });

  // Validation signals
  isFormValid = computed(() => {
    const data = this.formData();
    return !!(
      data.name &&
      data.sku &&
      data.category &&
      data.description &&
      data.price && data.price > 0 &&
      data.stock !== undefined && data.stock >= 0
    );
  });

  // Submission state
  isSubmitting = signal<boolean>(false);
  submitMessage = signal<string>('');
  submitMessageType = signal<'success' | 'error' | ''>('');

  // Available categories
  categories = [
    { value: 'อิเล็กทรอนิกส์', icon: 'fa-laptop' },
    { value: 'เสื้อผ้า', icon: 'fa-tshirt' },
    { value: 'อาหารและเครื่องดื่ม', icon: 'fa-coffee' },
    { value: 'เครื่องใช้ในบ้าน', icon: 'fa-home' }
  ];

  // Expose global functions to template
  parseFloat = parseFloat;
  parseInt = parseInt;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Effect to handle route params
    effect(() => {
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.isEditMode.set(true);
        this.productId.set(productId);
        this.loadProduct(productId);
      }
    });
  }

  // Update specific form field
  updateField<K extends keyof Product>(field: K, value: Product[K]): void {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  // Update category and its icon
  updateCategory(category: string): void {
    const selectedCategory = this.categories.find(c => c.value === category);
    this.formData.update(current => ({
      ...current,
      category: category,
      categoryIcon: selectedCategory?.icon || 'fa-laptop'
    }));
  }

  // Load product data for editing
  loadProduct(productId: string): void {
    // In a real app, this would load from a service
    // For now, using mock data
    const mockProduct: Product = {
      id: productId,
      name: 'Laptop Dell Inspiron 15',
      sku: 'LAP-001',
      category: 'อิเล็กทรอนิกส์',
      categoryIcon: 'fa-laptop',
      description: 'Intel Core i5 • 8GB RAM • 256GB SSD',
      price: 25900,
      stock: 45,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/667eea/ffffff?text=Laptop+Dell'
    };

    this.formData.set(mockProduct);
  }

  // Handle form submission
  async handleSubmit(): Promise<void> {
    if (!this.isFormValid()) {
      this.submitMessage.set('กรุณากรอกข้อมูลให้ครบถ้วน');
      this.submitMessageType.set('error');
      return;
    }

    this.isSubmitting.set(true);
    this.submitMessage.set('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = this.formData();
      if (this.isEditMode()) {
        console.log('Updating product:', this.productId(), data);
        this.submitMessage.set('แก้ไขสินค้าสำเร็จ');
      } else {
        console.log('Creating new product:', data);
        this.submitMessage.set('เพิ่มสินค้าสำเร็จ');
      }

      this.submitMessageType.set('success');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 1500);

    } catch (error) {
      this.submitMessage.set('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      this.submitMessageType.set('error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Cancel and go back
  cancel(): void {
    this.router.navigate(['/products']);
  }

  // Reset form
  resetForm(): void {
    this.formData.set({
      name: '',
      sku: '',
      category: 'อิเล็กทรอนิกส์',
      categoryIcon: 'fa-laptop',
      description: '',
      price: 0,
      stock: 0,
      status: 'active',
      imageUrl: ''
    });
    this.submitMessage.set('');
    this.submitMessageType.set('');
  }

  // Get page title based on mode
  getPageTitle(): string {
    return this.isEditMode() ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่';
  }

  // Get submit button text based on mode
  getSubmitButtonText(): string {
    if (this.isSubmitting()) {
      return 'กำลังบันทึก...';
    }
    return this.isEditMode() ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า';
  }
}
