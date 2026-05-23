import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import { ICreateBookRequest } from './create-book.request';
import { Book } from '../../../domain/book-aggregate/book.aggregate';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
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
 * Creates a new book in the system.
 *
 * Business logic: Before creation, all related entities (authors, publisher,
 * genres, language) are validated to exist. The book is then persisted
 * along with its author and genre associations in a single transaction.
 *
 * Every creation is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful addition to ensure clients see the latest data.
 */
@Injectable()
export class CreateBookUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,

    @Inject(BOOK_VALIDATION)
    private readonly bookValidation: IBookValidation,

    @Inject(BOOK_ISBN_DUPLICATE_CHECKER)
    private readonly bookIsbnDuplicateChecker: IBookIsbnDuplicateChecker,
  ) {}

  public async execute(
    request: ICreateBookRequest,
    performedBy: string,
  ): Promise<void> {
    await this.bookValidation.validateBookRelations({
      authorIds: request.authorIds,
      publisherId: request.publisherId,
      genreIds: request.genreIds,
      languageId: request.languageId,
    });

    if (await this.bookIsbnDuplicateChecker.check(request.isbn)) {
      throw new BookIsbnDuplicateException();
    }

    const book = Book.create({
      id: this.uuidGenerator.generate(),
      isbn: request.isbn,
      title: request.title,
      authorIds: request.authorIds,
      publisherId: request.publisherId,
      genreIds: request.genreIds,
      description: request.description,
      originalPrice: request.originalPrice,
      quantity: request.quantity,
      languageId: request.languageId,
      pageCount: request.pageCount,
    });

    const addedCover = book.addCover({
      id: this.uuidGenerator.generate(),
      url: request.coverUrl,
      displayOrder: 1,
    });

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.insert(book);

      await this.booksCommandRepository.insertCover(book.getId(), addedCover);

      await this.auditLogCommandRepository.write(
        'CREATE_BOOK',
        performedBy,
        'book-management',
        'books',
        {
          book,
        },
      );
    });

    await this.cacheRepository.delByPattern('books:*');
  }
}
