import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import { AuthorReadModel } from '../../../domain/author-aggregate/read-models/author.read-model';

@Injectable()
export class FindAuthorsUseCase {
  public constructor(
    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,
  ) {}

  public async execute(): Promise<AuthorReadModel[]> {
    const authors = await this.authorsQueryRepository.findAll();

    return authors;
  }
}
