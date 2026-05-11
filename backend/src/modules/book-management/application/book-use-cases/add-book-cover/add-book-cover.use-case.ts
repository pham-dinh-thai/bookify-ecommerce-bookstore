import { Inject } from '@nestjs/common';
import { IAddBookCoverRequest } from './add-book-cover.request';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { BookCover } from '../../../domain/book-aggregate/entities/book-cover/book-cover.entity';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/uuid/domain/uuid-generator.interface';
import {
  BOOK_COVERS_COMMAND_REPOSITORY,
  type IBookCoversCommandRepository,
} from '../../../domain/book-aggregate/entities/book-cover/repositories/book-covers-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';

export class AddBookCoverUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(BOOK_COVERS_COMMAND_REPOSITORY)
    private readonly bookCoversCommandRepository: IBookCoversCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  public async execute(
    id: string,
    request: IAddBookCoverRequest,
    performedBy: string,
  ): Promise<void> {
    const book = await this.booksCommandRepository.findOne(id);

    const hasPrimaryCover = book
      .getBookCovers()
      .some((cover) => cover.getIsPrimary());

    const bookCover = BookCover.create({
      id: this.uuidGenerator.generate(),
      url: request.url,
      isPrimary: hasPrimaryCover ? false : true,
      displayOrder: request.displayOrder,
    });

    book.addCover(bookCover);

    await this.unitOfWork.execute(async () => {
      await this.bookCoversCommandRepository.save(book.getId(), bookCover);

      await this.auditLogCommandRepository.write(
        'ADD_COVER',
        performedBy,
        'book-management',
        'bookCovers',
        { bookId: book.getId(), bookCover },
      );
    });
  }
}
