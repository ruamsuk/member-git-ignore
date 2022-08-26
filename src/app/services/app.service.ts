import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly loadingSub: Subject<boolean>;

  constructor(private snackbar: MatSnackBar) {
    this.loadingSub = new Subject<boolean>();
  }

  /** ดึงข้อมูล Subject */
  get getLoading(): Subject<boolean> { return this.loadingSub; }

  /** เปิด/ปิด loading */
  loading(status: boolean): any {
    this.loadingSub.next(status);
  }

  dialog(msg: string | null | undefined): any {
    return this.snackbar.open(msg as string, 'OK', {
      duration: 3000
    });
  }

  // confirm(msg: string): any {
  //   return this.confirmDialog.open(ConfirmComponent, {
  //     data: msg,
  //     disableClose: true
  //   }).afterClosed().toPromise<boolean>();
  // }
}
