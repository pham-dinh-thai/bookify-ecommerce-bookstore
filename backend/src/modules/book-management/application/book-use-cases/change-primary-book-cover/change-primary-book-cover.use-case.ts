import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { Book } from '../../../domain/book-aggregate/book.aggregate';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/modules/unit-of-work/application/unit-of-work';

@Injectable()
export class ChangePrimaryBookCoverUseCase {
  constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly bookCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(
    id: string,
    coverId: string,
    performedBy: string,
  ): Promise<void> {
    const book: Book = await this.bookCommandRepository.findOne(id);

    book.changePrimaryCover(coverId);

    await this.unitOfWork.execute(async () => {
      await this.bookCommandRepository.save(book);

      await this.auditLogCommandRepository.write(
        'CHANGE_PRIMARY_COVER',
        performedBy,
        'book-management',
        'bookCovers',
        {
          book,
        },
      );
    });

    await this.cacheRepository.delByPattern('books:*');
  }
}
