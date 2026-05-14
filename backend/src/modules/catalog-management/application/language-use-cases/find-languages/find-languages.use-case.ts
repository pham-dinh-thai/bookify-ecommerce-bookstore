import { Inject, Injectable } from '@nestjs/common';
import {
  type ILanguagesQueryRepository,
  LANGUAGES_QUERY_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/modules/cache/domain/cache.repository.interface';
import { LanguageReadModel } from '../../../domain/language-aggregate/read-models/language.read-model';
import {
  LANGUAGE_CACHE_KEYS,
  LANGUAGE_CACHE_TTL,
} from '../language-cache.constants';
import { FindLanguagesResponse } from './find-languages.response';

@Injectable()
export class FindLanguagesUseCase {
  public constructor(
    @Inject(LANGUAGES_QUERY_REPOSITORY)
    private readonly languagesQueryRepository: ILanguagesQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(
    page: number,
    limit: number,
    search?: string,
  ): Promise<FindLanguagesResponse> {
    const cacheKey = LANGUAGE_CACHE_KEYS.PAGE(page, limit, search);

    const cached =
      await this.cacheRepository.get<FindLanguagesResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const languages = await this.languagesQueryRepository.findAll(
      page,
      limit,
      search,
    );
    const total = await this.languagesQueryRepository.count(search);

    const response = new FindLanguagesResponse(languages, total);

    await this.cacheRepository.set(cacheKey, response, LANGUAGE_CACHE_TTL.ALL);

    return response;
  }
}
