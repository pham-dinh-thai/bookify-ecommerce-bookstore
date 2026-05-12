import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/book-aggregate/repositories/books-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { FindBooksResponse } from './find-books.response';
import { BOOK_CACHE_KEYS, BOOK_CACHE_TTL } from '../book-cache.constants';

@Injectable()
export class FindBooksUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FindBooksResponse> {
    const cacheKey = BOOK_CACHE_KEYS.PAGE(page, limit, search);

    const cached = await this.cacheRepository.get<FindBooksResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const books = await this.booksQueryRepository.findAll(page, limit, search);
    const total = await this.booksQueryRepository.count(search);

    const response = new FindBooksResponse(books, total);

    await this.cacheRepository.set(cacheKey, response, BOOK_CACHE_TTL.ALL);

    return response;
  }
}
