import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppService } from '../services/app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Members } from '../models/members.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(
    private firebase: AngularFirestore,
    private appService: AppService
  ) { }

  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    rank: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    birthdate: new FormControl('', Validators.required),
    alive: new FormControl('', Validators.required),
  });

  /** for detail and edit data */
  populateForm(member: any) {
    this.form.setValue({
      id: member.id,
      rank: member.rank,
      firstname: member.firstname,
      lastname: member.lastname,
      birthdate: member.birthdate.toDate(),
      address: member.address,
      district: member.district,
      province: member.province,
      zip: member.zip,
      phone: member.phone,
      alive: member.alive
    });
  }

  initializeFormGroup() {
    this.form.reset();
  }

  getMembers() {
    return this.firebase.collection<Members>('members',
      ref => ref.orderBy('created', 'desc'));
  }

  getMember(id: string) {
    return this.firebase.collection('members').doc(id).valueChanges();
  }

  createMember(member: Members) {
    this.addMemberToDatabase({
      rank: member.rank,
      firstname: member.firstname,
      lastname: member.lastname,
      birthdate: member.birthdate,
      address: member.address,
      district: member.district,
      province: member.province,
      zip: member.zip,
      phone: member.phone,
      alive: member.alive,
      created: new Date(),
      updated: new Date(),
    });
  }

  updateMember(member: Members) {
    this.firebase.collection('members').doc(member.id)
      .update({
        ...member, updated: new Date()
      })
      .then(() => {
        this.appService.dialog('Update member successfully.');
      })
      .catch((error) => {
        this.appService.dialog(this.myError(error.code));
      });
  }

  deleteMember(member: Members) {
    // console.log(id);
    this.firebase.doc(`members/${member.id}`)
      .delete()
      .then(() => {
        this.appService.dialog('Delete member successfully.')
      })
      .catch(err => {
        this.appService.dialog(this.myError(err.code));
      })
      .finally();
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

  private addMemberToDatabase(member: Members) {
    this.firebase.collection('members')
      .add(member)
      .then(() => {
        this.appService.dialog('Create member successfully.');
      })
      .catch((error) => {
        this.appService.dialog(error.message);
      })
      .finally();
  }

}
