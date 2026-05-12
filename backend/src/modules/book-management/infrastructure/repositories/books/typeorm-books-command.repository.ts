import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Book } from '../../../domain/book-aggregate/book.aggregate';
import { IBooksCommandRepository } from '../../../domain/book-aggregate/repositories/books-command.repository.interface';
import { BookTypeOrm } from '../../entities/book.entity';
import { BookCoverTypeOrm } from '../../entities/book-cover.entity';
import { BooksMapper } from '../../mappers/books.mapper';
import { BookAuthorTypeOrm } from '../../entities/book-author.entity';
import { BookGenreTypeOrm } from '../../entities/book-genre.entity';

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
    const manager = this.unitOfWork.getManager();

    const existingBook = await manager.findOne(BookTypeOrm, {
      where: { id: book.getId() },
      relations: { covers: true },
    });

    if (existingBook) {
      const existingCoverIds = existingBook.covers.map((c) => c.id);

      const newCoverIds = book.getBookCovers().map((c) => c.getId());

      const orphanedCoverIds = existingCoverIds.filter(
        (id) => !newCoverIds.includes(id),
      );

      if (orphanedCoverIds.length > 0) {
        await manager.delete(BookCoverTypeOrm, {
          id: In(orphanedCoverIds),
        });
      }
    }

    await manager.delete(BookAuthorTypeOrm, {
      bookId: book.getId(),
    });

    await manager.delete(BookGenreTypeOrm, {
      bookId: book.getId(),
    });

    await manager.save(BookTypeOrm, BooksMapper.toTypeOrm(book));
  }

  public async delete(id: string): Promise<void> {
    await this.unitOfWork.getManager().delete(BookTypeOrm, { id });
  }
}
