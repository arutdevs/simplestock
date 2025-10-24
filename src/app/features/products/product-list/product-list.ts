import { Component, ViewChild } from '@angular/core';
import { Header } from '../../../shared/layout/header/header';
import { ProductFormModalComponent } from '../../../shared/components/product-form-modal/product-form-modal.component';
import { ProductCreateDto } from '../../../shared/models';

@Component({
  selector: 'app-product-list',
  imports: [Header, ProductFormModalComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  @ViewChild(ProductFormModalComponent) productModal!: ProductFormModalComponent;

  /**
   * เปิด modal สำหรับเพิ่มสินค้าใหม่
   */
  openAddProductModal() {
    this.productModal.openModal();
  }

  /**
   * บันทึกสินค้าใหม่
   */
  onSaveProduct(productData: ProductCreateDto) {
    console.log('บันทึกสินค้า:', productData);
    // TODO: เรียก ProductService.create(productData)
    alert(`บันทึกสินค้าสำเร็จ!\nชื่อ: ${productData.name}\nSKU: ${productData.sku}`);
  }

  /**
   * ยกเลิกการเพิ่ม/แก้ไขสินค้า
   */
  onCancelProduct() {
    console.log('ยกเลิกการเพิ่มสินค้า');
  }
}
