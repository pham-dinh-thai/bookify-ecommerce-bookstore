import { LanguageReadModel } from '../../../domain/language-aggregate/read-models/language.read-model';

export class FindLanguagesResponse {
  public constructor(
    public readonly languages: LanguageReadModel[],
    public readonly total: number,
  ) {}
}
