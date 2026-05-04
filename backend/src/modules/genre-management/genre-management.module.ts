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

@Module({
  imports: [
    TypeOrmModule.forFeature([GenreTypeOrm]),
    UnitOfWorkModule,
    UuidModule,
    AuditLogModule,
    RolesModule,
    AuthenticationModule,
  ],
  controllers: [GenresController],
  providers: [
    FindGenresUseCase,
    FindOneGenreUseCase,
    CreateGenreUseCase,
    {
      provide: GENRES_QUERY_REPOSITORY,
      useClass: TypeOrmGenresQueryRepository,
    },
    {
      provide: GENRES_COMMAND_REPOSITORY,
      useClass: TypeOrmGenresCommandRepository,
    },
  ],
  exports: [GENRES_QUERY_REPOSITORY, GENRES_COMMAND_REPOSITORY],
})
export class GenreManagementModule {}
