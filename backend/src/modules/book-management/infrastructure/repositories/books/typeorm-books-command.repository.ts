import { Injectable } from '@nestjs/common';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Book } from '../../../domain/book-aggregate/book.aggregate';
import { IBooksCommandRepository } from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { BookTypeOrm } from '../../entities/book.entity';
import { BooksMapper } from '../../mappers/books.mapper';

@Injectable()
export class TypeormBooksCommandRepository implements IBooksCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Book> {
    const bookTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(BookTypeOrm, {
        where: { id },
        relations: {
          covers: true,
          bookAuthors: { author: true },
          bookGenres: { genre: true },
        },
      });

    if (!bookTypeOrm) {
      throw new Error('Book not found');
    }

    return BooksMapper.toDomain(bookTypeOrm);
  }

  public async save(book: Book): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(BookTypeOrm, BooksMapper.toTypeOrm(book));
  }

  public async delete(id: string): Promise<void> {
    await this.unitOfWork.getManager().delete(BookTypeOrm, { id });
  }
}
