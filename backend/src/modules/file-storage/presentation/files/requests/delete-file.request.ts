import { IsNotEmpty, IsString } from 'class-validator';
import { IDeleteFileRequest } from '../../../application/file-use-cases/delete-file/delete-file.request';

export class DeleteFileRequest implements IDeleteFileRequest {
  @IsString()
  @IsNotEmpty()
  public fileUrl!: string;
}
