import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/repositories/books-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import { IImportBookStockRequest } from './import-book-stock.request';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';

/**
 * Increases book inventory when new stock arrives.
 *
 * Business logic: Used when a shipment of books is received.
 * Unlike stock adjustment (which sets an exact figure), this adds
 * the received quantity on top of the current inventory.
 *
 * Every import is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful addition to ensure clients see the latest data.
 */
@Injectable()
export class ImportBookStockUseCase {
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
    request: IImportBookStockRequest,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(id);

    book.increaseQuantity(request.quantity);

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.updateQuantity(
        book.getId(),
        book.getQuantity(),
      );

      await this.auditLogCommandRepository.write(
        'IMPORT_BOOK_STOCK',
        performedBy,
        'book-management',
        'books',
        {
          importQuantity: request.quantity,
          book,
        },
      );
    });

    await this.cacheRepository.delByPattern('books:*');
    await this.cacheRepository.delByPattern('shop-collections:*');
  }
}
