export class FileUpload {
  key: string | undefined;
  name: string | undefined;
  url: string | undefined;
  file: File | undefined;

  constructor(file: File) {
    this.file = file;
  }
}
