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

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<LanguageReadModel[]> {
    const query = this.repository.createQueryBuilder('language');

    if (search) {
      query.where('language.name LIKE :search', { search: `%${search}%` });
    }

    const languagesTypeOrm = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return languagesTypeOrm.map((languageTypeOrm) =>
      LanguagesMapper.toReadModel(languageTypeOrm),
    );
  }

  public async findOne(id: string): Promise<LanguageReadModel | null> {
    const languageTypeOrm = await this.repository.findOne({ where: { id } });

    return languageTypeOrm
      ? LanguagesMapper.toReadModel(languageTypeOrm)
      : null;
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('language');

    if (search) {
      query.where('language.name LIKE :search', { search: `%${search}%` });
    }

    return await query.getCount();
  }
}
