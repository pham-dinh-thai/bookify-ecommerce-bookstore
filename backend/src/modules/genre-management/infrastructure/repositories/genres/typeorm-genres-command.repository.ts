import { Injectable } from '@nestjs/common';
import { IGenresCommandRepository } from '../../../domain/genre-aggregate/repositories/genres-command.repository.interface';
import { Genre } from '../../../domain/genre-aggregate/genre.aggregate';
import { TypeOrmUnitOfWork } from '../../../../../shared/unit-of-work/infrastructure/typeorm-unit-of-work';
import { GenreTypeOrm } from '../../entities/genre.entity';
import { GenreNotFoundException } from '../../../domain/genre-aggregate/exceptions/genre-not-found.exception';
import { GenresMapper } from '../../mappers/genres.mapper';

@Injectable()
export class TypeOrmGenresCommandRepository implements IGenresCommandRepository {
  public constructor(private readonly unitOfWork: TypeOrmUnitOfWork) {}

  public async findOne(id: string): Promise<Genre> {
    const genreTypeOrm = await this.unitOfWork
      .getManager()
      .findOne(GenreTypeOrm, { where: { id } });

    if (!genreTypeOrm) {
      throw new GenreNotFoundException();
    }

    return GenresMapper.toDomain(genreTypeOrm);
  }

  public async save(genre: Genre): Promise<void> {
    await this.unitOfWork
      .getManager()
      .save(GenreTypeOrm, GenresMapper.toTypeOrm(genre));
  }

  public async delele(genre: Genre): Promise<void> {
    await this.unitOfWork
      .getManager()
      .delete(GenreTypeOrm, { where: { id: genre.getId() } });
  }
}
