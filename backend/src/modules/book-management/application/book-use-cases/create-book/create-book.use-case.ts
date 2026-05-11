import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_COMMAND_REPOSITORY,
  type IBooksCommandRepository,
} from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import {
  type IUnitOfWork,
  UNIT_OF_WORK,
} from '../../../../../shared/unit-of-work/application/unit-of-work';
import {
  type IUuidGenerator,
  UUID_GENERATOR,
} from '../../../../../shared/uuid/domain/uuid-generator.interface';
import { ICreateBookRequest } from './create-book.request';
import { Book } from '../../../domain/book-aggregate/book.aggregate';
import {
  BOOK_AUTHORS_COMMAND_REPOSITORY,
  type IBookAuthorsCommandRepository,
} from '../../../domain/book-aggregate/entities/book-author/repositories/book-authors-command.repository.interface';
import { BookAuthor } from '../../../domain/book-aggregate/entities/book-author/book-author.entity';
import {
  BOOK_GENRES_COMMAND_REPOSITORY,
  type IBookGenresCommandRepository,
} from '../../../domain/book-aggregate/entities/book-genre/repositories/book-genres-command.repository.interface';
import { BookGenre } from '../../../domain/book-aggregate/entities/book-genre/book-genre.entity';
import {
  AUDIT_LOG_COMMAND_REPOSITORY,
  type IAuditLogCommandRepository,
} from '../../../../audit-log/domain/audit-log-aggregate/repositories/audit-log-command.repository.interface';

@Injectable()
export class CreateBookUseCase {
  public constructor(
    @Inject(BOOKS_COMMAND_REPOSITORY)
    private readonly booksCommandRepository: IBooksCommandRepository,

    @Inject(BOOK_AUTHORS_COMMAND_REPOSITORY)
    private readonly bookAuthorsCommandRepository: IBookAuthorsCommandRepository,

    @Inject(BOOK_GENRES_COMMAND_REPOSITORY)
    private readonly bookGenresCommandRepository: IBookGenresCommandRepository,

    @Inject(AUDIT_LOG_COMMAND_REPOSITORY)
    private readonly auditLogCommandRepository: IAuditLogCommandRepository,

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: IUuidGenerator,
  ) {}

  public async execute(
    request: ICreateBookRequest,
    performedBy: string,
  ): Promise<void> {
    const book = Book.create({
      id: this.uuidGenerator.generate(),
      isbn: request.isbn,
      title: request.title,
      authorIds: request.authorIds,
      publisherId: request.publisherId,
      genreIds: request.genreIds,
      description: request.description,
      originalPrice: request.originalPrice,
      quantity: request.quantity,
      bookCovers: [],
      languageId: request.languageId,
      pageCount: request.pageCount,
    });

    await this.unitOfWork.execute(async () => {
      await this.booksCommandRepository.save(book);

      await Promise.all(
        book
          .getAuthorIds()
          .map((authorId) => this.addBookAuthor(book.getId(), authorId)),
      );

      await Promise.all(
        book
          .getGenreIds()
          .map((genreId) => this.addBookGenre(book.getId(), genreId)),
      );

      await this.auditLogCommandRepository.write(
        'CREATE_BOOK',
        performedBy,
        'book-management',
        'books',
        {
          book,
        },
      );
    });
  }

  private async addBookAuthor(bookId: string, authorId: string): Promise<void> {
    await this.bookAuthorsCommandRepository.save(
      BookAuthor.create({
        bookId,
        authorId,
      }),
    );
  }

  private async addBookGenre(bookId: string, genreId: string): Promise<void> {
    await this.bookGenresCommandRepository.save(
      BookGenre.create({
        bookId,
        genreId,
      }),
    );
  }
}
