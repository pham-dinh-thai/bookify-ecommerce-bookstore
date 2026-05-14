import { Inject, Injectable } from '@nestjs/common';
import {
  type IStorageProvider,
  STORAGE_PROVIDER,
} from '../../../domain/file-aggregate/storage/storage-provider.interface';
import { IDeleteFileRequest } from './delete-file.request';

/**
 * Handles file deletion from storage.
 *
 * Note: This use case does not validate whether the file exists before deletion.
 * If the file is not found, the storage provider is responsible for handling the error.
 *
 * Intended to be called after removing a BookCover from the database
 * to ensure the corresponding file is cleaned up from storage.
 */
@Injectable()
export class DeleteFileUseCase {
  public constructor(
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute(request: IDeleteFileRequest): Promise<void> {
    if (!request.fileUrl) {
      return; // No URL provided, nothing to delete
    }

    await this.storageProvider.delete(request.fileUrl);
  }
}
