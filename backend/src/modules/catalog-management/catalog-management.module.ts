import { Module } from '@nestjs/common';
import { GenresModule } from './genres.module';

@Module({
  imports: [GenresModule],
})
export class CatalogManagementModule {}
