import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../application/file-use-cases/upload-file/upload-file.use-case';
import { UploadFileRequest } from '../../application/file-use-cases/upload-file/upload-file.request';
import { UploadFileResponse } from '../../application/file-use-cases/upload-file/upload-file.response';
import { DeleteFileRequest } from './requests/delete-file.request';
import { DeleteFileUseCase } from '../../application/file-use-cases/delete-file/delete-file.use-case';
import { RoleGuard } from '../../../../shared/http/guards/role.guard';
import { Roles } from '../../../../shared/http/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('admin', 'staff')
  public async deleteFile(@Body() request: DeleteFileRequest): Promise<void> {
    await this.deleteFileUseCase.execute(request);
  }
}
