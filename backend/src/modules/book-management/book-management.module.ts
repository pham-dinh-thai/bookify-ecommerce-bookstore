import { Module } from '@nestjs/common';
import { BooksController } from './presentation/books/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTypeOrm } from './infrastructure/entities/book.entity';
import { BookCoverTypeOrm } from './infrastructure/entities/book-cover.entity';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { BOOKS_QUERY_REPOSITORY } from './domain/book-aggregate/repositories/books-query.repository.interface';
import { TypeormBooksQueryRepository } from './infrastructure/repositories/books/typeorm-books-query.repository';
import { FindBooksUseCase } from './application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from './application/book-use-cases/find-one-book/find-one-book.use-case';
import { FindTotalBookUseCase } from './application/book-use-cases/find-total-book/find-total-book.use-case';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { CreateBookUseCase } from './application/book-use-cases/create-book/create-book.use-case';
import { TypeormBooksCommandRepository } from './infrastructure/repositories/books/typeorm-books-command.repository';
import { BOOKS_COMMAND_REPOSITORY } from './domain/book-aggregate/repositories/books-command.repository.interface';
import { UpdateBookUseCase } from './application/book-use-cases/update-book/update-book.use-case';
import { AuthorsModule } from '../catalog-management/authors.module';
import { GenresModule } from '../catalog-management/genres.module';
import { BOOK_EXISTS_CHECKER } from './domain/book-aggregate/services/book-exists-checker.service';
import { BookExistsChecker } from './infrastructure/services/books/book-exists-checker.service';
import { PublishersModule } from '../catalog-management/publishers.module';
import { LanguagesModule } from '../catalog-management/languages.module';
import { BOOK_VALIDATION } from './domain/book-aggregate/services/book-validation.service';
import { BookValidation } from './infrastructure/services/books/book-validation.service';
import { AddBookCoverUseCase } from './application/book-use-cases/add-book-cover/add-book-cover.use-case';
import { RemoveBookCoverUseCase } from './application/book-use-cases/remove-book-cover/remove-book-cover.use-case';
import { UpdateBookPriceUseCase } from './application/book-use-cases/update-book-price/update-book-price.use-case';
import { ImportBookStockUseCase } from './application/book-use-cases/import-book-stock/import-book-stock.use-case';
import { AdjustBookStockUseCase } from './application/book-use-cases/adjust-book-stock/adjust-book-stock.use-case';
import { DeleteBookUseCase } from './application/book-use-cases/delete-book/delete-book.use-case';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { ChangePrimaryBookCoverUseCase } from './application/book-use-cases/change-primary-book-cover/change-primary-book-cover.use-case';

@Module({
  controllers: [BooksController],
  imports: [
    TypeOrmModule.forFeature([BookTypeOrm, BookCoverTypeOrm]),
    SharedCacheModule,
    UuidModule,
    AuditLogModule,
    UnitOfWorkModule,
    AuthenticationModule,
    AuthorsModule,
    GenresModule,
    PublishersModule,
    LanguagesModule,
    FileStorageModule,
  ],
  providers: [
    FindBooksUseCase,
    FindOneBookUseCase,
    FindTotalBookUseCase,
    CreateBookUseCase,
    UpdateBookUseCase,
    AddBookCoverUseCase,
    RemoveBookCoverUseCase,
    UpdateBookPriceUseCase,
    ImportBookStockUseCase,
    AdjustBookStockUseCase,
    DeleteBookUseCase,
    ChangePrimaryBookCoverUseCase,
    {
      provide: BOOKS_QUERY_REPOSITORY,
      useClass: TypeormBooksQueryRepository,
    },
    {
      provide: BOOKS_COMMAND_REPOSITORY,
      useClass: TypeormBooksCommandRepository,
    },

    {
      provide: BOOK_EXISTS_CHECKER,
      useClass: BookExistsChecker,
    },
    {
      provide: BOOK_VALIDATION,
      useClass: BookValidation,
    },
  ],
  exports: [BOOKS_QUERY_REPOSITORY, BOOK_EXISTS_CHECKER, BOOK_VALIDATION],
})
export class BookManagementModule {}
