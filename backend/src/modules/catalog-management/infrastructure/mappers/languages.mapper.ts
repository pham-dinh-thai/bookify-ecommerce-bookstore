import { Language } from '../../domain/language-aggregate/language.aggregate';
import { LanguageReadModel } from '../../domain/language-aggregate/read-models/language.read-model';
import { LanguageTypeOrm } from '../entities/language.entity';

export class LanguagesMapper {
  public static toDomain(languageTypeOrm: LanguageTypeOrm): Language {
    return Language.fromPersistent(languageTypeOrm.id, languageTypeOrm.name);
  }

  public static toTypeOrm(language: Language): LanguageTypeOrm {
    const languageTypeOrm = new LanguageTypeOrm();

    languageTypeOrm.id = language.getId();
    languageTypeOrm.name = language.getName();

    return languageTypeOrm;
  }

  public static toReadModel(
    languageTypeOrm: LanguageTypeOrm,
  ): LanguageReadModel {
    return new LanguageReadModel(languageTypeOrm.id, languageTypeOrm.name);
  }
}
