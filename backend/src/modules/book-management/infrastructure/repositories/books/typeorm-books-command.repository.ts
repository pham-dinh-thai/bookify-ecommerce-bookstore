import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Book } from '../../../domain/book-aggregate/book.aggregate';
import { IBooksCommandRepository } from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { BookTypeOrm } from '../../entities/book.entity';
import { BookCoverTypeOrm } from '../../entities/book-cover.entity';
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
    // Load existing covers to identify orphaned ones (removed from aggregate)
    const existingBook = await this.unitOfWork
      .getManager()
      .findOne(BookTypeOrm, {
        where: { id: book.getId() },
        relations: { covers: true },
      });

    if (existingBook) {
      const existingCoverIds = existingBook.covers.map((c) => c.id);
      const newCoverIds = book.getBookCovers().map((c) => c.getId());
      const orphanedCoverIds = existingCoverIds.filter(
        (id) => !newCoverIds.includes(id),
      );

      // Delete orphaned covers
      if (orphanedCoverIds.length > 0) {
        await this.unitOfWork
          .getManager()
          .delete(BookCoverTypeOrm, { id: In(orphanedCoverIds) });
      }
    }

    await this.unitOfWork
      .getManager()
      .save(BookTypeOrm, BooksMapper.toTypeOrm(book));
  }

  public async delete(id: string): Promise<void> {
    await this.unitOfWork.getManager().delete(BookTypeOrm, { id });
  }
}
