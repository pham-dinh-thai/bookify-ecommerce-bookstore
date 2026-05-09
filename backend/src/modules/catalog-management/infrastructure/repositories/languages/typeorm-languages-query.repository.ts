import { Injectable } from '@nestjs/common';
import { ILanguagesQueryRepository } from '../../../domain/language-aggregate/repositories/languages-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageTypeOrm } from '../../entities/language.entity';
import { Repository } from 'typeorm';
import { LanguageReadModel } from '../../../domain/language-aggregate/read-models/language.read-model';
import { LanguagesMapper } from '../../mappers/languages.mapper';

@Injectable()
export class TypeOrmLanguagesQueryRepository implements ILanguagesQueryRepository {
  public constructor(
    @InjectRepository(LanguageTypeOrm)
    private readonly repository: Repository<LanguageTypeOrm>,
  ) {}

  public async findAll(): Promise<LanguageReadModel[]> {
    const languagesTypeOrm = await this.repository.find();

    return languagesTypeOrm
      ? languagesTypeOrm.map((languageTypeOrm) =>
          LanguagesMapper.toReadModel(languageTypeOrm),
        )
      : [];
  }

  public async findOne(id: string): Promise<LanguageReadModel | null> {
    const languageTypeOrm = await this.repository.findOne({ where: { id } });

    return languageTypeOrm
      ? LanguagesMapper.toReadModel(languageTypeOrm)
      : null;
  }

  public async count(): Promise<number> {
    return this.repository.count();
  }
}
