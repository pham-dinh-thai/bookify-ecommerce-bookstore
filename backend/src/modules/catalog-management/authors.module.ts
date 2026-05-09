import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorTypeOrm } from './infrastructure/entities/author.entity';
import { AUTHORS_QUERY_REPOSITORY } from './domain/author-aggregate/repositories/authors-query.repository.interface';
import { TypeOrmAuthorsQueryRepository } from './infrastructure/repositories/authors/typeorm-authors-query.repository';
import { AuthorsController } from './presentation/authors/authors.controller';
import { FindAuthorsUseCase } from './application/author-use-cases/find-authors/find-authors.use-case';
import { FindOneAuthorUseCase } from './application/author-use-cases/find-one-author/find-one-author.use-case';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { AUTHORS_COMMAND_REPOSITORY } from './domain/author-aggregate/repositories/authors-command.repository.interface';
import { TypeOrmAuthorsCommandRepository } from './infrastructure/repositories/authors/typerm-authors-command.repository';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { CreateAuthorUseCase } from './application/author-use-cases/create-author/create-author.use-case';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RenameAuthorUseCase } from './application/author-use-cases/rename-author/rename-author.use-case';
import { DeleteAuthorUseCase } from './application/author-use-cases/delete-author/delete-author.use-case';
import { FindTotalAuthorUseCase } from './application/author-use-cases/find-total-author/find-total-author.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorTypeOrm]),
    UnitOfWorkModule,
    UuidModule,
    AuditLogModule,
    SharedCacheModule,
    AuthenticationModule,
  ],
  providers: [
    FindAuthorsUseCase,
    FindOneAuthorUseCase,
    FindTotalAuthorUseCase,
    CreateAuthorUseCase,
    RenameAuthorUseCase,
    DeleteAuthorUseCase,
    {
      provide: AUTHORS_QUERY_REPOSITORY,
      useClass: TypeOrmAuthorsQueryRepository,
    },
    {
      provide: AUTHORS_COMMAND_REPOSITORY,
      useClass: TypeOrmAuthorsCommandRepository,
    },
  ],
  exports: [AUTHORS_QUERY_REPOSITORY, AUTHORS_COMMAND_REPOSITORY],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
