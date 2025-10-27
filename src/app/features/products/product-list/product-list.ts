import { Component } from '@angular/core';
import { Header } from '../../../shared/layout/header/header';
import { ProductFormModalComponent } from '../components/product-form/product-form-modal.component';
import { ProductCreateDto } from '../../../shared/models';

@Component({
  selector: 'app-product-list',
  imports: [Header, ProductFormModalComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
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
