import { Inject, Injectable } from '@nestjs/common';
import {
  BOOKS_QUERY_REPOSITORY,
  type IBooksQueryRepository,
} from '../../../domain/book-aggregate/repositories/books-query.repository.interface';

@Injectable()
export class FindOneBookUseCase {
  public constructor(
    @Inject(BOOKS_QUERY_REPOSITORY)
    private readonly booksQueryRepository: IBooksQueryRepository,
  ) {}

  public async execute(id: string) {
    return this.booksQueryRepository.findOne(id);
  }
}
