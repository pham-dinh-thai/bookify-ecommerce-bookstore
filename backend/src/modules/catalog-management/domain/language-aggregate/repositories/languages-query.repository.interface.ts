import { LanguageReadModel } from '../read-models/language.read-model';

export interface ILanguagesQueryRepository {
  findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<LanguageReadModel[]>;

  findOne(id: string): Promise<LanguageReadModel | null>;

  count(search?: string): Promise<number>;
}

export const LANGUAGES_QUERY_REPOSITORY = 'ILanguagesQueryRepository';
