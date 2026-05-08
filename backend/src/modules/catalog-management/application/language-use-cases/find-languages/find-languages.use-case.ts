import { Inject, Injectable } from '@nestjs/common';
import {
  type ILanguagesQueryRepository,
  LANGUAGES_QUERY_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';
import {
  CACHE_REPOSITORY,
  type ICacheRepository,
} from '../../../../../shared/cache/domain/cache.repository.interface';
import { LanguageReadModel } from '../../../domain/language-aggregate/read-models/language.read-model';
import {
  LANGUAGE_CACHE_KEYS,
  LANGUAGE_CACHE_TTL,
} from '../language-cache.constants';

@Injectable()
export class FindLanguagesUseCase {
  public constructor(
    @Inject(LANGUAGES_QUERY_REPOSITORY)
    private readonly languagesQueryRepository: ILanguagesQueryRepository,

    @Inject(CACHE_REPOSITORY)
    private readonly cacheRepository: ICacheRepository,
  ) {}

  public async execute(): Promise<LanguageReadModel[]> {
    const cached = await this.cacheRepository.get<LanguageReadModel[]>(
      LANGUAGE_CACHE_KEYS.ALL,
    );
    if (cached) {
      return cached;
    }

    const languages = await this.languagesQueryRepository.findAll();

    await this.cacheRepository.set(
      LANGUAGE_CACHE_KEYS.ALL,
      languages,
      LANGUAGE_CACHE_TTL.ALL,
    );

    return languages;
  }
}
