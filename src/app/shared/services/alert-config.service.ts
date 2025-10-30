import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

export interface AlertConfig {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  html?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  // ✅ สีจากธีม
  private readonly themeColors = {
    primary: '#6366F1', // Indigo
    danger: '#EF4444', // Red
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    info: '#3B82F6', // Blue
    secondary: '#64748B', // Slate
  };

  // Alert แบบธรรมดา
  showAlert(config: AlertConfig): Promise<SweetAlertResult> {
    return Swal.fire({
      title: config.title || 'แจ้งเตือน',
      text: config.text,
      html: config.html,
      icon: config.icon || 'info',
      confirmButtonText: config.confirmButtonText || 'ตกลง',
      confirmButtonColor: config.confirmButtonColor || this.themeColors.primary,
      reverseButtons: true, // ✅ ปุ่มตกลงอยู่ขวา
    });
  }

  // Alert แบบมีปุ่ม Confirm/Cancel
  showConfirm(config: AlertConfig): Promise<SweetAlertResult> {
    return Swal.fire({
      title: config.title || 'ยืนยันการทำงาน',
      text: config.text,
      html: config.html,
      icon: config.icon || 'question',
      showCancelButton: true,
      confirmButtonText: config.confirmButtonText || 'ตกลง',
      cancelButtonText: config.cancelButtonText || 'ยกเลิก',
      confirmButtonColor: config.confirmButtonColor || this.themeColors.primary,
      cancelButtonColor: config.cancelButtonColor || this.themeColors.secondary,
      reverseButtons: true, // ✅ ปุ่มตกลงอยู่ขวา, ยกเลิกอยู่ซ้าย
    });
  }

  // Success Alert
  showSuccess(
    title: string = 'สำเร็จ!',
    text?: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: this.themeColors.success, // ✅ เขียว Emerald
      timer: 2000,
      reverseButtons: true,
    });
  }

  // Error Alert
  showError(
    title: string = 'เกิดข้อผิดพลาด!',
    text?: string
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: this.themeColors.danger, // ✅ แดง
      reverseButtons: true,
    });
  }

  // Warning Alert
  showWarning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'ตกลง',
      confirmButtonColor: this.themeColors.warning, // ✅ เหลืองส้ม Amber
      reverseButtons: true,
    });
  }

  // Loading Alert
  showLoading(title: string = 'กำลังโหลด...'): void {
    Swal.fire({
      title,
      allowOutsideClick: false,
      showConfirmButton: false, // ✅ ซ่อนปุ่มตอน loading
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // ปิด Alert
  close(): void {
    Swal.close();
  }

  // Toast notification
  showToast(title: string, icon: SweetAlertIcon = 'success'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon,
      title,
    });
  }
}
