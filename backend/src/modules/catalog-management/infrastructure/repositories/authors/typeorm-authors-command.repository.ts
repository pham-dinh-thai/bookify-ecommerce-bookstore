import { Injectable } from '@nestjs/common';
import { IAuthorsCommandRepository } from '../../../domain/author-aggregate/repositories/authors-command.repository.interface';
import { TypeOrmUnitOfWork } from '../../../../../shared/modules/unit-of-work/infrastructure/typeorm-unit-of-work';
import { Author } from '../../../domain/author-aggregate/author.aggregate';
import { AuthorTypeOrm } from '../../entities/author.entity';
import { AuthorsMapper } from '../../mappers/authors.mapper';
import { AuthorNotFoundException } from '../../../domain/author-aggregate/exceptions/author-not-found.exception';

@Injectable()
export class TypeOrmAuthorsCommandRepository implements IAuthorsCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Author> {
    const authorTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(AuthorTypeOrm, { where: { id } });

    if (!authorTypeOrm) {
      throw new AuthorNotFoundException();
    }

    return AuthorsMapper.toDomain(authorTypeOrm);
  }

  public async save(author: Author): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(AuthorTypeOrm, AuthorsMapper.toTypeOrm(author));
  }

  public async delete(author: Author): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(AuthorTypeOrm, { id: author.getId() });
  }
}
