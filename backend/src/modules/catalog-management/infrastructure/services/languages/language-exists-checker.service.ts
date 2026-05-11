import { Inject, Injectable } from '@nestjs/common';
import { ILanguageExistsChecker } from '../../../domain/language-aggregate/services/language-exists-checker.service';
import {
  type ILanguagesQueryRepository,
  LANGUAGES_QUERY_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';
import { LanguageNotFoundException } from '../../../domain/language-aggregate/exceptions/language-not-found.exception';

@Injectable()
export class LanguageExistsChecker implements ILanguageExistsChecker {
  public constructor(
    @Inject(LANGUAGES_QUERY_REPOSITORY)
    private readonly languagesQueryRepository: ILanguagesQueryRepository,
  ) {}

  public async isExists(id: string): Promise<boolean> {
    const language = await this.languagesQueryRepository.findOne(id);

    return !!language;
  }

  public async existsOrThrow(id: string): Promise<void> {
    const exists = await this.languagesQueryRepository.findOne(id);

    if (!exists) {
      throw new LanguageNotFoundException();
    }
  }
}
