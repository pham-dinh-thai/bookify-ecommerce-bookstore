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
import { TypeormBooksQueryRepository } from './infrastructure/repositories/books/typeorm-books-query.repository';
import { FindBooksUseCase } from './application/book-use-cases/find-books/find-books.use-case';
import { FindOneBookUseCase } from './application/book-use-cases/find-one-book/find-one-book.use-case';
import { FindTotalBookUseCase } from './application/book-use-cases/find-total-book/find-total-book.use-case';
import { UnitOfWorkModule } from '../../shared/unit-of-work/unit-of-work.module';
import { CreateBookUseCase } from './application/book-use-cases/create-book/create-book.use-case';
import { TypeormBooksCommandRepository } from './infrastructure/repositories/books/typeorm-books-command.repository';
import { BOOKS_COMMAND_REPOSITORY } from './domain/book-aggregate/repositories/books-command.repository.interface';
import { BOOK_AUTHORS_COMMAND_REPOSITORY } from './domain/book-aggregate/entities/book-author/repositories/book-authors-command.repository.interface';
import { TypeormBookAuthorsCommandRepository } from './infrastructure/repositories/book-authors/typeorm-book-authors-command.repository';
import { BOOK_GENRES_COMMAND_REPOSITORY } from './domain/book-aggregate/entities/book-genre/repositories/book-genres-command.repository.interface';
import { TypeormBookGenresCommandRepository } from './infrastructure/repositories/book-genres/typeorm-book-genres-command.repository';
import { UpdateBookUseCase } from './application/book-use-cases/update-book/update-book.use-case';
import { AuthorsModule } from '../catalog-management/authors.module';
import { GenresModule } from '../catalog-management/genres.module';
import { BOOK_EXISTS_CHECKER } from './domain/book-aggregate/services/book-exists-checker.service';
import { BookExistsChecker } from './infrastructure/services/books/book-exists-checker.service';
import { PublishersModule } from '../catalog-management/publishers.module';
import { LanguagesModule } from '../catalog-management/languages.module';
import { BOOK_VALIDATION } from './domain/book-aggregate/services/book-validation.service';
import { BookValidation } from './infrastructure/services/books/book-validation.service';
import { BOOK_COVERS_COMMAND_REPOSITORY } from './domain/book-aggregate/entities/book-cover/repositories/book-covers-command.repository.interface';
import { TypeOrmBookCoversCommandRepository } from './infrastructure/repositories/book-covers/typeorm-book-covers-command.repository';
import { AddBookCoverUseCase } from './application/book-use-cases/add-book-cover/add-book-cover.use-case';
import { RemoveBookCoverUseCase } from './application/book-use-cases/remove-book-cover/remove-book-cover.use-case';
import { UpdateBookPriceUseCase } from './application/book-use-cases/update-book-price/update-book-price.use-case';
import { ImportBookStockUseCase } from './application/book-use-cases/import-book-stock/import-book-stock.use-case';
import { AdjustBookStockUseCase } from './application/book-use-cases/adjust-book-stock/adjust-book-stock.use-case';
import { DeleteBookUseCase } from './application/book-use-cases/delete-book/delete-book.use-case';

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
    {
      provide: BOOKS_QUERY_REPOSITORY,
      useClass: TypeormBooksQueryRepository,
    },
    {
      provide: BOOKS_COMMAND_REPOSITORY,
      useClass: TypeormBooksCommandRepository,
    },
    {
      provide: BOOK_AUTHORS_COMMAND_REPOSITORY,
      useClass: TypeormBookAuthorsCommandRepository,
    },
    {
      provide: BOOK_GENRES_COMMAND_REPOSITORY,
      useClass: TypeormBookGenresCommandRepository,
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
      provide: BOOK_COVERS_COMMAND_REPOSITORY,
      useClass: TypeOrmBookCoversCommandRepository,
    },
  ],
  exports: [BOOKS_QUERY_REPOSITORY, BOOK_EXISTS_CHECKER, BOOK_VALIDATION],
})
export class BookManagementModule {}
