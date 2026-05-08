import { Injectable } from '@nestjs/common';
import { ILanguagesCommandRepository } from '../../../domain/language-aggregate/repositories/languages-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Language } from '../../../domain/language-aggregate/language.aggregate';
import { LanguagesMapper } from '../../mappers/languages.mapper';
import { LanguageTypeOrm } from '../../entities/language.entity';
import { LanguageNotFoundException } from '../../../domain/language-aggregate/exceptions/language-not-found.exception';

@Injectable()
export class TypeOrmLanguagesCommandRepository implements ILanguagesCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Language> {
    const languageTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(LanguageTypeOrm, { where: { id } });

    if (!languageTypeOrm) {
      throw new LanguageNotFoundException();
    }

    return LanguagesMapper.toDomain(languageTypeOrm);
  }

  public async save(language: Language): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(LanguageTypeOrm, LanguagesMapper.toTypeOrm(language));
  }

  public async delete(language: Language): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(LanguageTypeOrm, { id: language.getId() });
  }
}
