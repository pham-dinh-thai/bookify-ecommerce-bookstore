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

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<AuthorReadModel[]> {
    const query = this.repository.createQueryBuilder('author');

    if (search) {
      query.where('author.name LIKE :search', { search: `%${search}%` });
    }

    const authorsTypeOrm = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return authorsTypeOrm.map((authorTypeOrm) =>
      AuthorsMapper.toReadModel(authorTypeOrm),
    );
  }

  public async findOne(id: string): Promise<AuthorReadModel | null> {
    const authorTypeOrm = await this.repository.findOne({ where: { id } });

    return authorTypeOrm ? AuthorsMapper.toReadModel(authorTypeOrm) : null;
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('author');

    if (search) {
      query.where('author.name LIKE :search', { search: `%${search}%` });
    }

    return await query.getCount();
  }
}
