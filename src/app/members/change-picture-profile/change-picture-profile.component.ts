import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUpload } from '../../models/file-upload';
import { UtilService } from '../../services/util.service';
import { percentage } from '@angular/fire/storage';

@Component({
  selector: 'app-change-picture-profile',
  templateUrl: './change-picture-profile.component.html',
  styleUrls: ['./change-picture-profile.component.scss']
})
export class ChangePictureProfileComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  constructor(
    private uploadService: FileUploadService,
    private app: UtilService
  ) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload)
          .subscribe({
            next: (percentage) => {
              this.percentage = Math.round(percentage ? percentage : 0);
            },
            error: err => {
              this.app.warn(err.message);
            }
          });
          // .subscribe((percentage) => {
          //   this.percentage = Math.round(percentage ? percentage : 0);
          // })
        // this.uploadService.pushFileToStorage(this.currentFileUpload).pipe().subscribe(percentage => {
        //   this.percentage = Math.round(percentage ? percentage : 0);
        // }, error => {});
        //   .subscribe(percenttage => {
        //       this.percentage = Math.round(percenttage ? percenttage : 0);
        //     },
        //     error => {
        //       this.app.warn(error.message);
        //     });
      }
    }
  }



}
