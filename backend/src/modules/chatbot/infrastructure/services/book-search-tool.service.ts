import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';
import type { IToolService, ProductSearchResult } from '../../application/ports/tool-service.interface';

@Injectable()
export class BookSearchToolService implements IToolService {
  public constructor(
    @InjectRepository(BookTypeOrm)
    private readonly bookRepository: Repository<BookTypeOrm>,
  ) {}

  public async searchProducts(
    query: string,
    limit: number = 5,
  ): Promise<ProductSearchResult[]> {
    const qb = this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.bookAuthors', 'ba')
      .leftJoin('ba.author', 'author')
      .where(
        '(book.title LIKE :q OR book.isbn LIKE :q OR author.name LIKE :q)',
        { q: `%${query}%` },
      )
      .take(limit);

    const books = await qb.getMany();

    const bookIds = books.map((b) => b.id);

    if (bookIds.length === 0) return [];

    const authorsByBook = await this.bookRepository
      .createQueryBuilder('book')
      .innerJoin('book.bookAuthors', 'ba')
      .innerJoin('ba.author', 'author')
      .where('book.id IN (:...ids)', { ids: bookIds })
      .select('book.id', 'bookId')
      .addSelect('author.name', 'authorName')
      .getRawMany<{ bookId: string; authorName: string }>();

    const authorMap = new Map<string, string[]>();
    for (const row of authorsByBook) {
      const existing = authorMap.get(row.bookId) ?? [];
      existing.push(row.authorName);
      authorMap.set(row.bookId, existing);
    }

    return books.map((book) => ({
      id: book.id,
      title: book.title,
      authors: authorMap.get(book.id) ?? [],
      description: book.description,
      originalPrice: Number(book.originalPrice),
      discountPercentage: Number(book.discountPercentage),
    }));
  }
}
