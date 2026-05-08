import { Author } from '../../domain/author-aggregate/author.aggregate';
import { AuthorReadModel } from '../../domain/author-aggregate/read-models/author.read-model';
import { AuthorTypeOrm } from '../entities/author.entity';

export class AuthorsMapper {
  public static toDomain(authorTypeOrm: AuthorTypeOrm): Author {
    return Author.fromPersistent(authorTypeOrm.id, authorTypeOrm.name);
  }

  public static toTypeOrm(author: Author): AuthorTypeOrm {
    const authorTypeOrm = new AuthorTypeOrm();

    authorTypeOrm.id = author.getId();
    authorTypeOrm.name = author.getName();

    return authorTypeOrm;
  }

  public static toReadModel(authorTypeOrm: AuthorTypeOrm): AuthorReadModel {
    return new AuthorReadModel(authorTypeOrm.id, authorTypeOrm.name);
  }
}
