import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../application/file-use-cases/upload-file/upload-file.use-case';
import { UploadFileRequest } from '../../application/file-use-cases/upload-file/upload-file.request';
import { UploadFileResponse } from '../../application/file-use-cases/upload-file/upload-file.response';

@Controller('files')
export class FilesController {
  public constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    const response = await this.uploadFileUseCase.execute(
      new UploadFileRequest(file),
    );

    return response;
  }
}
