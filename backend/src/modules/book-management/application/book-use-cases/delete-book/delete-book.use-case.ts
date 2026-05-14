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
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IStorageProvider,
  STORAGE_PROVIDER,
} from '../../../../file-storage/domain/file-aggregate/storage/storage-provider.interface';

/**
 * Deletes a book from the system.
 *
 * Business logic: Deleting a book also removes all associated covers,
 * authors, and genre associations automatically via database cascade.
 *
 * The book data is captured before deletion and recorded in the audit log for traceability.
 * Book cache is invalidated after a successful addition to ensure clients see the latest data.
 */
@Injectable()
export class DeleteBookUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute(id: string, performedBy: string): Promise<void> {
    const book = await this.booksCommandRepository.findOne(id);

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.delete(id);

      await this.auditLogCommandRepository.write(
        'DELETE_BOOK',
        performedBy,
        'book-management',
        'books',
        {
          book,
        },
      );

      await Promise.all(
        book
          .getBookCovers()
          .map((cover) => this.storageProvider.delete(cover.getUrl())),
      );
    });

    await this.cacheRepository.delByPattern('books:*');
  }
}
