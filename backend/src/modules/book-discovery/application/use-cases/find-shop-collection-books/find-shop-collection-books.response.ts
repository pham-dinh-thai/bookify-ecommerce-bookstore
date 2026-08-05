import { BookReadModel } from '../../../domain/read-models/book.read-model';

export class ShopCollectionResponse {
  public constructor(
    public readonly books: BookReadModel[],
    public readonly total: number,
  ) {}
}
