import { Inject, Injectable } from '@nestjs/common';
import { IUpdateBookPriceRequest } from './update-book-price.request';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';

/**
 * Updates the price of an existing book.
 *
 * Business logic: Price is managed separately from other book details
 * as it changes more frequently and may require different authorization.
 * Price must be a positive value, enforced by the BookPrice value object.
 *
 * Every price change is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful price update to ensure clients see the latest data.
 */
@Injectable()
export class UpdateBookPriceUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    id: string,
    request: IUpdateBookPriceRequest,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(id);

    book.updatePrice(request.price);

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.save(book);

      await this.auditLogCommandRepository.write(
        'UPDATE_BOOK_PRICE',
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
