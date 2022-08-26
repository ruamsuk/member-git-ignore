import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UtilService } from '../../services/util.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hide = true;
  loading = false;
  submitted = false;
  private loadingSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public afAuth: AuthService,
    private util: UtilService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadingSub = this.util.loadingStated
      .pipe(take(1))
      .subscribe((loading: boolean) => {
        this.loading = loading;
      });
  }

  async onSubmit(): Promise<any> {
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }
    await this.afAuth.signin({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    }).then(r => {
      this.loading = false;
      this.submitted = false;
    }).finally(() =>
      {this.onClose();}
    );

  }

  onClose(): void {
    this.loginForm.reset();
  }

  onKeyup(event: KeyboardEvent) {
    if (this.loginForm.invalid) {
      return;
    }
    if (event.key !== undefined) {
      if (event.key == 'Enter') {
        this.onSubmit().then(r => r);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
