import { Injectable } from '@nestjs/common';
import { IBooksQueryRepository } from '../../../domain/book-aggregate/repositories/books-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BookTypeOrm } from '../../entities/book.entity';
import { Repository } from 'typeorm/repository/Repository.js';
import { In } from 'typeorm';
import { BookReadModel } from '../../../domain/book-aggregate/read-models/book.read-model';
import { BooksMapper } from '../../mappers/books.mapper';
import {
  BookStockAlertsReadModel,
  LowStockBookReadModel,
} from '../../../domain/book-aggregate/read-models/book-stock-alerts.read-model';
import { OrderItemTypeOrm } from '../../../../order/infrastructure/entities/order-item.entity';
import { OrderTypeOrm } from '../../../../order/infrastructure/entities/order.entity';
import { OrderStatus } from '../../../../order/domain/order-aggregate/enums/order-status.enum';

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

  public async findBestSellers(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    const rows = await this.repository
      .createQueryBuilder('book')
      .innerJoin(OrderItemTypeOrm, 'orderItem', 'orderItem.productId = book.id')
      .innerJoin(OrderTypeOrm, 'orderEntity', 'orderEntity.id = orderItem.orderId')
      .select('book.id', 'bookId')
      .addSelect('SUM(orderItem.quantity)', 'unitsSold')
      .where('orderEntity.status != :canceled', {
        canceled: OrderStatus.CANCELED,
      })
      .groupBy('book.id')
      .orderBy('unitsSold', 'DESC')
      .addOrderBy('book.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<{ bookId: string; unitsSold: string | number }>();

    return this.findByIdsInOrder(rows.map((row) => row.bookId));
  }

  public async findNewArrivals(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    const booksTypeOrm = await this.createBookReadQuery()
      .orderBy('book.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return booksTypeOrm.map((book) => BooksMapper.toReadModel(book));
  }

  public async findOnSales(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    void page;
    void limit;

    // Sale metadata is not modeled on books yet, so this endpoint stays empty
    // until sale pricing or a sale flag is added to the catalog.
    return [];
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

  private async findByIdsInOrder(ids: string[]): Promise<BookReadModel[]> {
    if (ids.length === 0) {
      return [];
    }

    const booksTypeOrm = await this.repository.find({
      where: { id: In(ids) },
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
    const booksById = new Map(booksTypeOrm.map((book) => [book.id, book]));

    return ids
      .map((id) => booksById.get(id))
      .filter((book): book is BookTypeOrm => Boolean(book))
      .map((book) => BooksMapper.toReadModel(book));
  }
}
