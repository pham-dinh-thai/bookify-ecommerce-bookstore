import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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
    const books: BookTypeOrm[] = await this.bookRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { isbn: Like(`%${query}%`) },
      ],
      take: limit,
    });

    return books.map((book) => ({
      id: book.id,
      title: book.title,
      description: book.description,
      originalPrice: Number(book.originalPrice),
      discountPercentage: Number(book.discountPercentage),
    }));
  }
}
