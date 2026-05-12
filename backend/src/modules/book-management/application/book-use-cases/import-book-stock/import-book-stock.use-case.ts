import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import { IImportBookStockRequest } from './import-book-stock.request';

@Injectable()
export class ImportBookStockUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

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
      await this.booksCommandRepository.save(book);

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
  }
}
