import { Injectable } from '@nestjs/common';
import { IGenresQueryRepository } from '../../../domain/genre-aggregate/repositories/genres-query.repository.interface';
import { GenreReadModel } from '../../../domain/genre-aggregate/read-models/genre.read-model';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreTypeOrm } from '../../entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmGenresQueryRepository implements IGenresQueryRepository {
  public constructor(
    @InjectRepository(GenreTypeOrm)
    private readonly repository: Repository<GenreTypeOrm>,
  ) {}

  public async findAll(): Promise<GenreReadModel[]> {
    const genresTypeOrm = await this.repository.find();

    return genresTypeOrm
      ? genresTypeOrm.map(
          (genreTypeOrm) =>
            new GenreReadModel(genreTypeOrm.id, genreTypeOrm.name),
        )
      : [];
  }

  public async findOne(id: string): Promise<GenreReadModel | null> {
    const genreTypeOrm = await this.repository.findOne({ where: { id } });

    return genreTypeOrm
      ? new GenreReadModel(genreTypeOrm.id, genreTypeOrm.name)
      : null;
  }
}
