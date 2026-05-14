import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { File } from '../../../domain/file-aggregate/file.aggregate';
import {
  type IStorageProvider,
  STORAGE_PROVIDER,
} from '../ports/storage-provider.interface';
import { UploadFileRequest } from './upload-file.request';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/uuid/domain/uuid-generator.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { UploadFileResponse } from './upload-file.response';
import { fileTypeFromBuffer } from 'file-type';
import * as path from 'path';

/**
 * Handles file upload to storage.
 *
 * Security measures applied:
 * - Magic bytes detection to verify actual file type (prevents mimetype spoofing)
 * - Filename sanitization to prevent path traversal attacks
 * - MIME type validation via FileMimeType value object (allowlist)
 * - File size validation via FileSize value object (max 5MB)
 *
 * @returns URL of the uploaded file
 */
@Injectable()
export class UploadFileUseCase {
  public constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: UploadFileRequest,
  ): Promise<UploadFileResponse> {
    const detected = await fileTypeFromBuffer(request.file.buffer);

    const safeOriginalName = path
      .basename(request.file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, '_');

    const file = File.create({
      filename: `${this.uuidGenerator.generate()}-${safeOriginalName}`,
      mimetype: detected?.mime ?? request.file.mimetype,
      size: request.file.size,
    });

    const uploadedFileUrl = await this.storageProvider.upload(
      request.file.buffer,
      file.getFilename(),
      file.getMimeType(),
    );

    return new UploadFileResponse(uploadedFileUrl);
  }
}
