import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    UserListComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'signin', component: SigninComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectLoggedInTo(['members/user-profile']) }
      },
      {
        path: 'user-list', component: UserListComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['auth/signin'])}
      },
      {
        path: 'signup', component: SignupComponent
      },
      {
        path: '', redirectTo: 'signin', pathMatch: 'full'
      }
    ])
  ]
})
export class AuthModule { }
