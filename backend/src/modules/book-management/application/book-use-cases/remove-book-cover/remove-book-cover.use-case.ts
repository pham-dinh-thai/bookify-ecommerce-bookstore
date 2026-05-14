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
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IStorageProvider,
  STORAGE_PROVIDER,
} from '../../../../file-storage/domain/file-aggregate/storage/storage-provider.interface';

/**
 * Removes a cover image from a book.
 *
 * Business logic: Primary covers cannot be removed to ensure
 * every book always has a displayable cover. To remove the primary cover,
 * another cover must be promoted to primary first.
 *
 * Every removal is recorded in the audit log for traceability.
 * Book cache is invalidated after a successful removal to ensure clients see the latest data.
 */
@Injectable()
export class RemoveBookCoverUseCase {
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

  public async execute(
    bookId: string,
    id: string,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(bookId);

    const removedCover = book.removeCover(id);

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.removeCover(
        bookId,
        removedCover.getId(),
      );

      await this.auditLogCommandRepository.write(
        'REMOVE_COVER',
        performedBy,
        'book-management',
        'bookCovers',
        {
          book,
          removedCover,
        },
      );

      await this.storageProvider.delete(removedCover.getUrl());
    });

    await this.cacheRepository.delByPattern('books:*');
  }
}
