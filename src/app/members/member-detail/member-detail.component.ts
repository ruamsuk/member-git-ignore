import { Component, OnInit } from '@angular/core';
import { MembersService } from '../members.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CountAgeService } from '../../services/count-age.service';
import { Members } from '../../models/members.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss']
})
export class MemberDetailComponent implements OnInit {
  age: string | undefined;
  id!: string;
  member!: Members;

  constructor(
    public service: MembersService,
    public auth: AuthService,
    private countAge: CountAgeService,
    private dialogRef: MatDialogRef<MemberDetailComponent>
  ) {
    this.age = countAge.getAge(service.form.controls['birthdate'].value);
    this.getMember();
  }

  ngOnInit(): void {

  }

  getMember() {
    const id = this.service.form.controls['id'].value
    this.service.getMember(id).subscribe(res => {
      this.member = res as Members
    });

  }

  onClose(): void {
    this.dialogRef.close();
  }

}
