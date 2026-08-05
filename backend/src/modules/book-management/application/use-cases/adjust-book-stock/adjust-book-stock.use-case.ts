import { Inject, Injectable } from '@nestjs/common';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/repositories/books-command.repository.interface';
import { IAdjustBookStockRequest } from './adjust-book-stock.request';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

/**
 * Adjusts book inventory to a specific quantity.
 *
 * Business Logic: Administrators or Warehouse Staffs use this use case after a physical stocktake
 * when the actual count does not match the system records (due to damaged goods,
 * loss, or data entry errors). Unlike import stock use-case (which adds 'n' units),
 * this use case sets the inventory directly to the actual counted figure.
 *
 * Every adjustment is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful addition to ensure clients see the latest data.
 */
@Injectable()
export class AdjustBookStockUseCase {
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
    request: IAdjustBookStockRequest,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(id);

    book.adjustQuantity(request.quantity);

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.updateQuantity(
        book.getId(),
        book.getQuantity(),
      );

      await this.auditLogCommandRepository.write(
        'ADJUST_BOOK_STOCK',
        performedBy,
        'book-management',
        'books',
        {
          adjustQuantity: request.quantity,
          book,
        },
      );
    });

    await this.cacheRepository.delByPattern('books:*');
    await this.cacheRepository.delByPattern('shop-collections:*');
  }
}
