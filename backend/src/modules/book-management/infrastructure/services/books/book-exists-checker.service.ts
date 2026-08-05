import { Inject } from '@nestjs/common';
import { IBookExistsChecker } from '../../../domain/services/book-exists-checker.service';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/repositories/books-query.repository.interface';

export class BookExistsChecker implements IBookExistsChecker {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async isExists(id: any): Promise<boolean> {
    const book = await this.booksQueryRepository.findOne(id);

    return !!book;
  }
}
