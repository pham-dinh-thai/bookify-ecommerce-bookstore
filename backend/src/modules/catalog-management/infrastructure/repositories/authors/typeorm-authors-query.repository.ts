import { Injectable } from '@nestjs/common';
import { IAuthorsQueryRepository } from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorTypeOrm } from '../../entities/author.entity';
import { Repository } from 'typeorm';
import { AuthorReadModel } from '../../../domain/author-aggregate/read-models/author.read-model';
import { AuthorsMapper } from '../../mappers/authors.mapper';

@Injectable()
export class TypeOrmAuthorsQueryRepository implements IAuthorsQueryRepository {
  public constructor(
    @InjectRepository(AuthorTypeOrm)
    private readonly repository: Repository<AuthorTypeOrm>,
  ) {}

  public async findAll(): Promise<AuthorReadModel[]> {
    const authorsTypeOrm = await this.repository.find();

    return authorsTypeOrm
      ? authorsTypeOrm.map((authorTypeOrm) =>
          AuthorsMapper.toReadModel(authorTypeOrm),
        )
      : [];
  }

  public async findOne(id: string): Promise<AuthorReadModel | null> {
    const authorTypeOrm = await this.repository.findOne({ where: { id } });

    return authorTypeOrm ? AuthorsMapper.toReadModel(authorTypeOrm) : null;
  }
}
