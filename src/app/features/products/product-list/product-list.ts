import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../shared/layout/header/header';
import { Product, ProductStats, ProductStatus, ProductCategory } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [Header, CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  // Signals for filters
  searchText = signal<string>('');
  selectedCategory = signal<ProductCategory>('ทั้งหมด');
  selectedStatus = signal<ProductStatus>('ทั้งหมด');

  // Signal for all products
  products = signal<Product[]>([
    {
      id: '1',
      name: 'Laptop Dell Inspiron 15',
      sku: 'LAP-001',
      category: 'อิเล็กทรอนิกส์',
      categoryIcon: 'fa-laptop',
      description: 'Intel Core i5 • 8GB RAM • 256GB SSD',
      price: 25900,
      stock: 45,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/667eea/ffffff?text=Laptop+Dell'
    },
    {
      id: '2',
      name: 'เสื้อยืดคอกลม Premium',
      sku: 'TSH-002',
      category: 'เสื้อผ้า',
      categoryIcon: 'fa-tshirt',
      description: 'ผ้าคอตตอน 100% • นุ่มใส่สบาย',
      price: 590,
      stock: 120,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/f093fb/ffffff?text=T-Shirt'
    },
    {
      id: '3',
      name: 'เมล็ดกาแฟคั่วอาราบิก้า',
      sku: 'COF-003',
      category: 'อาหารและเครื่องดื่ม',
      categoryIcon: 'fa-coffee',
      description: '100% Arabica • โน้ตรสช็อคโกแลต',
      price: 450,
      stock: 8,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/4facfe/ffffff?text=Coffee+Beans'
    },
    {
      id: '4',
      name: 'เก้าอี้ทำงาน Ergonomic',
      sku: 'CHR-004',
      category: 'เครื่องใช้ในบ้าน',
      categoryIcon: 'fa-home',
      description: 'รองรับหลัง • ปรับระดับได้',
      price: 3900,
      stock: 0,
      status: 'out-of-stock',
      imageUrl: 'https://via.placeholder.com/300x250/43e97b/ffffff?text=Office+Chair'
    },
    {
      id: '5',
      name: 'เมาส์ไร้สาย Bluetooth',
      sku: 'MOU-005',
      category: 'อิเล็กทรอนิกส์',
      categoryIcon: 'fa-laptop',
      description: 'DPI ปรับได้ 3 ระดับ',
      price: 890,
      stock: 67,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/764ba2/ffffff?text=Wireless+Mouse'
    },
    {
      id: '6',
      name: 'หูฟังบลูทูธ Noise Cancel',
      sku: 'HDP-006',
      category: 'อิเล็กทรอนิกส์',
      categoryIcon: 'fa-laptop',
      description: 'ใช้งาน 30 ชม. • ตัดเสียงรบกวน',
      price: 2490,
      stock: 32,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/f5576c/ffffff?text=Headphone'
    },
    {
      id: '7',
      name: 'Smart Watch Sport Edition',
      sku: 'WCH-007',
      category: 'อิเล็กทรอนิกส์',
      categoryIcon: 'fa-laptop',
      description: 'วัดหัวใจ • GPS • กันน้ำ',
      price: 4590,
      stock: 28,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/38ef7d/ffffff?text=Smart+Watch'
    },
    {
      id: '8',
      name: 'กระเป๋าเป้ Minimalist',
      sku: 'BAG-008',
      category: 'เสื้อผ้า',
      categoryIcon: 'fa-tshirt',
      description: 'ช่องใส่ Laptop 15" • กันน้ำ',
      price: 1290,
      stock: 5,
      status: 'active',
      imageUrl: 'https://via.placeholder.com/300x250/00f2fe/ffffff?text=Backpack'
    }
  ]);

  // Computed signal for filtered products
  filteredProducts = computed(() => {
    let filtered = this.products();

    // Filter by search text
    const search = this.searchText().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Filter by category
    const category = this.selectedCategory();
    if (category !== 'ทั้งหมด') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by status
    const status = this.selectedStatus();
    if (status !== 'ทั้งหมด') {
      if (status === 'เปิดใช้งาน') {
        filtered = filtered.filter(p => p.status === 'active');
      } else if (status === 'ปิดใช้งาน') {
        filtered = filtered.filter(p => p.status === 'inactive');
      } else if (status === 'สินค้าหมด') {
        filtered = filtered.filter(p => p.status === 'out-of-stock');
      }
    }

    return filtered;
  });

  // Computed signal for stats
  stats = computed<ProductStats>(() => {
    const allProducts = this.products();
    const lowStockItems = allProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
    const categories = new Set(allProducts.map(p => p.category)).size;
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return {
      totalProducts: allProducts.length,
      lowStockItems: lowStockItems,
      categories: categories,
      inventoryValue: `฿${(totalValue / 1000000).toFixed(1)}M`,
      productGrowth: '+12%',
      valueGrowth: '+8%'
    };
  });

  constructor(private router: Router) {}

  // Method to handle filter button click
  applyFilters(): void {
    // Filters are already reactive through signals
    // This method can be used for additional logic if needed
    console.log('Filters applied:', {
      search: this.searchText(),
      category: this.selectedCategory(),
      status: this.selectedStatus()
    });
  }

  // Navigate to add product form
  addNewProduct(): void {
    this.router.navigate(['/products/new']);
  }

  // Navigate to edit product form
  editProduct(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
  }

  // Get badge class based on product status
  getStatusBadgeClass(product: Product): string {
    if (product.status === 'out-of-stock') return 'badge-danger';
    if (product.stock <= 10) return 'badge-warning';
    return 'badge-active';
  }

  // Get status text based on product
  getStatusText(product: Product): string {
    if (product.status === 'out-of-stock') return 'สินค้าหมด';
    if (product.stock <= 10) return 'คงเหลือต่ำ';
    return 'เปิดใช้งาน';
  }

  // Get status icon based on product
  getStatusIcon(product: Product): string {
    if (product.status === 'out-of-stock') return 'fa-times-circle';
    if (product.stock <= 10) return 'fa-exclamation-triangle';
    return 'fa-check-circle';
  }

  // Get stock color based on stock level
  getStockColor(stock: number): string {
    if (stock === 0) return 'rgba(239, 68, 68, 1)';
    if (stock <= 10) return 'rgba(251, 191, 36, 1)';
    return 'rgba(52, 211, 153, 1)';
  }

  // Get stock icon based on stock level
  getStockIcon(stock: number): string {
    if (stock === 0) return 'fa-ban';
    return 'fa-box';
  }
}
