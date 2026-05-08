import { Inject, Injectable } from '@nestjs/common';
import {
  type ILanguagesQueryRepository,
  LANGUAGES_QUERY_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';
import { LanguageReadModel } from '../../../domain/language-aggregate/read-models/language.read-model';

@Injectable()
export class FindOneLanguageUseCase {
  public constructor(
    @Inject(LANGUAGES_QUERY_REPOSITORY)
    private readonly languagesQueryRepository: ILanguagesQueryRepository,
  ) {}

  public async execute(id: string): Promise<LanguageReadModel | null> {
    const language = await this.languagesQueryRepository.findOne(id);

    return language;
  }
}
