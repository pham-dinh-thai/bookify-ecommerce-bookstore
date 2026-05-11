import { Inject } from '@nestjs/common';
import { IAuthorExistsChecker } from '../../../domain/author-aggregate/services/author-exists-checker.service';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import { AuthorNotFoundException } from '../../../domain/author-aggregate/exceptions/author-not-found.exception';

export class AuthorExistsChecker implements IAuthorExistsChecker {
  public constructor(
    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,
  ) {}

  public async isExists(id: string): Promise<boolean> {
    const author = await this.authorsQueryRepository.findOne(id);

    return !!author;
  }

  public async existsOrThrow(id: string): Promise<void> {
    const exists = await this.isExists(id);

    if (!exists) {
      throw new AuthorNotFoundException();
    }
  }
}
