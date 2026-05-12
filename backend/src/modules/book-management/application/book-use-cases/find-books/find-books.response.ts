import { BookReadModel } from '../../../domain/book-aggregate/read-models/book.read-model';

export class FindBooksResponse {
  public constructor(
    public readonly books: BookReadModel[],
    public readonly total: number,
  ) {}
}
