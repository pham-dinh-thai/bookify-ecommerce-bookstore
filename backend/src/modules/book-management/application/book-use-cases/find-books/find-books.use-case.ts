import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/book-aggregate/repositories/books-query.repository.interface';

@Injectable()
export class FindBooksUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async execute() {
    return this.booksQueryRepository.findAll();
  }
}
