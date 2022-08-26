import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  loadingStated = new Subject<boolean>();

  constructor(
    public snackBar: MatSnackBar
  ) { }

  config: MatSnackBarConfig = {
    duration: 3000
  }

  success(msg: string) {
    this.config.panelClass = ['snac-success'];
    this.snackBar.open(msg, 'OK', this.config);
  }

  warn(msg: string) {
    this.config.panelClass = ['snac-error'];
    this.snackBar.open(msg, 'OK', this.config);
  }
}
