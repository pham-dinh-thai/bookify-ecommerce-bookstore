import { Module } from '@nestjs/common';
import { GenresController } from './presentation/genres/genres.controller';

@Module({
  controllers: [GenresController]
})
export class GenreManagementModule {}
