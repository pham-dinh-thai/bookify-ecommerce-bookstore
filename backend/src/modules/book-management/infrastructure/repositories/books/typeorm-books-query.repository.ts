import { Injectable } from '@nestjs/common';
import { IBooksQueryRepository } from '../../../domain/book-aggregate/repositories/books-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BookTypeOrm } from '../../entities/book.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { BookReadModel } from '../../../domain/book-aggregate/read-models/book.read-model';
import { BooksMapper } from '../../mappers/books.mapper';
import {
  BookStockAlertsReadModel,
  LowStockBookReadModel,
} from '../../../domain/book-aggregate/read-models/book-stock-alerts.read-model';

@Injectable()
export class TypeormBooksQueryRepository implements IBooksQueryRepository {
  public constructor(
    @InjectRepository(BookTypeOrm)
    private readonly repository: Repository<BookTypeOrm>,
  ) {}

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<BookReadModel[]> {
    const query = this.repository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.language', 'language')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.bookAuthors', 'bookAuthors')
      .leftJoinAndSelect('bookAuthors.author', 'author')
      .leftJoinAndSelect('book.bookGenres', 'bookGenres')
      .leftJoinAndSelect('bookGenres.genre', 'genre')
      .leftJoinAndSelect('book.covers', 'covers');

    if (search) {
      query.where('book.title LIKE :search OR author.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    const booksTypeOrm = await query
      .orderBy('book.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return booksTypeOrm.map((book) => BooksMapper.toReadModel(book));
  }

  public async findOne(id: string): Promise<BookReadModel | null> {
    const bookTypeOrm = await this.repository.findOne({
      where: { id },
      relations: [
        'language',
        'publisher',
        'bookAuthors',
        'bookAuthors.author',
        'bookGenres',
        'bookGenres.genre',
        'covers',
      ],
    });

    return bookTypeOrm ? BooksMapper.toReadModel(bookTypeOrm) : null;
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('book');

    if (search) {
      query.where('book.title LIKE :search', { search: `%${search}%` });
    }

    return query.getCount() ?? 0;
  }

  public async findStockAlerts(
    lowStockThreshold: number,
    lowStockBookLimit: number,
  ): Promise<BookStockAlertsReadModel> {
    const summary = await this.repository
      .createQueryBuilder('book')
      .select([
        `SUM(CASE WHEN book.quantity = 0 THEN 1 ELSE 0 END) AS outOfStockCount`,
        `SUM(CASE WHEN book.quantity <= :lowStockThreshold THEN 1 ELSE 0 END) AS lowStockCount`,
      ])
      .setParameter('lowStockThreshold', lowStockThreshold)
      .getRawOne<{
        outOfStockCount?: string | number | null;
        lowStockCount?: string | number | null;
      }>();

    const lowStockBooks = await this.repository
      .createQueryBuilder('book')
      .where('book.quantity <= :lowStockThreshold', { lowStockThreshold })
      .orderBy('book.quantity', 'ASC')
      .addOrderBy('book.updatedAt', 'ASC')
      .take(lowStockBookLimit)
      .getMany();

    return new BookStockAlertsReadModel(
      Number(summary?.outOfStockCount) || 0,
      Number(summary?.lowStockCount) || 0,
      lowStockThreshold,
      lowStockBooks.map(
        (book) =>
          new LowStockBookReadModel(
            book.id,
            book.isbn,
            book.title,
            book.quantity,
          ),
      ),
    );
  }

  private createBookReadQuery() {
    return this.repository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.language', 'language')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .leftJoinAndSelect('book.bookAuthors', 'bookAuthors')
      .leftJoinAndSelect('bookAuthors.author', 'author')
      .leftJoinAndSelect('book.bookGenres', 'bookGenres')
      .leftJoinAndSelect('bookGenres.genre', 'genre')
      .leftJoinAndSelect('book.covers', 'covers');
  }
}
