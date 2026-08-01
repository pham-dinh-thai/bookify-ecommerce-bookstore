import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookTypeOrm } from '../../../book-management/infrastructure/entities/book.entity';
import type { IToolService, ProductSearchResult } from '../../application/ports/tool-service.interface';

const STOP_WORDS = new Set([
  'những', 'cuốn', 'sách', 'của', 'và', 'có', 'trên', 'tìm', 'giúp',
  'the', 'a', 'an', 'of', 'by', 'for', 'on', 'in', 'at', 'with', 'from',
  'list', 'show', 'tell', 'about', 'any', 'are', 'is', 'books', 'book',
]);

const NEW_BOOK_WORDS = new Set(['mới', 'new', 'mới về', 'vừa về']);
const BESTSELLER_WORDS = new Set(['bán chạy', 'best', 'best seller', 'bestseller', 'bestselling', 'hot', 'nổi bật']);

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
    const lower = query.toLowerCase();

    if (BESTSELLER_WORDS.has(lower) || [...BESTSELLER_WORDS].some((w) => lower.includes(w))) {
      return this.getBestsellers(limit);
    }

    if (NEW_BOOK_WORDS.has(lower) || [...NEW_BOOK_WORDS].some((w) => lower.includes(w))) {
      return this.getNewBooks(limit);
    }

    return this.searchByTerms(query, limit);
  }

  private async getNewBooks(limit: number): Promise<ProductSearchResult[]> {
    const books = await this.bookRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return this.enrichWithAuthors(books);
  }

  private async getBestsellers(limit: number): Promise<ProductSearchResult[]> {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('order_items', 'oi', 'oi.productId = book.id')
      .select('book.id', 'id')
      .addSelect('SUM(oi.quantity)', 'sold')
      .groupBy('book.id')
      .orderBy('sold', 'DESC')
      .addOrderBy('book.createdAt', 'ASC')
      .take(limit)
      .getRawMany<{ id: string }>();

    if (books.length === 0) return [];

    const ids = books.map((b) => b.id);
    const fullBooks = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.id IN (:...ids)', { ids })
      .orderBy('book.createdAt', 'ASC')
      .getMany();

    return this.enrichWithAuthors(fullBooks);
  }

  private async searchByTerms(
    query: string,
    limit: number,
  ): Promise<ProductSearchResult[]> {
    const terms = query
      .toLowerCase()
      .split(/[\s,;]+/)
      .filter((term) => term.length > 1 && !STOP_WORDS.has(term))
      .slice(0, 4);

    if (terms.length === 0) return [];

    const conditions = terms
      .map((_, i) => `(book.title LIKE :t${i} OR book.isbn LIKE :t${i} OR author.name LIKE :t${i})`)
      .join(' OR ');

    const params: Record<string, string> = {};
    terms.forEach((term, i) => {
      params[`t${i}`] = `%${term}%`;
    });

    const books = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoin('book.bookAuthors', 'ba')
      .leftJoin('ba.author', 'author')
      .where(conditions, params)
      .take(limit)
      .getMany();

    return this.enrichWithAuthors(books);
  }

  private async enrichWithAuthors(books: BookTypeOrm[]): Promise<ProductSearchResult[]> {
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
