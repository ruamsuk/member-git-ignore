import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppService } from '../services/app.service';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../services/util.service';
import { AuthData } from '../models/auth-data.model';
import { FileUpload } from '../models/file-upload';
import { UserRole } from '../models/roles.model';
import { first, take } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<firebase.User | null>;
  userRole!: Observable<UserRole>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private appService: AppService,
    private util: UtilService
  ) {
    this.user = afAuth.authState;
    // @ts-ignore
    this.userRole = this.afAuth.authState
      .pipe(take(1))
      .subscribe((user) => {
        if (user) {
          return this.afs.doc(`users/${user.uid}`)
            .valueChanges()
        } else {
          // @ts-ignore
          return null;
        }
      });
    // console.log('User Role: ', this.userRole);
  }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    photoURL: new FormControl(''),
    emailVerified: new FormControl(false),
  });

  /** form แก้ไขข้อมูลผู้ใช้ */
  newForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    displayName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    photoURL: new FormControl(''),
    emailVerified: new FormControl(false)
  });

  populateForm(user: any) {
    this.form.setValue({
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });

    this.newForm.setValue({
      id: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });
  }

  editImage(image: FileUpload) {
    this.newForm.setValue({
      photoURL: image.url
    });
  }

  /** Login */
  async signin(authData: AuthData): Promise<any> {
    this.util.loadingStated.next(true);
    await this.afAuth.signInWithEmailAndPassword(
      authData.email, authData.password
    )
      .then((user) => {
        this.util.loadingStated.next(false);

        if (user.user?.emailVerified)
        {
          this.util.success('Welcome you signin success.');
        } else {
          this.util.warn('ต้องยืนยันอีเมล์ก่อน จีงจะดูรายชื่อสมาชิกได้');
          this.signout(true);
        }
        this.router.navigate(['members/user-profile'])
          .then()
      })
      .catch(error => {
        this.util.loadingStated.next(false);
        this.util.warn(error.message);
      });
  }

  /** Signup */
  async signup(auth: AuthData): Promise<any> {
    this.util.loadingStated.next(true);
    await this.afAuth.createUserWithEmailAndPassword(auth.email, auth.password)
      .then((user) => {
        this.util.loadingStated.next(false);
        this.addNewUser(user)
          .then(() => {
            this.router.navigate(['auth/signin'])
              .then(() => {
                  this.util.success('Signup successfully.');
                }
              )
              .catch((err) => this.util.warn(err.message))
              .finally();

          })
          .catch(err => {
            this.util.loadingStated.next(false);
            this.util.warn(err.message);
          });
      });
  }

  sendVerificationEmail() {
    const auth = firebase.auth();
    const user = auth.currentUser;
    user?.sendEmailVerification()
      .then(() => {
        this.router.navigate(['/members/verify-email-address'])
          .finally()
      })
      .catch(error => this.util.warn(error.message))
      .finally(() => console.log('email send.'));
  }

  changePassword(email: string) {
    const auth = firebase.auth();
    auth.sendPasswordResetEmail(email)
      .then(() => {
        window.alert('Password reset email send, check your inbox.');
      })
      .catch((error: { message: any; }) =>
        this.util.warn(error.message)
      );
  }


  signout(flag: boolean = false): void {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/auth/signin'])
        .then(() => {
          if (!flag) {
            this.appService.dialog(`You are logged out, See ya again. Bye.`)
          } else {
            this.appService.dialog('ให้ยืนยันอีเมล์แล้ว ล็อกอินอีกครั้ง.')
          }
        }
        );
    });
  }

  upDateUser(users: any) {
    const user = firebase.auth().currentUser;
    user?.updateProfile({
      displayName: users.displayName,
      photoURL: users.photoURL
    })
      .then(() => {
        user?.updateEmail(`${users.email}`)
          .then(() =>
            this.util.success('Update profile success.')
          )
          .catch((error: { message: any; }) =>
            this.util.warn(error.message)
          );
      })
      .catch((error: { message: any; }) =>
        this.util.warn(error.message)
      );
  }

  getUser(id: string | undefined): Observable<any> {
    return this.afs.collection('users').doc(id).valueChanges();
  }

  getAuth() {
    return firebase.auth().currentUser;
  }

  isUser(): Promise<firebase.User | null> {
    // @ts-ignore
   return this.afAuth.authState.pipe(first());
  }

  /** เรียกดูข้อมูล user ทั้งหมด */
  getUsers(): AngularFirestoreCollection<UserRole> {
    return this.afs.collection<UserRole>('users');
  }

  /** ลบข้อมูลยูสเซอร์ */
  deleteUser(user: any) {
    console.log(user.id);
    // this.afs.doc(`users/${user.id}`)
    //   .delete()
    //   .then(() => {
    //     this.appService.dialog('Delete User successfully.')
    //   })
    //   .catch(err => {
    //     this.appService.dialog(this.myError(err.code));
    //   })
    //   .finally();
  }

  private myError(code: any): string {
    let msg = '';
    if (code == 'permission-denied') {
      msg = 'ไม่มีอำนาจดำเนินการในส่วนนี้';
    } else {
      msg = code;
    }
    return msg;
  }

  /** บันทึกข้อมูลผู้ลงทะเบียนใหม่ เพื่อกำหนดสิทธิ ค่าเริ่มต้นจะเป็น user */
  async addNewUser(user: any): Promise<any> {
    await this.afs.collection('users').doc(user.user.uid).set({
      id: user.user.uid,
      role: 'user',
      username: user.user.displayName ? user.user.displayName : user.user.email
    }).then(() => {
      this.util.success('บันทึกข้อมูลสมาชิกใหม่แล้ว.');
    });
  }

}

