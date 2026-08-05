import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/repositories/books-query.repository.interface';
import { BookReadModel } from '../../../domain/read-models/book.read-model';

/**
 * Retrieves a single book by its ID, including covers, authors, and genres.
 *
 * Returns null if the book does not exist.
 */
@Injectable()
export class FindOneBookUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async execute(id: string): Promise<BookReadModel | null> {
    return this.booksQueryRepository.findOne(id);
  }
}
