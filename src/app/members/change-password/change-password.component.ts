import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  userData: any;

  constructor(
    public auth: AuthService
  ) {
    this.userData = this.auth.user;
  }

  ngOnInit(): void {
  }

}
