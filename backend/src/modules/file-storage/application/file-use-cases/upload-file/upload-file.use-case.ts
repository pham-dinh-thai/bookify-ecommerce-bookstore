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
    const file = File.create({
      filename: `${this.uuidGenerator.generate()}-${request.file.originalname}`,
      mimetype: request.file.mimetype,
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
