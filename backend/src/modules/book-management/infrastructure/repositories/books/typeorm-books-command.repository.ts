import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Book } from '../../../domain/book.aggregate';
import { IBooksCommandRepository } from '../../../domain/repositories/books-command.repository.interface';
import { BookTypeOrm } from '../../entities/book.entity';
import { BookCoverTypeOrm } from '../../entities/book-cover.entity';
import { BooksMapper } from '../../mappers/books.mapper';
import { BookAuthorTypeOrm } from '../../entities/book-author.entity';
import { BookGenreTypeOrm } from '../../entities/book-genre.entity';
import { BookNotFoundException } from '../../../domain/exceptions/book-not-found.exception';
import { BookCover } from '../../../domain/entities/book-cover/book-cover.entity';

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
      throw new BookNotFoundException();
    }

    return BooksMapper.toDomain(bookTypeOrm);
  }

  public async insert(book: Book): Promise<void> {
    const manager = this.unitOfWork.getManager();

    const bookTypeOrm = BooksMapper.toTypeOrm(book);

    await manager.insert(BookTypeOrm, bookTypeOrm);

    await this.syncAuthors(manager, book);

    await this.syncGenres(manager, book);
  }

  /**
   * Updates book details except price, discount, and quantity,
   * which have dedicated methods.
   */
  public async update(book: Book): Promise<void> {
    const manager = this.unitOfWork.getManager();

    const bookTypeOrm = BooksMapper.toTypeOrm(book);

    await manager.update(BookTypeOrm, bookTypeOrm.id, {
      isbn: bookTypeOrm.isbn,
      title: bookTypeOrm.title,
      publisherId: bookTypeOrm.publisherId,
      description: bookTypeOrm.description,
      languageId: bookTypeOrm.languageId,
      pageCount: bookTypeOrm.pageCount,
    });

    // Delete existing relations and re-insert them, as it's simpler than calculating diffs.
    // This is acceptable for most cases since books typically don't have a large number of authors or genres.
    await manager.delete(BookAuthorTypeOrm, {
      bookId: book.getId(),
    });

    await manager.delete(BookGenreTypeOrm, {
      bookId: book.getId(),
    });

    await this.syncAuthors(manager, book);

    await this.syncGenres(manager, book);
  }

  public async save(book: Book): Promise<void> {
    const manager = this.unitOfWork.getManager();

    await manager.save(BookTypeOrm, BooksMapper.toTypeOrm(book));
  }

  public async updateQuantity(id: string, quantity: number): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(BookTypeOrm, { id }, { quantity });
  }

  public async updateDiscountPercentage(
    id: string,
    discountPercentage: number,
  ): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(BookTypeOrm, { id }, { discountPercentage });
  }

  public async updatePrice(id: string, price: number): Promise<void> {
    await this.unitOfWork
      .getManager()
      .update(BookTypeOrm, { id }, { originalPrice: price });
  }

  /**
   * Delete book and let cascade delete take care of related entities like covers and relations.
   * This is simpler than manually deleting related entities,
   * and ensures all related data is properly cleaned up without needing to worry about missing any relations.
   */
  public async delete(id: string): Promise<void> {
    await this.unitOfWork.getManager().delete(BookTypeOrm, { id });
  }

  public async insertCover(bookId: string, cover: BookCover): Promise<void> {
    const manager = this.unitOfWork.getManager();

    const bookCoverTypeOrm = new BookCoverTypeOrm();

    bookCoverTypeOrm.id = cover.getId();
    bookCoverTypeOrm.bookId = bookId;
    bookCoverTypeOrm.url = cover.getUrl();
    bookCoverTypeOrm.isPrimary = cover.getIsPrimary();
    bookCoverTypeOrm.displayOrder = cover.getDisplayOrder();

    await manager.insert(BookCoverTypeOrm, bookCoverTypeOrm);
  }

  public async removeCover(bookId: string, coverId: string): Promise<void> {
    await this.unitOfWork.getManager().delete(BookCoverTypeOrm, {
      id: coverId,
      bookId,
    });
  }

  public async promoteCoverToPrimary(
    bookId: string,
    coverId: string,
  ): Promise<void> {
    const manager = this.unitOfWork.getManager();

    await manager.update(BookCoverTypeOrm, { bookId }, { isPrimary: false });

    await manager.update(
      BookCoverTypeOrm,
      { id: coverId, bookId },
      { isPrimary: true },
    );
  }

  private async syncAuthors(manager: EntityManager, book: Book): Promise<void> {
    await manager.insert(
      BookAuthorTypeOrm,
      book.getAuthorIds().map((authorId) => ({
        bookId: book.getId(),
        authorId,
      })),
    );
  }

  private async syncGenres(manager: EntityManager, book: Book): Promise<void> {
    await manager.insert(
      BookGenreTypeOrm,
      book.getGenreIds().map((genreId) => ({
        bookId: book.getId(),
        genreId,
      })),
    );
  }
}
