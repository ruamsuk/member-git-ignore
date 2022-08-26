import { Component, OnInit } from '@angular/core';
import { MembersService } from '../members.service';
import { MatDialogRef } from '@angular/material/dialog';

export interface Rank {
  value: string;
  display: string;
}
export interface Alive {
  value: string;
  display: string;
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  constructor(
    public service: MembersService,
    public dialogRef: MatDialogRef<MembersComponent>
  ) { }

  ranks: Rank[] = [
    { value: 'ร.ต.ต.', display: 'ร.ต.ต.'},
    { value: 'ร.ต.ท.', display: 'ร.ต.ท.'},
    { value: 'ร.ต.อ.', display: 'ร.ต.อ.'},
    { value: 'พ.ต.ต.', display: 'พ.ต.ต.'},
    { value: 'พ.ต.ท.', display: 'พ.ต.ท.'},
    { value: 'พ.ต.อ.', display: 'พ.ต.อ.'},
  ];

  alives: Alive[] = [
    { value: 'ยังมีชีวิต', display: 'ยังมีชีวิต'},
    { value: 'เสียชีวิตแล้ว', display: 'เสียชีวิตแล้ว'}
  ]

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.service.form.valid) {
      if (!this.service.form.get('id')?.value) {
        this.service.createMember(this.service.form.value);

      } else {
        this.service.updateMember(this.service.form.value);
      }
    }
  }

  onClose() {
    this.service.form.reset();
    this.dialogRef.close();
  }

}
