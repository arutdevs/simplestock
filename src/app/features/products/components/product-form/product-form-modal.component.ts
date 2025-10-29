// product-form-modal.component.ts
import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Product } from '../../../../shared/models/product.model';
import { Category } from '../../../../shared/models/category.model';
import { MOCK_CATEGORIES } from '../../../../shared/models/product.mock';
import { SweetAlertService } from '../../../../shared/services/alert-config.service';

declare var bootstrap: any;

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-modal.component.html',
  styleUrls: ['./product-form-modal.component.scss'],
})
export class ProductFormModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() save = new EventEmitter<Partial<Product>>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private sweetAlert = inject(SweetAlertService);

  productForm!: FormGroup;
  isEditMode = signal(false);
  currentProductId = signal<string | null>(null);
  private modal: any;

  categories = signal<Category[]>(MOCK_CATEGORIES.filter((c) => c.isActive));
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);
  selectedImageBase64 = signal<string | null>(null);

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      category: ['', Validators.required],
      unit: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      cost: [0],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0],
      imageUrl: [''],
      isActive: [true],
    });
  }

  private patchFormValue(product: Product) {
    this.productForm.patchValue({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      category: product.category,
      unit: product.unit,
      price: product.price,
      cost: product.cost || 0,
      stock: product.stock,
      minStock: product.minStock || 0,
      imageUrl: product.imageUrl || '',
      isActive: product.isActive,
    });

    if (product.imageUrl) {
      this.imagePreview.set(product.imageUrl);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  calculateProfit(): string {
    const price = this.productForm.get('price')?.value || 0;
    const cost = this.productForm.get('cost')?.value || 0;
    const profit = price - cost;

    if (profit > 0) {
      return `+${profit.toFixed(2)} บาท`;
    } else if (profit < 0) {
      return `${profit.toFixed(2)} บาท`;
    }
    return '0.00 บาท';
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      if (this.isEditMode() && this.currentProductId()) {
        // Edit Mode
        const productData: Partial<Product> = {
          id: this.currentProductId()!,
          sku: formValue.sku,
          name: formValue.name,
          description: formValue.description || undefined,
          category: formValue.category,
          unit: formValue.unit,
          price: parseFloat(formValue.price),
          cost: formValue.cost ? parseFloat(formValue.cost) : undefined,
          stock: parseInt(formValue.stock),
          minStock: formValue.minStock
            ? parseInt(formValue.minStock)
            : undefined,
          imageUrl:
            this.selectedImageBase64() || formValue.imageUrl || undefined,
          isActive: formValue.isActive,
        };

        this.save.emit(productData);
      } else {
        // Create Mode
        const productData: Partial<Product> = {
          sku: formValue.sku,
          name: formValue.name,
          description: formValue.description || undefined,
          category: formValue.category,
          unit: formValue.unit,
          price: parseFloat(formValue.price),
          cost: formValue.cost ? parseFloat(formValue.cost) : undefined,
          stock: parseInt(formValue.stock),
          minStock: formValue.minStock
            ? parseInt(formValue.minStock)
            : undefined,
          imageUrl: this.selectedImageBase64() || undefined,
          isActive: formValue.isActive,
        };

        this.save.emit(productData);
      }
    } else {
      Object.keys(this.productForm.controls).forEach((key) => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  async onClear() {
    const result = await this.sweetAlert.showConfirm({
      title: 'ยืนยันการเคลียร์ข้อมูล',
      text: 'ต้องการเคลียร์ข้อมูลทั้งหมด?',
      icon: 'question',
      confirmButtonText: 'ใช่, เคลียร์',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      this.productForm.reset({
        isActive: true,
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0,
      });
      this.removeImage();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.closeModal();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (file.size > 5 * 1024 * 1024) {
        this.sweetAlert.showWarning(
          'ขนาดไฟล์ใหญ่เกินไป',
          'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB'
        );
        input.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.sweetAlert.showWarning(
          'ประเภทไฟล์ไม่ถูกต้อง',
          'กรุณาเลือกไฟล์รูปภาพเท่านั้น'
        );
        input.value = '';
        return;
      }

      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const base64String = e.target.result as string;
          this.selectedImageBase64.set(base64String);
          this.imagePreview.set(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile.set(null);
    this.selectedImageBase64.set(null);
    this.imagePreview.set(null);

    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  openModal(product?: Product) {
    this.productForm.reset({
      isActive: true,
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
    });
    this.removeImage();

    if (product) {
      // Edit Mode
      this.isEditMode.set(true);
      this.currentProductId.set(product.id!);
      this.patchFormValue(product);
    } else {
      // Create Mode
      this.isEditMode.set(false);
      this.currentProductId.set(null);
    }

    const modalElement = document.getElementById('productFormModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();
    }

    this.productForm.reset({
      isActive: true,
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
    });
    this.removeImage();
    this.isEditMode.set(false);
    this.currentProductId.set(null);
  }
}
