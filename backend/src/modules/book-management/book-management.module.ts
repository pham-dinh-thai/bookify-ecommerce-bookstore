import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookTypeOrm } from './infrastructure/entities/book.entity';
import { BookCoverTypeOrm } from './infrastructure/entities/book-cover.entity';
import { BooksController } from './presentation/books/books.controller';
import { FindBooksUseCase } from './application/use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from './application/use-cases/find-one-book/find-one-book.use-case';
import { CreateBookUseCase } from './application/use-cases/create-book/create-book.use-case';
import { UpdateBookUseCase } from './application/use-cases/update-book/update-book.use-case';
import { AddBookCoverUseCase } from './application/use-cases/add-book-cover/add-book-cover.use-case';
import { RemoveBookCoverUseCase } from './application/use-cases/remove-book-cover/remove-book-cover.use-case';
import { ChangePrimaryBookCoverUseCase } from './application/use-cases/change-primary-book-cover/change-primary-book-cover.use-case';
import { UpdateBookPriceUseCase } from './application/use-cases/update-book-price/update-book-price.use-case';
import { UpdateBookDiscountPercentageUseCase } from './application/use-cases/update-book-discount-percentage/update-book-discount-percentage.use-case';
import { ImportBookStockUseCase } from './application/use-cases/import-book-stock/import-book-stock.use-case';
import { AdjustBookStockUseCase } from './application/use-cases/adjust-book-stock/adjust-book-stock.use-case';
import { DeleteBookUseCase } from './application/use-cases/delete-book/delete-book.use-case';
import { BOOKS_QUERY_REPOSITORY } from './domain/repositories/books-query.repository.interface';
import { BOOKS_COMMAND_REPOSITORY } from './domain/repositories/books-command.repository.interface';
import { BOOK_EXISTS_CHECKER } from './domain/services/book-exists-checker.service';
import { BOOK_VALIDATION } from './domain/services/book-validation.service';
import { BOOK_ISBN_DUPLICATE_CHECKER } from './domain/services/book-isbn-duplicate-checker.service';
import { TypeormBooksQueryRepository } from './infrastructure/repositories/books/typeorm-books-query.repository';
import { TypeormBooksCommandRepository } from './infrastructure/repositories/books/typeorm-books-command.repository';
import { BookExistsChecker } from './infrastructure/services/books/book-exists-checker.service';
import { BookValidation } from './infrastructure/services/books/book-validation.service';
import { BookIsbnDuplicateChecker } from './infrastructure/services/books/book-isbn-duplicate-checker.service';
import { SharedCacheModule } from '../../shared/modules/cache/cache.module';
import { UuidModule } from '../../shared/modules/uuid/uuid.module';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { UnitOfWorkModule } from '../../shared/modules/unit-of-work/unit-of-work.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AuthorsModule } from '../catalog-management/authors.module';
import { GenresModule } from '../catalog-management/genres.module';
import { PublishersModule } from '../catalog-management/publishers.module';
import { LanguagesModule } from '../catalog-management/languages.module';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
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
  controllers: [BooksController],
  providers: [
    FindBooksUseCase,
    FindOneBookUseCase,
    CreateBookUseCase,
    UpdateBookUseCase,
    AddBookCoverUseCase,
    RemoveBookCoverUseCase,
    ChangePrimaryBookCoverUseCase,
    UpdateBookPriceUseCase,
    UpdateBookDiscountPercentageUseCase,
    ImportBookStockUseCase,
    AdjustBookStockUseCase,
    DeleteBookUseCase,
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
    {
      provide: BOOK_ISBN_DUPLICATE_CHECKER,
      useClass: BookIsbnDuplicateChecker,
    },
  ],
  exports: [BOOKS_QUERY_REPOSITORY, BOOKS_COMMAND_REPOSITORY],
})
export class BookManagementModule {}
