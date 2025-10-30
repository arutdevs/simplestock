/**
 * Category Model
 * ใช้สำหรับจัดการหมวดหมู่สินค้า
 */

/**
 * Category Interface - หลัก
 */
export interface Category {
  id: string; // ID หมวดหมู่
  name: string; // ชื่อหมวดหมู่
  description?: string; // รายละเอียดหมวดหมู่
  icon?: string; // ไอคอน (Font Awesome class หรือ URL)
  color?: string; // สีของหมวดหมู่ (hex code)
  productCount?: number; // จำนวนสินค้าในหมวดหมู่
  isActive: boolean; // สถานะการใช้งาน
  createdAt: Date; // วันที่สร้าง
  updatedAt: Date; // วันที่แก้ไขล่าสุด
}
