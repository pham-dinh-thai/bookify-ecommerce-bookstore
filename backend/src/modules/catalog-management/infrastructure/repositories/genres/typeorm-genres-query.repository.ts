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

  public async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<GenreReadModel[]> {
    const query = this.repository.createQueryBuilder('genre');

    if (search) {
      query.where('genre.name LIKE :search', { search: `%${search}%` });
    }

    const genresTypeOrm = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return genresTypeOrm.map(
      (genreTypeOrm) => new GenreReadModel(genreTypeOrm.id, genreTypeOrm.name),
    );
  }

  public async findOne(id: string): Promise<GenreReadModel | null> {
    const genreTypeOrm = await this.repository.findOne({ where: { id } });

    return genreTypeOrm
      ? new GenreReadModel(genreTypeOrm.id, genreTypeOrm.name)
      : null;
  }

  public async count(search?: string): Promise<number> {
    const query = this.repository.createQueryBuilder('genre');

    if (search) {
      query.where('genre.name LIKE :search', { search: `%${search}%` });
    }

    return await query.getCount();
  }
}
