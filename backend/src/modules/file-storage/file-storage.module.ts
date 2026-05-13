import { Module } from '@nestjs/common';
import { FilesController } from './presentation/files/files.controller';

@Module({
  controllers: [FilesController]
})
export class FileStorageModule {}
