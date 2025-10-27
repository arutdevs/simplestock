/**
 * Product Form Modal Component
 * Modal สำหรับเพิ่ม/แก้ไขข้อมูลสินค้า
 */

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductCreateDto, Product } from '../../../../shared/models';

declare var bootstrap: any;

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form-modal.component.html',
  styleUrls: ['./product-form-modal.component.scss']
})
export class ProductFormModalComponent implements OnInit {
  @Input() product?: Product; // สำหรับ Edit mode
  @Output() save = new EventEmitter<ProductCreateDto>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  isEditMode = false;
  private modal: any;

  // Image handling
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  selectedImageBase64: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();

    // ถ้ามี product (Edit mode)
    if (this.product) {
      this.isEditMode = true;
      this.patchFormValue(this.product);
    }
  }

  /**
   * สร้าง form with validators
   */
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
      barcode: [''],
      imageUrl: [''],
      isActive: [true]
    });
  }

  /**
   * Patch ค่าเมื่ออยู่ใน Edit mode
   */
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
      barcode: product.barcode || '',
      imageUrl: product.imageUrl || '',
      isActive: product.isActive
    });

    // แสดง preview รูปภาพถ้ามี
    if (product.imageUrl) {
      this.imagePreview = product.imageUrl;
    }
  }

  /**
   * ตรวจสอบว่า field มี error และถูก touch แล้ว
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * คำนวณกำไร (ราคาขาย - ราคาทุน)
   */
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

  /**
   * Submit form
   */
  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      // สร้าง DTO
      const productDto: ProductCreateDto = {
        sku: formValue.sku,
        name: formValue.name,
        description: formValue.description || undefined,
        category: formValue.category,
        unit: formValue.unit,
        price: parseFloat(formValue.price),
        cost: formValue.cost ? parseFloat(formValue.cost) : undefined,
        stock: parseInt(formValue.stock),
        minStock: formValue.minStock ? parseInt(formValue.minStock) : undefined,
        barcode: formValue.barcode || undefined,
        imageUrl: this.selectedImageBase64 || undefined, // ใช้ base64 string จากไฟล์ที่เลือก
        isActive: formValue.isActive
      };

      // Emit ข้อมูลออกไป
      this.save.emit(productDto);

      // ปิด modal
      this.closeModal();

      // Reset form และรูปภาพ
      this.productForm.reset({
        isActive: true,
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0
      });
      this.removeImage();
    } else {
      // Mark all fields as touched เพื่อแสดง validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * เคลียร์ข้อมูลทั้งหมด
   */
  onClear() {
    if (confirm('ต้องการเคลียร์ข้อมูลทั้งหมด?')) {
      this.productForm.reset({
        isActive: true,
        price: 0,
        cost: 0,
        stock: 0,
        minStock: 0
      });
      this.removeImage();
    }
  }

  /**
   * ยกเลิก
   */
  onCancel() {
    this.cancel.emit();
    this.closeModal();
  }

  /**
   * จัดการเมื่อเลือกไฟล์รูปภาพ
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ใหญ่เกินไป! กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB');
        input.value = '';
        return;
      }

      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        input.value = '';
        return;
      }

      this.selectedFile = file;

      // แปลงเป็น base64 และแสดง preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          const base64String = e.target.result as string;
          this.selectedImageBase64 = base64String;
          this.imagePreview = base64String;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * ลบรูปภาพที่เลือก
   */
  removeImage() {
    this.selectedFile = null;
    this.selectedImageBase64 = null;
    this.imagePreview = null;

    // Clear file input
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  /**
   * เปิด modal
   */
  openModal() {
    const modalElement = document.getElementById('productFormModal');
    if (modalElement) {
      this.modal = new bootstrap.Modal(modalElement);
      this.modal.show();
    }
  }

  /**
   * ปิด modal
   */
  closeModal() {
    if (this.modal) {
      this.modal.hide();
    }
  }
}
