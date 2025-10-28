// sweet-alert.service.ts
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

export interface AlertConfig {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon; // 'success' | 'error' | 'warning' | 'info' | 'question'
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  html?: string; // สำหรับใส่ HTML custom
}

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  // Alert แบบธรรมดา
  showAlert(config: AlertConfig): Promise<SweetAlertResult> {
    return Swal.fire({
      title: config.title || 'แจ้งเตือน',
      text: config.text,
      html: config.html,
      icon: config.icon || 'info',
      confirmButtonText: config.confirmButtonText || 'ตรวจสอบ',
      confirmButtonColor: config.confirmButtonColor || '#3085d6',
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
      confirmButtonText: config.confirmButtonText || 'ยืนยัน',
      cancelButtonText: config.cancelButtonText || 'ยกเลิก',
      confirmButtonColor: config.confirmButtonColor || '#3085d6',
      cancelButtonColor: config.cancelButtonColor || '#d33',
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
      timer: 2000,
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
    });
  }

  // Warning Alert
  showWarning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonText: 'ตกลง',
    });
  }

  // Loading Alert
  showLoading(title: string = 'กำลังโหลด...'): void {
    Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // ปิด Alert
  close(): void {
    Swal.close();
  }

  // Toast notification (แบบมุมขวาบน)
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
