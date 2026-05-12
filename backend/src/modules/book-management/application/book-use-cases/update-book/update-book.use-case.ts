import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { IUpdateBookRequest } from './update-book.request';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  BOOK_AUTHORS_COMMAND_REPOSITORY,
  type IBookAuthorsCommandRepository,
} from '../../../domain/book-aggregate/entities/book-author/repositories/book-authors-command.repository.interface';
import {
  BOOK_GENRES_COMMAND_REPOSITORY,
  type IBookGenresCommandRepository,
} from '../../../domain/book-aggregate/entities/book-genre/repositories/book-genres-command.repository.interface';
import { BookAuthor } from '../../../domain/book-aggregate/entities/book-author/book-author.entity';
import { BookGenre } from '../../../domain/book-aggregate/entities/book-genre/book-genre.entity';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  BOOK_EXISTS_CHECKER,
  type IBookExistsChecker,
} from '../../../domain/book-aggregate/services/book-exists-checker.service';
import { BookNotFoundException } from '../../../domain/book-aggregate/exceptions/book-not-found.exception';
import {
  BOOK_VALIDATION,
  type IBookValidation,
} from '../../../domain/book-aggregate/services/book-validation.service';

/**
 * Updates an existing book's details.
 *
 * Business logic: All related entities (authors, publisher, genres, language)
 * are validated to exist before updating. Author and genre associations
 * are replaced entirely (delete all, re-insert) rather than diffed,
 * keeping the logic simple at the cost of extra queries.
 *
 * Every update is recorded in the audit log for traceability.
 */
@Injectable()
export class UpdateBookUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(BOOK_AUTHORS_COMMAND_REPOSITORY)
    private readonly bookAuthorsCommandRepository: IBookAuthorsCommandRepository,

    @Inject(BOOK_GENRES_COMMAND_REPOSITORY)
    private readonly bookGenresCommandRepository: IBookGenresCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(BOOK_EXISTS_CHECKER)
    private readonly bookExistsChecker: IBookExistsChecker,

    @Inject(BOOK_VALIDATION)
    private readonly bookValidation: IBookValidation,
  ) {}

  public async execute(
    id: string,
    request: IUpdateBookRequest,
    performedBy: string,
  ): Promise<void> {
    const isBookExists = await this.bookExistsChecker.isExists(id);
    if (!isBookExists) {
      throw new BookNotFoundException();
    }

    await this.bookValidation.validateBookRelations({
      authorIds: request.authorIds,
      publisherId: request.publisherId,
      genreIds: request.genreIds,
      languageId: request.languageId,
    });

    const book = await this.booksCommandRepository.findOne(id);

    book.updateDetails({
      isbn: request.isbn,
      title: request.title,
      authorIds: request.authorIds,
      publisherId: request.publisherId,
      genreIds: request.genreIds,
      description: request.description,
      languageId: request.languageId,
      pageCount: request.pageCount,
    });

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.save(book);

      await this.bookAuthorsCommandRepository.deleteByBookId(book.getId());
      await Promise.all(
        book
          .getAuthorIds()
          .map((authorId) => this.addBookAuthor(book.getId(), authorId)),
      );

      await this.bookGenresCommandRepository.deleteByBookId(book.getId());
      await Promise.all(
        book
          .getGenreIds()
          .map((genreId) => this.addBookGenre(book.getId(), genreId)),
      );

      await this.auditLogCommandRepository.write(
        'UPDATE_BOOK',
        performedBy,
        'book-management',
        'books',
        { book },
      );
    });
  }

  private async addBookAuthor(bookId: string, authorId: string): Promise<void> {
    await this.bookAuthorsCommandRepository.save(
      BookAuthor.create({
        bookId,
        authorId,
      }),
    );
  }

  private async addBookGenre(bookId: string, genreId: string): Promise<void> {
    await this.bookGenresCommandRepository.save(
      BookGenre.create({
        bookId,
        genreId,
      }),
    );
  }
}
