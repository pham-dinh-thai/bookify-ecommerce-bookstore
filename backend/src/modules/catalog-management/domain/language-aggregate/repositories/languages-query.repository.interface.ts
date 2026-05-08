import { LanguageReadModel } from '../read-models/language.read-model';

export interface ILanguagesQueryRepository {
  findAll(): Promise<LanguageReadModel[]>;

  findOne(id: string): Promise<LanguageReadModel | null>;
}

export const LANGUAGES_QUERY_REPOSITORY = 'ILanguagesQueryRepository';
