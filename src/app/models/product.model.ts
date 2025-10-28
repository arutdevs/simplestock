export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryIcon: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  imageUrl: string;
}

export interface ProductStats {
  totalProducts: number;
  lowStockItems: number;
  categories: number;
  inventoryValue: string;
  productGrowth: string;
  valueGrowth: string;
}

export type ProductStatus = 'ทั้งหมด' | 'เปิดใช้งาน' | 'ปิดใช้งาน' | 'สินค้าหมด';
export type ProductCategory = 'ทั้งหมด' | 'อิเล็กทรอนิกส์' | 'เสื้อผ้า' | 'อาหารและเครื่องดื่ม' | 'เครื่องใช้ในบ้าน';
