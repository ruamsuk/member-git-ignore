import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../auth/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../../models/user.model';
import { EditUserProfileComponent } from '../edit-user-profile/edit-user-profile.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userData: any;
  userSignin!: firebase.User | null;
  userName: string | null | undefined;
  userEmail: string | null | undefined;
  userCreated: string | null | undefined;
  userLastSignIn: string | null | undefined;

  constructor(
    public authService: AuthService,
    public afAuth: AngularFirestore,
    private dialog: MatDialog,
    private router: Router,
    private afa: AngularFireAuth
  ) {
    this.userState();
    this.isAuth();
  }

  ngOnInit(): void {
    let user = '';
    // this.authService.userRole.subscribe(rs => {
    //   console.log(typeof rs);
    //   if (rs) {
    //     user = rs.uid;
    //   }
    // });
    // console.log('User Role: ', this.authService.userRole);
  }

  private userState() {
    this.afa.user
      .pipe(take(1))
      .subscribe((user: any) => {
      this.userSignin = user;
      this.userName = user?.displayName ? user?.displayName : user?.email;
      this.userEmail = user?.email;
      this.userCreated = user?.metadata.creationTime;
      this.userLastSignIn = user?.metadata.lastSignInTime;
    });
  }


  isAuth() {
    firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        this.userData = user;
      }
    });
  }

  doEdit(user: User): void {
    this.authService.populateForm(this.userSignin);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    // dialogConfig.width = '300px';
    this.dialog.open(EditUserProfileComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        // this.userState();
      });
  }

  sendEmailVerified() {
    this.authService.sendVerificationEmail();
  }

  changePassword() {
    this.router.navigate(['/members/change-password']).catch();
  }

  goBack() {
    this.router.navigate(['/members/member-list']).catch();
  }

}
