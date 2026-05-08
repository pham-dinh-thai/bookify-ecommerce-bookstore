import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorTypeOrm } from './infrastructure/entities/author.entity';
import { AUTHORS_QUERY_REPOSITORY } from './domain/author-aggregate/repositories/authors-query.repository.interface';
import { TypeOrmAuthorsQueryRepository } from './infrastructure/repositories/authors/typeorm-authors-query.repository';
import { AuthorsController } from './presentation/authors/authors.controller';
import { FindAuthorsUseCase } from './application/author-use-cases/find-authors/find-authors.use-case';
import { FindOneAuthorUseCase } from './application/author-use-cases/find-one-author/find-one-author.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorTypeOrm])],
  providers: [
    FindAuthorsUseCase,
    FindOneAuthorUseCase,
    {
      provide: AUTHORS_QUERY_REPOSITORY,
      useClass: TypeOrmAuthorsQueryRepository,
    },
  ],
  exports: [AUTHORS_QUERY_REPOSITORY],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
