import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-email-address',
  templateUrl: './confirm-email-address.component.html',
  styleUrls: ['./confirm-email-address.component.scss']
})
export class ConfirmEmailAddressComponent implements OnInit {
  userData!: firebase.User | null;

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    this.doUser().catch();
  }


  ngOnInit(): void {
  }

  async doUser() {
    const user = await this.auth.isUser();
    if (user) {
      this.userData = user;
    }
  }

  doSignOut() {
    this.auth.signout(true);
  }

}
