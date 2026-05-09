import { Inject, Injectable } from '@nestjs/common';
import {
  type ILanguagesQueryRepository,
  LANGUAGES_QUERY_REPOSITORY,
} from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';

@Injectable()
export class FindTotalLanguageUseCase {
  public constructor(
    @Inject(LANGUAGES_QUERY_REPOSITORY)
    private readonly languagesQueryRepository: ILanguagesQueryRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = this.languagesQueryRepository.count();

    return total;
  }
}
