import { Module } from '@nestjs/common';
import { GenresController } from './presentation/genres/genres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreTypeOrm } from './infrastructure/entities/genre.entity';
import { GENRES_QUERY_REPOSITORY } from './domain/genre-aggregate/repositories/genres-query.repository.interface';
import { TypeOrmGenresQueryRepository } from './infrastructure/repositories/genres/typeorm-genres-query.repository';
import { FindGenresUseCase } from './application/genre-use-cases/find-genres/find-genres.use-case';
import { FindOneGenreUseCase } from './application/genre-use-cases/find-one-genre/find-one-genre.use-case';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { GENRES_COMMAND_REPOSITORY } from './domain/genre-aggregate/repositories/genres-command.repository.interface';
import { TypeOrmGenresCommandRepository } from './infrastructure/repositories/genres/typeorm-genres-command.repository';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { CreateGenreUseCase } from './application/genre-use-cases/create-genre/create-genre.use-case';
import { RolesModule } from '../authorization/roles.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RenameGenreUseCase } from './application/genre-use-cases/rename-genre/rename-genre.use-case';
import { DeleteGenreUseCase } from './application/genre-use-cases/delete-genre/delete-genre.use-case';
import { FindTotalGenreUseCase } from './application/genre-use-cases/find-total-genre/find-total-genre.use-case';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { GENRE_EXISTS_CHECKER } from './domain/genre-aggregate/services/genre-exists-checker.service';
import { GenreExistsChecker } from './infrastructure/services/genres/genre-exists-checker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreTypeOrm]),
    UnitOfWorkModule,
    UuidModule,
    AuditLogModule,
    RolesModule,
    AuthenticationModule,
    SharedCacheModule,
  ],
  controllers: [GenresController],
  providers: [
    FindGenresUseCase,
    FindOneGenreUseCase,
    FindTotalGenreUseCase,
    CreateGenreUseCase,
    RenameGenreUseCase,
    DeleteGenreUseCase,
    {
      provide: GENRES_QUERY_REPOSITORY,
      useClass: TypeOrmGenresQueryRepository,
    },
    {
      provide: GENRES_COMMAND_REPOSITORY,
      useClass: TypeOrmGenresCommandRepository,
    },
    {
      provide: GENRE_EXISTS_CHECKER,
      useClass: GenreExistsChecker,
    },
  ],
  exports: [
    GENRES_QUERY_REPOSITORY,
    GENRES_COMMAND_REPOSITORY,
    GENRE_EXISTS_CHECKER,
  ],
})
export class GenresModule {}
