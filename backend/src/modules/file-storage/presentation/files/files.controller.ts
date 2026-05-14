import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../application/file-use-cases/upload-file/upload-file.use-case';
import { UploadFileRequest } from '../../application/file-use-cases/upload-file/upload-file.request';
import { UploadFileResponse } from '../../application/file-use-cases/upload-file/upload-file.response';
import { DeleteFileRequest } from './requests/delete-file.request';
import { DeleteFileUseCase } from '../../application/file-use-cases/delete-file/delete-file.use-case';

@Controller('files')
export class FilesController {
  public constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  public async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    const response = await this.uploadFileUseCase.execute(
      new UploadFileRequest(file),
    );

    return response;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteFile(@Body() request: DeleteFileRequest): Promise<void> {
    await this.deleteFileUseCase.execute(request);
  }
}
