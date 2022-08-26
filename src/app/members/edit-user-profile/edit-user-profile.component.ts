import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { AngularFireList } from '@angular/fire/compat/database';
import { FileUpload } from '../../models/file-upload';
import { UtilService } from '../../services/util.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  fileUploads?: any[];
  imageUrl?: { key: string | null }[];

  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  fileSelect = false;
  inputValue = '';
  userPhoto: string | null | undefined = '';

  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: AngularFireList<FileUpload>;

  constructor(
    public service: AuthService,
    public dialogRef: MatDialogRef<EditUserProfileComponent>,
    private uploadService: FileUploadService,
    private util: UtilService
  ) {
  }

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles(1);
    this.getUserPhoto();
  }

  private getUserPhoto() {
    const user = this.service.getAuth();
    this.userPhoto = user?.photoURL;
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    this.fileSelect = true;
  }

  upload() {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload)
          .subscribe(percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
            this.getFile();
          }, error => {
            this.util.warn(error.message);
          });
      }
    }
  }

  onSubmit() {
    this.service.upDateUser({
      displayName: this.service.newForm.value.displayName,
      email: this.service.newForm.value.email,
      password: this.service.newForm.value.password,
      photoURL: this.inputValue ? this.inputValue : this.userPhoto
    });
    this.onClose();
  }

  getFile() {
    this.uploadService.getFiles(1).snapshotChanges()
      .pipe(
        map((change: any[]) =>
          change.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
      for (let key in fileUploads) {
        if (fileUploads.hasOwnProperty(key)) {
          const value = fileUploads[key];
          if (value.url) {
            // @ts-ignore
            document.getElementById('myInput').value = value.url;
            this.inputValue = value.url;
          }
        }
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
