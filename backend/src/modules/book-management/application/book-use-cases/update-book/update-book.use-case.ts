import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { IUpdateBookRequest } from './update-book.request';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
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
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  BOOK_ISBN_DUPLICATE_CHECKER,
  type IBookIsbnDuplicateChecker,
} from '../../../domain/book-aggregate/services/book-isbn-duplicate-checker.service';
import { BookIsbnDuplicateException } from '../../../domain/book-aggregate/exceptions/book-isbn-duplicate.exception';

/**
 * Updates an existing book's details.
 *
 * Business logic: All related entities (authors, publisher, genres, language)
 * are validated to exist before updating. Author and genre associations
 * are replaced entirely (delete all, re-insert) rather than diffed,
 * keeping the logic simple at the cost of extra queries.
 *
 * Every update is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful update to ensure clients see the latest data.
 */
@Injectable()
export class UpdateBookUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(BOOK_EXISTS_CHECKER)
    private readonly bookExistsChecker: IBookExistsChecker,

    @Inject(BOOK_VALIDATION)
    private readonly bookValidation: IBookValidation,

    @Inject(BOOK_ISBN_DUPLICATE_CHECKER)
    private readonly bookIsbnDuplicateChecker: IBookIsbnDuplicateChecker,
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

    if (await this.bookIsbnDuplicateChecker.check(request.isbn)) {
      throw new BookIsbnDuplicateException();
    }

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
      await this.booksCommandRepository.update(book);

      await this.auditLogCommandRepository.write(
        'UPDATE_BOOK',
        performedBy,
        'book-management',
        'books',
        { book },
      );
    });

    await this.cacheRepository.delByPattern('books:*');
  }
}
