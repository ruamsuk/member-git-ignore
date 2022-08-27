import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public form!: FormGroup;
  imageUrl = 'assets/images/inquirer25.png';
  hide = true;
  hide1 = true;
  loading = false;


  constructor(
    private service: AppService,
    private auth: AngularFireAuth,
    private afAuth: AuthService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

   await this.afAuth.signup({
      email: this.form.value.email,
      password: this.form.value.password
    })
     .then(() => {
       this.loading = false;
     });
  }

  private initializeForms(): any {
    this.form = new FormGroup({
      email: new FormControl('',
        [Validators.required,
          Validators.minLength(6),
          // Validators.maxLength(25),
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('',
        [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20)]),
      repassword: new FormControl('',
        [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          this.confirmPassword])
    });
  }

  confirmPassword(rectrl: AbstractControl): any {
    const parent = rectrl.parent;
    if (!parent) {
      return;
    }
    const password = parent.get('password');
    const sub = password?.valueChanges.subscribe(() => {
      rectrl.updateValueAndValidity();
      sub?.unsubscribe();
    });

    if (!rectrl.value) {
      return;
    }
    if (rectrl.value === password?.value) {
      return;
    }

    return {confirmPassword: true};
  }

}
