import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import firebase from 'firebase/compat/app';
import User = firebase.User;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  user: User | undefined;

  constructor(
    public userAuth: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.isLoggedIn();
  }

  ngOnInit(): void {
  }

  isLoggedIn() {
    this.afAuth.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
  }

  goProfile() {
    this.router.navigate(['/members/user-profile']).catch();
  }

  onSignOut() {
    this.userAuth.signout();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
