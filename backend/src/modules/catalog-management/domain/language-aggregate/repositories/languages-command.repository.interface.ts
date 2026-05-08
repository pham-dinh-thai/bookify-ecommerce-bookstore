import { Language } from '../language.aggregate';

export interface ILanguagesCommandRepository {
  findOne(id: string): Promise<Language>;

  save(language: Language): Promise<void>;

  delete(language: Language): Promise<void>;
}

export const LANGUAGES_COMMAND_REPOSITORY = 'ILanguagesCommandRepository';
