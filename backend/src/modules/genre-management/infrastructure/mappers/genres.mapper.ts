import { Genre } from '../../domain/genre-aggregate/genre.aggregate';
import { GenreTypeOrm } from '../entities/genre.entity';

export class GenresMapper {
  public static toDomain(genreTypeOrm: GenreTypeOrm): Genre {
    return Genre.fromPersistent(genreTypeOrm.id, genreTypeOrm.name);
  }

  public static toTypeOrm(genre: Genre): GenreTypeOrm {
    const genreTypeOrm = new GenreTypeOrm();

    genreTypeOrm.id = genre.getId();
    genreTypeOrm.name = genre.getName();

    return genreTypeOrm;
  }
}
