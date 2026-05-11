import { Module } from '@nestjs/common';
import { BooksController } from './presentation/books/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTypeOrm } from './infrastructure/entities/book.entity';
import { BookCoverTypeOrm } from './infrastructure/entities/book-cover.entity';
import { SharedCacheModule } from '../../shared/cache/cache.module';
import { UuidModule } from '../../shared/uuid/uuid.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BOOKS_QUERY_REPOSITORY } from './domain/book-aggregate/repositories/books-query.repository.interface';
import { TypeormBooksQueryRepository } from './infrastructure/repositories/typeorm-books-query.repository';
import { FindBooksUseCase } from './application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from './application/book-use-cases/find-one-book/find-one-book.use-case';

@Module({
  controllers: [BooksController],
  imports: [
    TypeOrmModule.forFeature([BookTypeOrm, BookCoverTypeOrm]),
    SharedCacheModule,
    UuidModule,
    AuditLogModule,
    AuthenticationModule,
  ],
  providers: [
    FindBooksUseCase,
    FindOneBookUseCase,
    {
      provide: BOOKS_QUERY_REPOSITORY,
      useClass: TypeormBooksQueryRepository,
    },
  ],
  exports: [BOOKS_QUERY_REPOSITORY],
})
export class BookManagementModule {}
