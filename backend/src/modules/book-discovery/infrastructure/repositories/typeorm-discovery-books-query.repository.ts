import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository.js';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';
import { BookGenreTypeOrm } from '../../../book-management/infrastructure/entities/book-genre.entity';
import { OrderItemTypeOrm } from '../../../order/infrastructure/entities/order-item.entity';
import { OrderTypeOrm } from '../../../order/infrastructure/entities/order.entity';
import { OrderStatus } from '../../../order/domain/order-aggregate/enums/order-status.enum';
import { BookReadModel } from '../../domain/read-models/book.read-model';
import { IDiscoveryBooksQueryRepository } from '../../domain/repositories/books-query.repository.interface';
import { BooksMapper } from '../mappers/books.mapper';

@Injectable()
export class TypeOrmDiscoveryBooksQueryRepository implements IDiscoveryBooksQueryRepository {
  public constructor(
    @InjectRepository(BookTypeOrm)
    private readonly repository: Repository<BookTypeOrm>,
  ) {}

  public async findBestSellers(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    const rows = await this.repository
      .createQueryBuilder('book')
      .innerJoin(OrderItemTypeOrm, 'orderItem', 'orderItem.productId = book.id')
      .innerJoin(
        OrderTypeOrm,
        'orderEntity',
        'orderEntity.id = orderItem.orderId',
      )
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
      .getRawMany<{ bookId: string }>();

    return this.findByIdsInOrder(rows.map((row) => row.bookId));
  }

  public async findNewArrivals(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    const rows = await this.repository
      .createQueryBuilder('book')
      .select('book.id', 'bookId')
      .orderBy('book.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<{ bookId: string }>();

    return this.findByIdsInOrder(rows.map((row) => row.bookId));
  }

  public async findOnSales(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    const rows = await this.repository
      .createQueryBuilder('book')
      .select('book.id', 'bookId')
      .where('book.discountPercentage > 0')
      .orderBy('book.discountPercentage', 'DESC')
      .addOrderBy('book.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<{ bookId: string }>();

    return this.findByIdsInOrder(rows.map((row) => row.bookId));
  }

  public async findByGenres(
    genreIds: string[],
    excludedBookIds: string[],
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    if (genreIds.length === 0) {
      return [];
    }

    const query = this.repository
      .createQueryBuilder('book')
      .innerJoin(BookGenreTypeOrm, 'bookGenre', 'bookGenre.bookId = book.id')
      .select('book.id', 'bookId')
      .where('bookGenre.genreId IN (:...genreIds)', { genreIds })
      .andWhere('book.quantity > 0');

    if (excludedBookIds.length > 0) {
      query.andWhere('book.id NOT IN (:...excludedBookIds)', {
        excludedBookIds,
      });
    }

    const rows = await query
      .distinct(true)
      .orderBy('book.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<{ bookId: string }>();

    return this.findByIdsInOrder(rows.map((row) => row.bookId));
  }

  public async findRandom(
    page: number,
    limit: number,
  ): Promise<BookReadModel[]> {
    const rows = await this.repository
      .createQueryBuilder('book')
      .select('book.id', 'bookId')
      .where('book.quantity > 0')
      .orderBy('RAND()')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany<{ bookId: string }>();

    return this.findByIdsInOrder(rows.map((row) => row.bookId));
  }

  private async findByIdsInOrder(ids: string[]): Promise<BookReadModel[]> {
    if (ids.length === 0) {
      return [];
    }

    const booksTypeOrm = await this.createBookReadQuery()
      .whereInIds(ids)
      .getMany();

    const booksByIndex = new Map(booksTypeOrm.map((book) => [book.id, book]));

    return ids
      .map((id) => booksByIndex.get(id))
      .filter((book): book is BookTypeOrm => Boolean(book))
      .map((book) => BooksMapper.toReadModel(BooksMapper.toDomain(book)));
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
