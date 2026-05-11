import { Injectable } from '@nestjs/common';
import { IBookAuthorsCommandRepository } from '../../../domain/book-aggregate/entities/book-author/repositories/book-authors-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { BookAuthor } from '../../../domain/book-aggregate/entities/book-author/book-author.entity';
import { BookAuthorTypeOrm } from '../../entities/book-author.entity';
import { BookAuthorNotFoundException } from '../../../domain/book-aggregate/entities/book-author/exceptions/book-author-not-found.exception';
import { BookAuthorsMapper } from '../../mappers/book-authors.mapper';

@Injectable()
export class TypeormBookAuthorsCommandRepository implements IBookAuthorsCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(bookId: string, authorId: string): Promise<BookAuthor> {
    const bookAuthorTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(BookAuthorTypeOrm, { where: { bookId, authorId } });

    if (!bookAuthorTypeOrm) {
      throw new BookAuthorNotFoundException();
    }

    return BookAuthorsMapper.toDomain(bookAuthorTypeOrm);
  }

  public async save(bookAuthor: BookAuthor): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(BookAuthorTypeOrm, BookAuthorsMapper.toTypeOrm(bookAuthor));
  }

  public async delete(bookId: string, authorId: string): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(BookAuthorTypeOrm, { bookId, authorId });
  }
}
