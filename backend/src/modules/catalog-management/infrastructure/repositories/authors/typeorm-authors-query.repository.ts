import { Injectable } from '@nestjs/common';
import { IAuthorsQueryRepository } from '../../../domain/author-aggregate/repositories/authors-query.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorTypeOrm } from '../../entities/author.entity';
import { Repository } from 'typeorm';
import { AuthorReadModel } from '../../../domain/author-aggregate/read-models/author.read-model';

@Injectable()
export class TypeOrmAuthorsQueryRepository implements IAuthorsQueryRepository {
  public constructor(
    @InjectRepository(AuthorTypeOrm)
    private readonly repository: Repository<AuthorTypeOrm>,
  ) {}

  public async findAll(): Promise<AuthorReadModel[]> {
    const authors = await this.repository.find();

    return authors
      ? authors.map((author) => new AuthorReadModel(author.id, author.name))
      : [];
  }

  public async findOne(id: string): Promise<AuthorReadModel | null> {
    const author = await this.repository.findOne({ where: { id } });

    return author ? new AuthorReadModel(author.id, author.name) : null;
  }
}
