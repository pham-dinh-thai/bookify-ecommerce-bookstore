import { Module } from '@nestjs/common';
import { FilesController } from './presentation/files/files.controller';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { STORAGE_PROVIDER } from './domain/file-aggregate/storage/storage-provider.interface';
import { LocalStorageProvider } from './infrastructure/storage/local-storage.provider';
import { UploadFileUseCase } from './application/file-use-cases/upload-file/upload-file.use-case';

@Module({
  controllers: [FilesController],
  imports: [UuidModule],
  providers: [
    UploadFileUseCase,
    {
      provide: STORAGE_PROVIDER,
      useClass: LocalStorageProvider,
    },
  ],
  exports: [STORAGE_PROVIDER],
})
export class FileStorageModule {}
