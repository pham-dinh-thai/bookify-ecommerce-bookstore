export class UploadFileRequest {
  constructor(public readonly file: Express.Multer.File) {}
}
