import { AfterViewInit, Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITRANSACTION_RESULT } from '../../models';
import { NotifierComponent } from './notifier/notifier.component';

export interface INOTIF {
  function: (args:any) => any;
  args: any;
  state: 'view' | 'pure' | 'payable' | 'nonpayable';
}

@Injectable({
  providedIn: 'root',
})
export class NotifierService {
  toasts: any[] = [];
  constructor(private _snackBar: MatSnackBar) {}

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast:any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
  async showNotificationTransaction(notification_message:ITRANSACTION_RESULT){
 
    this._snackBar.openFromComponent(NotifierComponent, {
      data: notification_message,
      horizontalPosition: 'right',
      verticalPosition: notification_message.success == true ?  'top' : 'bottom',
      panelClass: notification_message.success == true ? ["green-snackbar"]:["red-snackbar"]
    });
  }


}
