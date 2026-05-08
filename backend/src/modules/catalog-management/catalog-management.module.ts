import { Module } from '@nestjs/common';
import { GenresModule } from './genres.module';
import { AuthorsModule } from './authors.module';
import { LanguagesModule } from './languages.module';

@Module({
  imports: [GenresModule, AuthorsModule, LanguagesModule],
})
export class CatalogManagementModule {}
