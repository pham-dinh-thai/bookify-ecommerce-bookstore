import { LanguageReadModel } from '../read-models/language.read-model';

export interface ILanguagesQueryRepository {
  findAll(): Promise<LanguageReadModel[]>;

  findOne(id: string): Promise<LanguageReadModel | null>;

  count(): Promise<number>;
}

export const LANGUAGES_QUERY_REPOSITORY = 'ILanguagesQueryRepository';
