import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
export interface ErrorMessage {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
}
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private errorSubject = new Subject<ErrorMessage>();

  /**
   * Observable สำหรับรับ error messages
   */
  public error$: Observable<ErrorMessage> = this.errorSubject.asObservable();

  /**
   * แสดง error message
   */
  showError(message: string): void {
    this.errorSubject.next({
      message,
      type: 'error',
      timestamp: new Date(),
    });
    console.error(`[ERROR] ${message}`);
  }

  /**
   * แสดง warning message
   */
  showWarning(message: string): void {
    this.errorSubject.next({
      message,
      type: 'warning',
      timestamp: new Date(),
    });
    console.warn(`[WARNING] ${message}`);
  }

  /**
   * แสดง info message
   */
  showInfo(message: string): void {
    this.errorSubject.next({
      message,
      type: 'info',
      timestamp: new Date(),
    });
    console.info(`[INFO] ${message}`);
  }

  /**
   * แสดง success message
   */
  showSuccess(message: string): void {
    this.errorSubject.next({
      message,
      type: 'success',
      timestamp: new Date(),
    });
    console.log(`[SUCCESS] ${message}`);
  }
}
