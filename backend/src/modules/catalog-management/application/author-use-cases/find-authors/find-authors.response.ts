import { AuthorReadModel } from '../../../domain/author-aggregate/read-models/author.read-model';

export class FindAuthorsResponse {
  constructor(
    public readonly authors: AuthorReadModel[],
    public readonly total: number,
  ) {}
}
