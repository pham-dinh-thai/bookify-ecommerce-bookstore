import { Inject, Injectable } from '@nestjs/common';
import { IUpdateBookDiscountPercentageRequest } from './update-book-discount-percentage.request';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/repositories/books-command.repository.interface';
import { Book } from '../../../domain/book.aggregate';
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
import {
  EVENT_DISPATCHER,
  type IEventDispatcher,
} from '../../../../../shared/domain/event-dispatcher.interface';

@Injectable()
export class UpdateBookDiscountPercentageUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(EVENT_DISPATCHER)
    private readonly eventDispatcher: IEventDispatcher,
  ) {}

  public async execute(
    request: IUpdateBookDiscountPercentageRequest,
    id: string,
    performedBy: string,
  ): Promise<void> {
    const book: Book = await this.booksCommandRepository.findOne(id);

    book.updateDiscountPercentage(request.discountPercentage);

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.updateDiscountPercentage(
        book.getId(),
        book.getDiscountPercentage(),
      );

      await this.auditLogCommandRepository.write(
        'UPDATE_BOOK_DISCOUNT_PERCENTAGE',
        performedBy,
        'book-management',
        'books',
        {
          book,
        },
      );
    });

    await this.eventDispatcher.dispatch(book.getDomainEvents());
    book.clearDomainEvents();

    await this.cacheRepository.delByPattern('books:*');
    await this.cacheRepository.delByPattern('shop-collections:*');
  }
}
