import { Inject, Injectable } from '@nestjs/common';
import { ILanguageExistsChecker } from '../../../domain/language-aggregate/services/language-exists-checker.service';
import {
  type ILanguagesQueryRepository,
  LANGUAGES_QUERY_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';

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
}
