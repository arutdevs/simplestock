/**
 * Loading Service
 * จัดการ loading state สำหรับแอปพลิเคชัน
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  /**
   * Observable สำหรับติดตาม loading state
   */
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * แสดง loading (เพิ่ม request counter)
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /**
   * ซ่อน loading (ลด request counter)
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }

  /**
   * รีเซ็ต loading state
   */
  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  /**
   * ตรวจสอบ loading state ปัจจุบัน
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
