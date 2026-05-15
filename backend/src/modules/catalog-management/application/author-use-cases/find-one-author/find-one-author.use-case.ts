import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import { AuthorReadModel } from '../../../domain/author-aggregate/read-models/author.read-model';

/**
 * Retrieves a single author by ID, or null if not found.
 */
@Injectable()
export class FindOneAuthorUseCase {
  public constructor(
    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,
  ) {}

  public async execute(id: string): Promise<AuthorReadModel | null> {
    const author = await this.authorsQueryRepository.findOne(id);

    return author;
  }
}
