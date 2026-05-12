import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import {
  BOOK_COVERS_COMMAND_REPOSITORY,
  type IBookCoversCommandRepository,
} from '../../../domain/book-aggregate/entities/book-cover/repositories/book-covers-command.repository.interface';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';

/**
 * Removes a cover image from a book.
 *
 * Business logic: Primary covers cannot be removed to ensure
 * every book always has a displayable cover. To remove the primary cover,
 * another cover must be promoted to primary first.
 *
 * Every removal is recorded in the audit log for traceability.
 */
@Injectable()
export class RemoveBookCoverUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(BOOK_COVERS_COMMAND_REPOSITORY)
    private readonly bookCoversCommandRepository: IBookCoversCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    bookId: string,
    id: string,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(bookId);

    const bookCover = await this.bookCoversCommandRepository.findOne(id);

    bookCover.ensureCanBeRemoved();

    await this.unitOfWork.execute(async () => {
      await this.bookCoversCommandRepository.delete(bookCover.getId());

      await this.auditLogCommandRepository.write(
        'REMOVE_COVER',
        performedBy,
        'book-management',
        'bookCovers',
        {
          bookId,
          bookCover,
        },
      );
    });
  }
}
