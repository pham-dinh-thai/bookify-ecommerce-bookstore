import { Module } from '@nestjs/common';
import { GenresModule } from './genres.module';
import { AuthorsModule } from './authors.module';

@Module({
  imports: [GenresModule, AuthorsModule],
})
export class CatalogManagementModule {}
