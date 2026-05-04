import { Module } from '@nestjs/common';
import { GenresController } from './presentation/genres/genres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreTypeOrm } from './infrastructure/entities/genre.entity';
import { GENRES_QUERY_REPOSITORY } from './domain/genre-aggregate/repositories/genres-query.repository.interface';
import { TypeOrmGenresQueryRepository } from './infrastructure/repositories/genres/typeorm-genres-query.repository';
import { FindGenresUseCase } from './application/genre-use-cases/find-genres/find-genres.use-case';
import { FindOneGenreUseCase } from './application/genre-use-cases/find-one-genre/find-one-genre.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([GenreTypeOrm])],
  controllers: [GenresController],
  providers: [
    FindGenresUseCase,
    FindOneGenreUseCase,
    {
      provide: GENRES_QUERY_REPOSITORY,
      useClass: TypeOrmGenresQueryRepository,
    },
  ],
  exports: [GENRES_QUERY_REPOSITORY],
})
export class GenreManagementModule {}
