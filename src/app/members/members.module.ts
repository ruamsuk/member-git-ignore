import { NgModule } from '@angular/core';
import { MembersComponent } from './members/members.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberUpdateComponent } from './member-update/member-update.component';
import { ThaiDatePipe } from '../pipe/thai-date.pipe';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { MemberDetailComponent } from './member-detail/member-detail.component';
import { HeaderComponent } from '../navigate/header/header.component';
import { FooterComponent } from '../navigate/footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditUserProfileComponent } from './edit-user-profile/edit-user-profile.component';
import { ConfirmEmailAddressComponent } from './confirm-email-address/confirm-email-address.component';
import { ChangePictureProfileComponent } from './change-picture-profile/change-picture-profile.component';

@NgModule({
  declarations: [
    MembersComponent,
    MemberListComponent,
    MemberUpdateComponent,
    MemberDetailComponent,
    UserProfileComponent,
    ChangePasswordComponent,
    EditUserProfileComponent,
    ConfirmEmailAddressComponent,
    HeaderComponent,
    FooterComponent,
    ThaiDatePipe,
    ChangePictureProfileComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'member-list', component: MemberListComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['auth/signin']) }
      },
      {
        path: 'user-profile', component: UserProfileComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: () => redirectUnauthorizedTo(['auth/signin']) }
      },
      {
        path: 'change-password', component: ChangePasswordComponent
      },
      {
        path: 'verify-email-address', component: ConfirmEmailAddressComponent
      },
      {
        path: '', redirectTo: 'user-profile', pathMatch: 'full'
      }
    ])
  ]
})
export class MembersModule { }
