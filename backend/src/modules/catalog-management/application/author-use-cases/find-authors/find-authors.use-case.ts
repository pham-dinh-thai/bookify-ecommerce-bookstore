import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORS_QUERY_REPOSITORY,
  type IAuthorsQueryRepository,
} from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import { AuthorReadModel } from '../../../domain/author-aggregate/read-models/author.read-model';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { AUTHOR_CACHE_KEYS, AUTHOR_CACHE_TTL } from '../author-cache.constants';

@Injectable()
export class FindAuthorsUseCase {
  public constructor(
    @Inject(AUTHORS_QUERY_REPOSITORY)
    private readonly authorsQueryRepository: IAuthorsQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(): Promise<AuthorReadModel[]> {
    const cached = await this.cacheRepository.get<AuthorReadModel[]>(
      AUTHOR_CACHE_KEYS.ALL,
    );
    if (cached) {
      return cached;
    }

    const authors = await this.authorsQueryRepository.findAll();

    await this.cacheRepository.set(
      AUTHOR_CACHE_KEYS.ALL,
      authors,
      AUTHOR_CACHE_TTL.ALL,
    );

    return authors;
  }
}
