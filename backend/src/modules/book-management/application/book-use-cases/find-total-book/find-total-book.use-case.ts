import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/book-aggregate/repositories/books-query.repository.interface';

/**
 * Returns the total number of books in the system.
 *
 * Used for dashboard statistics.
 */
@Injectable()
export class FindTotalBookUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = await this.booksQueryRepository.count();

    return total;
  }
}
