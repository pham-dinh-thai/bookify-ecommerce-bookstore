import { Module } from '@nestjs/common';
import { GenresModule } from './genres.module';
import { AuthorsModule } from './authors.module';
import { LanguagesModule } from './languages.module';
import { PublishersModule } from './publishers.module';

@Module({
  imports: [GenresModule, AuthorsModule, LanguagesModule, PublishersModule],
})
export class CatalogManagementModule {}
