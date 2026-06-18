import { Inject } from '@nestjs/common';
import { IAddBookCoverRequest } from './add-book-cover.request';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/modules/uuid/domain/uuid-generator.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

/**
 * Adds a new cover image to an existing book.
 *
 * Business logic: If the book has no covers yet, the first cover
 * is automatically set as primary. Duplicate primary covers and
 * duplicate display orders are rejected by the domain.
 *
 * Every addition is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful addition to ensure clients see the latest data.
 */
export class AddBookCoverUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    bookId: string,
    request: IAddBookCoverRequest,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(bookId);

    const addedCover = book.addCover({
      id: this.uuidGenerator.generate(),
      url: request.url,
      displayOrder: request.displayOrder,
    });

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.insertCover(book.getId(), addedCover);

      await this.auditLogCommandRepository.write(
        'ADD_COVER',
        performedBy,
        'book-management',
        'bookCovers',
        { book },
      );
    });

    await this.cacheRepository.delByPattern('books:*');
    await this.cacheRepository.delByPattern('shop-collections:*');
  }
}
